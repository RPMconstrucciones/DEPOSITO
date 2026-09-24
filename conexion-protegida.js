/**
 * PROTECCIÓN DE CONEXIÓN — RPM CONSTRUCCIONES — DEPÓSITO
 * ═══════════════════════════════════════════════════════════════════
 * FLUJO:
 *   1. Usuario presiona Guardar → se genera UUID único (_txid)
 *   2. Se intenta el envío REAL directamente (sin pre-ping que bloquee)
 *   3. ✅ Respuesta OK   → limpiar borrador, confirmar al usuario
 *   4. ❌ Error de RED   → encolar con su UUID, mostrar modal offline
 *   5. 🔄 Al reconectar → reenviar con mismo UUID (idempotente)
 *
 * EN EL SERVIDOR (Apps Script) agregar al inicio del doPost():
 *   var txid = payload._txid;
 *   if (txid) {
 *     var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("_txlog");
 *     if (!hoja) hoja = SpreadsheetApp.getActiveSpreadsheet().insertSheet("_txlog");
 *     var data = hoja.getDataRange().getValues();
 *     for (var i = 0; i < data.length; i++) {
 *       if (data[i][0] === txid) { return ContentService.createTextOutput(data[i][1]).setMimeType(ContentService.MimeType.JSON); }
 *     }
 *   }
 *   // ... tu lógica normal ...
 *   // Al final, antes de retornar, guardar el txid:
 *   if (txid) { hoja.appendRow([txid, JSON.stringify(resultado), new Date()]); }
 *   return ContentService.createTextOutput(JSON.stringify(resultado))...
 * ═══════════════════════════════════════════════════════════════════
 */
