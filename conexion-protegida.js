/**
 * PROTECCIÓN DE CONEXIÓN Y CARTEL DE FALLA (RPM CONSTRUCCIONES - DEPÓSITO)
 * Evita el envío de datos si no hay conexión a internet o si el envío falla.
 * Muestra un cartel modal que avisa que no se cargaron los datos y permite intentar de nuevo.
 */
(function () {
  if (window.__PROTECCION_CONEXION_INIT__) return;
  window.__PROTECCION_CONEXION_INIT__ = true;

  let callbackReintentoActual = null;
  let timerBanner = null;

  function inyectarEstilosProteccion() {
    if (document.getElementById('estilos-proteccion-conexion')) return;
    const style = document.createElement('style');
    style.id = 'estilos-proteccion-conexion';
    style.textContent = `
      #banner-estado-conexion {
        position: fixed;
        top: 14px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        z-index: 9999999;
        padding: 10px 22px;
        border-radius: 9999px;
        font-size: 0.88rem;
        font-weight: 600;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.55), 0 0 15px rgba(0,0,0,0.25);
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        opacity: 0;
        pointer-events: none;
      }
      #banner-estado-conexion.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
        pointer-events: auto;
      }
      #banner-estado-conexion.offline {
        background: linear-gradient(135deg, #7f1d1d, #991b1b);
        color: #fef2f2;
        border: 1px solid #ef4444;
      }
      #banner-estado-conexion.online {
        background: linear-gradient(135deg, #14532d, #166534);
        color: #f0fdf4;
        border: 1px solid #22c55e;
      }

      #cartel-falla-conexion-overlay {
        position: fixed;
        inset: 0;
        z-index: 10000000;
        background: rgba(15, 23, 42, 0.85);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      #cartel-falla-conexion-overlay.show {
        opacity: 1;
        pointer-events: auto;
      }
      #cartel-falla-conexion-modal {
        background: #1e293b;
        border: 1px solid rgba(239, 68, 68, 0.45);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 35px rgba(239, 68, 68, 0.2);
        border-radius: 20px;
        max-width: 440px;
        width: 100%;
        padding: 26px;
        text-align: center;
        color: #f8fafc;
        transform: scale(0.92) translateY(20px);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        box-sizing: border-box;
      }
      #cartel-falla-conexion-overlay.show #cartel-falla-conexion-modal {
        transform: scale(1) translateY(0);
      }
      .cartel-icon-wrapper {
        width: 64px;
        height: 64px;
        margin: 0 auto 16px;
        background: rgba(239, 68, 68, 0.15);
        border: 2px solid rgba(239, 68, 68, 0.4);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        animation: cartelPulseAnim 2s infinite ease-in-out;
      }
      @keyframes cartelPulseAnim {
        0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
        50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
      }
      .cartel-titulo {
        font-size: 1.25rem;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 8px;
        letter-spacing: -0.02em;
      }
      .cartel-alerta-destacada {
        font-size: 1.05rem;
        font-weight: 700;
        color: #fca5a5;
        background: rgba(239, 68, 68, 0.14);
        border: 1px solid rgba(239, 68, 68, 0.28);
        padding: 12px 14px;
        border-radius: 10px;
        margin: 12px 0 14px;
        line-height: 1.4;
      }
      .cartel-mensaje {
        font-size: 0.9rem;
        color: #94a3b8;
        line-height: 1.5;
        margin-bottom: 16px;
      }
      .cartel-badge-estado {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 0.82rem;
        font-weight: 600;
        padding: 6px 14px;
        border-radius: 9999px;
        margin-bottom: 22px;
        transition: all 0.3s ease;
      }
      .cartel-badge-estado.offline {
        background: rgba(239, 68, 68, 0.18);
        color: #fca5a5;
        border: 1px solid rgba(239, 68, 68, 0.3);
      }
      .cartel-badge-estado.online {
        background: rgba(34, 197, 94, 0.18);
        color: #4ade80;
        border: 1px solid rgba(34, 197, 94, 0.3);
      }
      .cartel-botones {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .cartel-btn-primary {
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: #ffffff;
        font-weight: 700;
        font-size: 0.96rem;
        padding: 13px 20px;
        border-radius: 12px;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.2s ease;
        box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
      }
      .cartel-btn-primary:hover {
        background: linear-gradient(135deg, #1d4ed8, #1e40af);
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
      }
      .cartel-btn-primary:active {
        transform: translateY(0);
      }
      .cartel-btn-secondary {
        background: rgba(255, 255, 255, 0.05);
        color: #cbd5e1;
        font-size: 0.88rem;
        font-weight: 500;
        padding: 10px 16px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .cartel-btn-secondary:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
      }
    `;
    document.head.appendChild(style);
  }

  function inicializarElementosDOM() {
    inyectarEstilosProteccion();
    if (document.getElementById('cartel-falla-conexion-overlay')) return;

    const divBanner = document.createElement('div');
    divBanner.id = 'banner-estado-conexion';
    divBanner.innerHTML = `
      <span id="banner-icono">⚠️</span>
      <span id="banner-texto">Sin conexión a internet — Envíos pausados</span>
    `;
    document.body.appendChild(divBanner);

    const divCartel = document.createElement('div');
    divCartel.id = 'cartel-falla-conexion-overlay';
    divCartel.innerHTML = `
      <div id="cartel-falla-conexion-modal" role="dialog" aria-modal="true" aria-labelledby="cartel-titulo">
        <div class="cartel-icon-wrapper">
          <span id="cartel-icon">📡</span>
        </div>
        <div class="cartel-titulo" id="cartel-titulo">Falla de Conexión</div>
        <div class="cartel-alerta-destacada">
          ⚠️ No se cargaron los datos por falla de conexión. Intentar de nuevo.
        </div>
        <p class="cartel-mensaje">
          Se detectó una interrupción en la conexión a internet.<br>
          <strong style="color: #38bdf8;">Los datos cargados NO se perdieron</strong> y siguen guardados en pantalla. No se enviarán hasta que la conexión se restablezca.
        </p>
        <div>
          <span class="cartel-badge-estado offline" id="cartel-badge-estado">
            <span style="font-size: 10px;">🔴</span> Sin conexión a internet
          </span>
        </div>
        <div class="cartel-botones">
          <button class="cartel-btn-primary" id="cartel-btn-reintentar">
            <span>🔄</span> Intentar de nuevo
          </button>
          <button class="cartel-btn-secondary" id="cartel-btn-cerrar">
            Revisar datos en pantalla
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(divCartel);

    document.getElementById('cartel-btn-cerrar').addEventListener('click', function () {
      cerrarCartelFallaConexion();
    });

    document.getElementById('cartel-btn-reintentar').addEventListener('click', async function () {
      const btn = this;
      const originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span>⏳</span> Verificando conexión...';

      const hayConexion = await verificarConexionReal();
      if (!hayConexion) {
        btn.disabled = false;
        btn.innerHTML = '<span>🔄</span> Intentar de nuevo';
        actualizarBadgeCartel(false);
        mostrarBannerConexion(false, '⚠️ Aún sin conexión. Esperá unos segundos.');
        return;
      }

      btn.disabled = false;
      btn.innerHTML = originalHtml;
      cerrarCartelFallaConexion();
      if (typeof callbackReintentoActual === 'function') {
        const fn = callbackReintentoActual;
        callbackReintentoActual = null;
        fn();
      }
    });
  }

  function mostrarBannerConexion(online, textoPersonalizado) {
    inicializarElementosDOM();
    const banner = document.getElementById('banner-estado-conexion');
    if (!banner) return;
    clearTimeout(timerBanner);

    banner.className = online ? 'show online' : 'show offline';
    const iconoEl = document.getElementById('banner-icono');
    const textoEl = document.getElementById('banner-texto');
    if (iconoEl) iconoEl.textContent = online ? '✅' : '⚠️';
    if (textoEl) textoEl.textContent = textoPersonalizado || (online ? 'Conexión restablecida' : 'Sin conexión a internet — Envíos pausados');

    if (online) {
      timerBanner = setTimeout(() => {
        banner.classList.remove('show');
      }, 3500);
    }
  }

  function actualizarBadgeCartel(online) {
    const badge = document.getElementById('cartel-badge-estado');
    if (!badge) return;
    if (online) {
      badge.className = 'cartel-badge-estado online';
      badge.innerHTML = '<span style="font-size: 10px;">🟢</span> Conexión restablecida — Listo para reintentar';
    } else {
      badge.className = 'cartel-badge-estado offline';
      badge.innerHTML = '<span style="font-size: 10px;">🔴</span> Sin conexión a internet';
    }
  }

  async function verificarConexionReal() {
    if (!navigator.onLine) return false;
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 4000);
      const targetUrl = (typeof APPS_SCRIPT_URL !== 'undefined' ? APPS_SCRIPT_URL : (window.CONFIG && CONFIG.WEB_APP_URL ? CONFIG.WEB_APP_URL : 'https://www.google.com/generate_204'));
      await fetch(targetUrl + (targetUrl.includes('?') ? '&' : '?') + '_chk=' + Date.now(), {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-store',
        signal: ctrl.signal
      });
      clearTimeout(tid);
      return true;
    } catch (e) {
      return false;
    }
  }

  window.mostrarCartelFallaConexion = function (onRetryCallback) {
    inicializarElementosDOM();
    callbackReintentoActual = onRetryCallback || null;
    actualizarBadgeCartel(navigator.onLine);
    const overlay = document.getElementById('cartel-falla-conexion-overlay');
    if (overlay) overlay.classList.add('show');
  };

  window.cerrarCartelFallaConexion = function () {
    const overlay = document.getElementById('cartel-falla-conexion-overlay');
    if (overlay) overlay.classList.remove('show');
  };

  window.verificarConexionReal = verificarConexionReal;

  window.addEventListener('online', () => {
    mostrarBannerConexion(true);
    actualizarBadgeCartel(true);
  });

  window.addEventListener('offline', () => {
    mostrarBannerConexion(false);
    actualizarBadgeCartel(false);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarElementosDOM);
  } else {
    inicializarElementosDOM();
  }
})();