(function () {
  if (window.__PROTECCION_CONEXION_INIT__) return;
  window.__PROTECCION_CONEXION_INIT__ = true;

  // ──────────────────────────────────────────────────────────────
  // 1. GUARDAR fetch ORIGINAL antes de cualquier otra cosa
  // ──────────────────────────────────────────────────────────────
  const _fetchOriginal = window.fetch.bind(window);

  // ──────────────────────────────────────────────────────────────
  // 2. GENERADOR DE UUID v4
  // ──────────────────────────────────────────────────────────────
  function generarUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback para navegadores sin crypto.randomUUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  // ──────────────────────────────────────────────────────────────
  // 3. COLA PERSISTENTE (localStorage) + ESTADO
  // ──────────────────────────────────────────────────────────────
  const COLA_KEY = 'rpm_cola_pendiente';
  let colaPendiente = [];       // { txid, url, options, resolve, reject }
  let procesandoCola = false;
  let timerBanner = null;
  let callbackReintentoActual = null;

  function cargarColaPersistente() {
    try {
      const raw = localStorage.getItem(COLA_KEY);
      if (raw) {
        const items = JSON.parse(raw);
        // Los items de localStorage son sólo metadatos — al recargar
        // la página se limpian (las promesas resolve/reject no persisten)
        // pero sirven para mostrar cuántos quedaron pendientes
        return items;
      }
    } catch (e) {}
    return [];
  }

  function guardarColaPersistente() {
    try {
      const meta = colaPendiente.map(({ txid, url, options }) => ({
        txid,
        url: typeof url === 'string' ? url : '',
        body: (options && options.body) || null,
        headers: (options && options.headers) || null,
        method: (options && options.method) || 'POST',
        timestamp: Date.now()
      }));
      localStorage.setItem(COLA_KEY, JSON.stringify(meta));
    } catch (e) {}
  }

  function limpiarColaPersistente() {
    try { localStorage.removeItem(COLA_KEY); } catch (e) {}
  }

  // Al cargar la página, avisar si había pendientes de la sesión anterior
  (function avisarSiHabiaPendientes() {
    const prev = cargarColaPersistente();
    if (prev && prev.length > 0) {
      limpiarColaPersistente();
      setTimeout(function () {
        console.warn('[RPM] Había ' + prev.length + ' envío(s) pendiente(s) de la sesión anterior que no se pudieron completar.');
      }, 500);
    }
  })();

  // ──────────────────────────────────────────────────────────────
  // 4. INYECTOR DE _txid EN EL BODY DEL POST
  // ──────────────────────────────────────────────────────────────
  function inyectarTxid(options, txid) {
    if (!options || !options.body) return options;
    try {
      const payload = JSON.parse(options.body);
      if (typeof payload === 'object' && payload !== null) {
        if (!payload._txid) {
          payload._txid = txid;
          return Object.assign({}, options, { body: JSON.stringify(payload) });
        }
      }
    } catch (e) {
      // Body no es JSON (ej: FormData) — no inyectar
    }
    return options;
  }

  // ──────────────────────────────────────────────────────────────
  // 5. DETERMINAR SI UN ERROR ES DE RED (no de servidor)
  //    TypeError = fallo de red / CORS / timeout de red
  //    AbortError = timeout manual
  // ──────────────────────────────────────────────────────────────
  function esErrorDeRed(error) {
    if (!error) return false;
    const nombre = error.name || '';
    const msg    = (error.message || '').toLowerCase();
    return (
      nombre === 'TypeError' ||
      nombre === 'AbortError' ||
      msg.includes('failed to fetch') ||
      msg.includes('network') ||
      msg.includes('load failed') ||
      msg.includes('networkerror')
    );
  }

  // ──────────────────────────────────────────────────────────────
  // 6. INTERCEPTOR CENTRAL DE FETCH
  // ──────────────────────────────────────────────────────────────
  window.fetch = async function protectedFetch(url, options) {
    const method  = ((options && options.method) || 'GET').toUpperCase();
    const urlStr  = typeof url === 'string' ? url : '';

    // ── GETs: pasar directo sin interferir ──
    if (method === 'GET') {
      return _fetchOriginal(url, options);
    }

    // ── POSTs: generar UUID e inyectar ──
    const txid       = generarUUID();
    const optionsConTxid = inyectarTxid(options, txid);

    try {
      // Intento DIRECTO — sin pre-ping bloqueante
      const resp = await _fetchOriginal(url, optionsConTxid);
      // El servidor respondió (OK o error HTTP) → devolver tal cual
      // El código del HTML maneja resp.json() y sus propios errores
      return resp;

    } catch (error) {
      // ── Solo encolar si es un error REAL de red ──
      if (esErrorDeRed(error)) {
        return encolarRequest(url, optionsConTxid, txid);
      }
      // Otro tipo de error (ej: error de JS interno) → relanzar
      throw error;
    }
  };

  // ──────────────────────────────────────────────────────────────
  // 7. ENCOLAR PEDIDO FALLIDO
  // ──────────────────────────────────────────────────────────────
  function encolarRequest(url, options, txid) {
    return new Promise(function (resolve, reject) {
      // Evitar encolar dos veces el mismo txid
      const yaExiste = colaPendiente.some(function (item) { return item.txid === txid; });
      if (!yaExiste) {
        colaPendiente.push({ txid, url, options, resolve, reject });
        guardarColaPersistente();
      }

      const n = colaPendiente.length;
      mostrarBanner(false, '⚠️ Sin conexión — ' + n + ' envío' + (n !== 1 ? 's' : '') + ' en espera');
      abrirCartel(null);
    });
  }

  // ──────────────────────────────────────────────────────────────
  // 8. PROCESAR COLA AL RECONECTAR
  // ──────────────────────────────────────────────────────────────
  async function procesarCola() {
    if (procesandoCola || colaPendiente.length === 0) return;
    procesandoCola = true;

    const total = colaPendiente.length;
    mostrarBanner(true, '🔄 Reenviando ' + total + ' pedido' + (total !== 1 ? 's' : '') + ' pendiente' + (total !== 1 ? 's' : '') + '...');

    while (colaPendiente.length > 0) {
      const item = colaPendiente[0]; // No hacer shift hasta confirmar éxito

      try {
        const resp = await _fetchOriginal(item.url, item.options);
        // Éxito → sacar de la cola y resolver la promesa original
        colaPendiente.shift();
        guardarColaPersistente();
        item.resolve(resp);
      } catch (error) {
        if (esErrorDeRed(error)) {
          // La conexión volvió a caerse — detener el procesamiento
          procesandoCola = false;
          mostrarBanner(false, '⚠️ Conexión interrumpida — ' + colaPendiente.length + ' envío' + (colaPendiente.length !== 1 ? 's' : '') + ' aún en espera');
          abrirCartel(null);
          return;
        }
        // Error de servidor (no de red) → sacar de cola igual
        // (el servidor lo rechazó pero lo recibió — no reintentar)
        colaPendiente.shift();
        guardarColaPersistente();
        item.reject(error);
      }
    }

    procesandoCola = false;
    limpiarColaPersistente();
    mostrarBanner(true, '✅ Todos los datos enviados correctamente');
  }

  // ──────────────────────────────────────────────────────────────
  // 9. ESTILOS
  // ──────────────────────────────────────────────────────────────
  function inyectarEstilos() {
    if (document.getElementById('estilos-proteccion-conexion')) return;
    const style = document.createElement('style');
    style.id = 'estilos-proteccion-conexion';
    style.textContent = `
      #banner-estado-conexion {
        position: fixed; top: 14px; left: 50%;
        transform: translateX(-50%) translateY(-100px);
        z-index: 9999999; padding: 10px 22px; border-radius: 9999px;
        font-size: 0.88rem; font-weight: 600;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        display: flex; align-items: center; gap: 10px;
        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.55);
        transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease;
        opacity: 0; pointer-events: none; white-space: nowrap;
      }
      #banner-estado-conexion.show {
        transform: translateX(-50%) translateY(0); opacity: 1; pointer-events: auto;
      }
      #banner-estado-conexion.offline {
        background: linear-gradient(135deg,#7f1d1d,#991b1b);
        color: #fef2f2; border: 1px solid #ef4444;
      }
      #banner-estado-conexion.online {
        background: linear-gradient(135deg,#14532d,#166534);
        color: #f0fdf4; border: 1px solid #22c55e;
      }
      #cartel-falla-conexion-overlay {
        position: fixed; inset: 0; z-index: 10000000;
        background: rgba(15,23,42,0.88);
        backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
        padding: 20px; opacity: 0; pointer-events: none;
        transition: opacity 0.25s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      #cartel-falla-conexion-overlay.show { opacity: 1; pointer-events: auto; }
      #cartel-falla-conexion-modal {
        background: #1e293b; border: 1px solid rgba(239,68,68,0.45);
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.75), 0 0 35px rgba(239,68,68,0.15);
        border-radius: 20px; max-width: 440px; width: 100%;
        padding: 26px; text-align: center; color: #f8fafc;
        transform: scale(0.92) translateY(20px);
        transition: transform 0.25s cubic-bezier(0.16,1,0.3,1); box-sizing: border-box;
      }
      #cartel-falla-conexion-overlay.show #cartel-falla-conexion-modal {
        transform: scale(1) translateY(0);
      }
      .cartel-icon-wrapper {
        width: 64px; height: 64px; margin: 0 auto 16px;
        background: rgba(239,68,68,0.15); border: 2px solid rgba(239,68,68,0.4);
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-size: 30px; animation: cartelPulse 2s infinite ease-in-out;
      }
      @keyframes cartelPulse {
        0%,100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
        50%      { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(239,68,68,0); }
      }
      .cartel-titulo { font-size: 1.2rem; font-weight: 700; color: #fff; margin-bottom: 6px; letter-spacing: -0.02em; }
      .cartel-cola-badge {
        display: inline-block; background: rgba(251,191,36,0.15);
        border: 1px solid rgba(251,191,36,0.35); color: #fbbf24;
        font-size: 0.8rem; font-weight: 700; padding: 6px 14px;
        border-radius: 8px; margin: 8px 0 14px;
      }
      .cartel-alerta {
        font-size: 0.95rem; font-weight: 700; color: #fca5a5;
        background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.25);
        padding: 11px 14px; border-radius: 10px; margin-bottom: 12px; line-height: 1.4;
      }
      .cartel-info {
        font-size: 0.88rem; color: #94a3b8; line-height: 1.55; margin-bottom: 18px;
      }
      .cartel-badge-estado {
        display: inline-flex; align-items: center; gap: 8px;
        font-size: 0.8rem; font-weight: 600; padding: 5px 13px;
        border-radius: 9999px; margin-bottom: 20px; transition: all 0.3s;
      }
      .cartel-badge-estado.offline { background: rgba(239,68,68,0.15); color: #fca5a5; border: 1px solid rgba(239,68,68,0.3); }
      .cartel-badge-estado.online  { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); }
      .cartel-botones { display: flex; flex-direction: column; gap: 10px; }
      .cartel-btn-primary {
        background: linear-gradient(135deg,#2563eb,#1d4ed8); color: #fff;
        font-weight: 700; font-size: 0.95rem; padding: 13px 20px; border-radius: 12px;
        border: none; cursor: pointer; display: flex; align-items: center;
        justify-content: center; gap: 8px; transition: all 0.2s;
        box-shadow: 0 4px 14px rgba(37,99,235,0.35);
      }
      .cartel-btn-primary:hover  { filter: brightness(1.1); transform: translateY(-1px); }
      .cartel-btn-primary:active { transform: translateY(0); }
      .cartel-btn-primary:disabled { opacity: 0.6; cursor: wait; }
      .cartel-btn-secondary {
        background: rgba(255,255,255,0.05); color: #94a3b8;
        font-size: 0.86rem; font-weight: 500; padding: 10px 16px;
        border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);
        cursor: pointer; transition: all 0.2s;
      }
      .cartel-btn-secondary:hover { background: rgba(255,255,255,0.1); color: #fff; }
    `;
    document.head.appendChild(style);
  }

  // ──────────────────────────────────────────────────────────────
  // 10. DOM DEL MODAL Y BANNER
  // ──────────────────────────────────────────────────────────────
  function inicializarDOM() {
    inyectarEstilos();
    if (document.getElementById('cartel-falla-conexion-overlay')) return;

    // Banner
    const banner = document.createElement('div');
    banner.id = 'banner-estado-conexion';
    banner.innerHTML = '<span id="banner-icono">⚠️</span><span id="banner-texto">Sin conexión — Envíos pausados</span>';
    document.body.appendChild(banner);

    // Modal
    const modal = document.createElement('div');
    modal.id = 'cartel-falla-conexion-overlay';
    modal.innerHTML = `
      <div id="cartel-falla-conexion-modal" role="dialog" aria-modal="true" aria-labelledby="cartel-titulo">
        <div class="cartel-icon-wrapper">📡</div>
        <div class="cartel-titulo" id="cartel-titulo">Sin conexión a internet</div>
        <div class="cartel-cola-badge" id="cartel-cola-badge"></div>
        <div class="cartel-alerta">⚠️ El envío no se completó por falta de conexión.</div>
        <p class="cartel-info">
          Los datos <strong style="color:#38bdf8">NO se perdieron</strong>.<br>
          Están guardados en cola y se enviarán <strong style="color:#4ade80">automáticamente</strong>
          en cuanto se restablezca la conexión.<br><br>
          <span style="color:#64748b;font-size:0.82rem">Cada envío tiene un ID único — no habrá duplicados en la planilla.</span>
        </p>
        <div>
          <span class="cartel-badge-estado offline" id="cartel-badge-estado">
            <span>🔴</span> Sin conexión
          </span>
        </div>
        <div class="cartel-botones">
          <button class="cartel-btn-primary" id="cartel-btn-reintentar">
            <span>🔄</span> Intentar de nuevo ahora
          </button>
          <button class="cartel-btn-secondary" id="cartel-btn-cerrar">
            Revisar datos en pantalla
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('cartel-btn-cerrar').addEventListener('click', cerrarCartel);

    document.getElementById('cartel-btn-reintentar').addEventListener('click', async function () {
      const btn = this;
      btn.disabled = true;
      btn.innerHTML = '<span>⏳</span> Verificando...';

      // Verificar conexión real con un GET a generate_204
      let hayConexion = false;
      try {
        const ctrl = new AbortController();
        const tid = setTimeout(function () { ctrl.abort(); }, 4000);
        const r = await _fetchOriginal('https://www.google.com/generate_204?_chk=' + Date.now(), {
          method: 'GET', cache: 'no-store', signal: ctrl.signal
        });
        clearTimeout(tid);
        hayConexion = r.status === 204 || r.ok;
      } catch (e) {
        hayConexion = false;
      }

      btn.disabled = false;
      btn.innerHTML = '<span>🔄</span> Intentar de nuevo ahora';

      if (!hayConexion) {
        actualizarBadge(false);
        mostrarBanner(false, '⚠️ Aún sin conexión. Esperá unos segundos.');
        return;
      }

      cerrarCartel();

      if (typeof callbackReintentoActual === 'function') {
        const fn = callbackReintentoActual;
        callbackReintentoActual = null;
        fn();
      } else {
        procesarCola();
      }
    });
  }

  // ──────────────────────────────────────────────────────────────
  // 11. BANNER
  // ──────────────────────────────────────────────────────────────
  function mostrarBanner(online, texto) {
    inicializarDOM();
    const el = document.getElementById('banner-estado-conexion');
    if (!el) return;
    clearTimeout(timerBanner);
    el.className = online ? 'show online' : 'show offline';
    const ic = document.getElementById('banner-icono');
    const tx = document.getElementById('banner-texto');
    if (ic) ic.textContent = online ? '✅' : '⚠️';
    if (tx) tx.textContent = texto || (online ? 'Conexión restablecida' : 'Sin conexión — Envíos pausados');
    if (online) timerBanner = setTimeout(function () { el.classList.remove('show'); }, 4000);
  }

  // ──────────────────────────────────────────────────────────────
  // 12. MODAL — ABRIR / CERRAR / BADGE
  // ──────────────────────────────────────────────────────────────
  function abrirCartel(onRetry) {
    inicializarDOM();
    callbackReintentoActual = onRetry || null;
    actualizarBadge(false);

    const badge = document.getElementById('cartel-cola-badge');
    if (badge) {
      const n = colaPendiente.length;
      badge.textContent = n > 0
        ? '📋 ' + n + ' envío' + (n !== 1 ? 's' : '') + ' en cola — ID único asignado'
        : '';
      badge.style.display = n > 0 ? 'inline-block' : 'none';
    }

    const overlay = document.getElementById('cartel-falla-conexion-overlay');
    if (overlay) overlay.classList.add('show');
  }

  function cerrarCartel() {
    const overlay = document.getElementById('cartel-falla-conexion-overlay');
    if (overlay) overlay.classList.remove('show');
  }

  function actualizarBadge(online) {
    const badge = document.getElementById('cartel-badge-estado');
    if (!badge) return;
    if (online) {
      badge.className = 'cartel-badge-estado online';
      badge.innerHTML = '<span>🟢</span> Conexión restablecida';
    } else {
      badge.className = 'cartel-badge-estado offline';
      badge.innerHTML = '<span>🔴</span> Sin conexión a internet';
    }
  }

  // ──────────────────────────────────────────────────────────────
  // 13. EVENTOS DE RED
  // ──────────────────────────────────────────────────────────────
  window.addEventListener('online', async function () {
    mostrarBanner(true, '✅ Conexión restablecida — verificando...');
    actualizarBadge(true);
    // Esperar que la conexión se estabilice
    await new Promise(function (r) { setTimeout(r, 1500); });
    // Verificar que sea real
    let ok = false;
    try {
      const r = await _fetchOriginal('https://www.google.com/generate_204?_chk=' + Date.now(), { method: 'GET', cache: 'no-store' });
      ok = r.status === 204 || r.ok;
    } catch (e) { ok = false; }

    if (ok) {
      cerrarCartel();
      if (colaPendiente.length > 0) procesarCola();
      else mostrarBanner(true, '✅ Conexión restablecida');
    } else {
      mostrarBanner(false, '⚠️ La red aún es inestable');
    }
  });

  window.addEventListener('offline', function () {
    mostrarBanner(false);
    actualizarBadge(false);
  });

  // ──────────────────────────────────────────────────────────────
  // 14. AVISO AL CERRAR SI HAY PENDIENTES
  // ──────────────────────────────────────────────────────────────
  window.addEventListener('beforeunload', function (e) {
    if (colaPendiente.length > 0) {
      const msg = 'Hay ' + colaPendiente.length + ' envío(s) pendientes. Si cerrás la página, se perderán.';
      e.preventDefault();
      e.returnValue = msg;
      return msg;
    }
  });

  // ──────────────────────────────────────────────────────────────
  // 15. API PÚBLICA (retrocompatibilidad)
  // ──────────────────────────────────────────────────────────────
  window.mostrarCartelFallaConexion = function (cb) { abrirCartel(cb); };
  window.cerrarCartelFallaConexion  = cerrarCartel;
  window.verificarConexionReal      = async function () {
    try {
      const r = await _fetchOriginal('https://www.google.com/generate_204?_chk=' + Date.now(), { method: 'GET', cache: 'no-store' });
      return r.status === 204 || r.ok;
    } catch (e) { return false; }
  };

  // ──────────────────────────────────────────────────────────────
  // 16. INIT
  // ──────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarDOM);
  } else {
    inicializarDOM();
  }

})();
