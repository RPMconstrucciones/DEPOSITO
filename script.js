// ============================================================
// APPS SCRIPT UNIFICADO — RPM Construcciones
// v1.0 — Primera versión con estructura estandarizada
// Un solo script maneja TODOS los formularios de depósito y traslados.
// Cada formulario manda el campo "zona" para identificarse.
// ============================================================

// ============================================================
// 1. CONFIG Y CONSTANTES
// ============================================================

// ============================================================
// 1.1 Familias y orden de descripción
// ============================================================
const ORDEN_DESCRIPCION = {
  termicas:      ['amperaje', 'polos', 'curva', 'tension'],
  disyuntores:   ['polos', 'amperaje', 'sensibilidad', 'tipo', 'tension'],
  guardamotores: ['rango', 'tension', 'montaje'],
  alta_potencia: ['material', 'configuracion', 'seccion', 'presentacion', 'nro_bobina', 'codigo_bobina', 'peso_bobina'],
  borneras:      ['tipo', 'corriente'],
  borneras_barra:['tipo', 'puntos', 'corriente'],
  fusibles:      ['tipo', 'amperaje', 'tension'],
  portafusibles: ['fusible', 'amperaje_max', 'montaje'],
  fuentes:       ['tipo', 'tension_salida', 'potencia', 'corriente', 'ip', 'tension_entrada'],
  fuentes_led:   ['tipo', 'tension_salida', 'potencia', 'corriente', 'ip', 'tension_entrada'],
  dmx:           ['tension', 'corriente', 'potencia'],
  lamparas:      ['tipo', 'marca', 'potencia', 'base', 'voltaje', 'color_luz', 'modelo'],
  contactores:   ['polos', 'bobina', 'corriente'],
  pulsadores:    ['tipo', 'color', 'contacto'],
  ojosbuey:      ['color', 'tension', 'diametro'],
  bloqueaux:     ['tipo'],
  terminales:    ['material', 'medida', 'ojal'],
  gabinetes: ['tipo', 'dimensiones', 'soporte', 'rieldim', 'ip'],
  cajas:     ['tipo', 'maxmodulos', 'dimensiones', 'ip'],
  filtros:              ['maquina', 'tipo'],
  aceites:              ['tipo', 'viscosidad', 'marca', 'presentacion'],
  pinturas:             ['tipo', 'color', 'presentacion', 'marca'],
  selladores:           ['tipo', 'variante', 'marca'],
  aerosoles:            ['tipo', 'marca', 'tamano'],
  cintas:               ['tipo', 'marca'],
  abrasivos:            ['tipo', 'medida', 'marca'],
  mechas:               ['tipo', 'medida', 'marca'],
  electrodos:           ['tipo', 'diametro', 'marca'],
  precintos:            ['medida', 'color', 'marca'],
  herramientas_pintura: ['tipo', 'medida', 'marca'],
  varios:               ['tipo', 'presentacion', 'marca'],
  aplique_ext:       ['subtipo', 'direccion', 'zocalo', 'potencia', 'color_luz', 'marca', 'condicion'],
  empotrable:        ['subtipo', 'forma', 'potencia', 'color_luz', 'alimentacion', 'ip', 'condicion'],
  aplique_int:       ['forma', 'direccion', 'color_estructura', 'condicion'],
  colgante:          ['modelo', 'config', 'potencia_lampara', 'condicion'],
  proyector_hid:     ['tipo_lampara', 'potencia', 'componentes', 'condicion'],
  reflector_led:     ['subtipo', 'potencia', 'color_luz', 'linea', 'marca', 'condicion'],
  reflector_rgb:     ['leds', 'control', 'condicion'],
  banador:           ['formato', 'longitud', 'voltaje', 'potencia', 'leds_config', 'color_luz', 'control', 'ip', 'condicion'],
  tira_led:          ['voltaje', 'chip', 'densidad', 'color_luz', 'formato_venta', 'ip', 'condicion', 'marca'],
  led_e27:           ['subtipo', 'potencia', 'color_luz', 'formato', 'marca', 'condicion'],
  dicroica_led:      ['zocalo', 'potencia', 'color_luz', 'angulo', 'marca', 'condicion'],
  tubo_fluor:        ['tipo', 'potencia', 'color_luz', 'marca', 'condicion'],
  bajo_consumo:      ['subtipo', 'zocalo', 'potencia', 'color_luz', 'modelo', 'marca', 'condicion'],
  sodio:             ['tecnologia', 'potencia', 'zocalo', 'formato', 'marca', 'condicion'],
  dicroica_halogena: ['subtipo', 'potencia', 'voltaje', 'marca', 'condicion'],
  guantes:     ['tipo', 'talle', 'estado'],
  anteojos:    ['tipo', 'lente', 'estado'],
  protectores: ['tipo', 'estado'],
  cascos:      ['color', 'equipamiento', 'estado'],
  botas:       ['talle', 'tipo', 'estado'],
  botines:     ['tipo', 'talle', 'color', 'estado'],
  botines_mujer: ['tipo', 'talle', 'color', 'estado'],
  bolsos:      ['tipo', 'estado'],
  arneses:     ['tipo', 'color', 'estado', 'accesorios'],
  eslingas:    ['longitud', 'color_faja', 'ancho', 'norma', 'estado'],
  criquets:    ['tipo', 'capacidad', 'longitud', 'estado'],
  ccamisas:     ['tejido', 'talle', 'color', 'tipo', 'estado'],
  pantalones:  ['tejido', 'talle', 'color', 'tipo', 'estado'],
  camperas:    ['talle', 'color', 'tipo', 'estado'],
  mamelucos:   ['tipo', 'talle', 'estado'],
  chalecos:    ['color', 'talle', 'estado'],
  delantales:  ['tipo', 'talle', 'color', 'estado'],
  capas:       ['color', 'tipo', 'talle', 'estado'],
  canopvc:    ['tipo_estructura', 'diametro', 'presentacion', 'color_norma', 'marca'],
  canohierro: ['material', 'diametro', 'longitud', 'aplicacion', 'terminacion'],
  canosanit:  ['diametro', 'servicio', 'longitud', 'tipo_union', 'uso', 'marca'],
  gabmetalico:   ['modelo', 'dimensiones', 'config_interna'],
  gabestanco:    ['marca', 'modelo', 'tapa'],
  gabmedidor:    ['tipo_aplicacion', 'config_conexion'],
  cajapaso:      ['dimensiones', 'marca', 'hermeticidad'],
  cajaembutir:   ['modelo', 'instalacion', 'marca'],
  conectores:    ['material', 'diametro', 'marca'],
  curvas:        ['material', 'diametro', 'marca'],
  uniones:       ['material', 'diametro', 'tipo_ajuste'],
  prensas:       ['tipo', 'material', 'diametro', 'marca'],
  mecanismos:    ['tipo_componente', 'linea', 'color'],
  pat:           ['tipo_equipo', 'estado'],
  unipolar:  ['seccion', 'version', 'color', 'presentacion', 'nro_bobina', 'codigo_bobina', 'peso_bobina'],
  ttr:       ['conductores', 'seccion', 'presentacion', 'nro_bobina', 'codigo_bobina', 'peso_bobina'],
  subterraneo: ['material', 'configuracion', 'seccion', 'presentacion', 'nro_bobina', 'codigo_bobina', 'peso_bobina'],
  preen:     ['config', 'seccion', 'presentacion', 'nro_bobina', 'codigo_bobina', 'peso_bobina'],
  conc:      ['material', 'config', 'presentacion', 'nro_bobina', 'codigo_bobina', 'peso_bobina'],
  desnudo:   ['material', 'seccion', 'presentacion', 'nro_bobina', 'codigo_bobina', 'peso_bobina'],
  especial:  ['tipo', 'presentacion', 'nro_bobina', 'codigo_bobina', 'peso_bobina'],
  termcu:    ['seccion', 'subtipo'],
  termal:    ['seccion', 'ojal'],
  puntera:   ['seccion'],
  empalme:   ['tipo', 'seccion'],
  herraje:   ['tipo', 'modelo'],
  prensa:    ['diametro', 'material'],
  herr_portatiles: ['tipo', 'alimentacion', 'capacidad', 'marca'],
  maq_banco:       ['tipo', 'capacidad', 'alimentacion', 'marca'],
  corte_manual:    ['tipo', 'configuracion', 'marca'],
  maq_pesada:      ['tipo', 'tambor', 'encastre', 'marca'],
  generadores:     ['potencia', 'combustible', 'arranque', 'marca'],
  compresores:     ['capacidad_tanque', 'potencia', 'transmision', 'marca'],
  mano:         ['tipo', 'medida', 'marca'],
  llaves:       ['tipo', 'medida', 'formato', 'marca'],
  medicion:     ['tipo', 'medida', 'marca'],
  albanileria:  ['tipo', 'marca'],
  escaleras:    ['tipo', 'material', 'peldanos'],
  excavacion:   ['tipo', 'medida', 'material'],
  varios_panol: ['tipo', 'especificacion', 'marca'],
  adhesivos:    ['tipo', 'variante', 'marca'],
  senalizacion: ['tipo', 'medida', 'color'],
  embutidos:   ['tipo', 'potencia', 'tension', 'dimensiones'],
  alumbrado:   ['tipo', 'modelo', 'potencia', 'temperatura', 'dimensiones'],
  reflectores: ['tipo', 'potencia', 'temperatura'],
  proyectores: ['tipo', 'potencia', 'temperatura'],
  apliques:    ['tipo', 'potencia', 'ip', 'temperatura', 'dimensiones'],
  especiales:  ['tipo', 'dimensiones'],
  rotos:       ['tipo', 'marca', 'potencia', 'base', 'problema', 'problema_detalle', 'dimensiones'],
  // ── Instalación Eléctrica (formulario nuevo) ──
  modulos:     ['tipo', 'subtipo', 'color'],
  cajas_ie:    ['formato', 'material', 'medida'],
  canieria:    ['tipo', 'material', 'diametro_medida', 'color']
};

const FAMILIAS = {
  termicas:      'Térmica',
  disyuntores:   'Disyuntor Diferencial',
  guardamotores: 'Guardamotor',
  borneras:      'Bornera Fija',
  borneras_barra:'Bornera de Barra',
  fusibles:      'Fusible',
  portafusibles: 'Portafusible',
  fuentes:       'Fuente de Alimentación',
  fuentes_led:   'Fuente Especial LED Lineal',
  dmx:           'Decodificador DMX',
  lamparas:      'Lámpara / Foco',
  contactores:   'Contactor',
  pulsadores:    'Pulsador',
  ojosbuey:      'Ojo de Buey',
  bloqueaux:     'Bloque de Contacto Auxiliar',
  terminales:    'Terminal / Conector',
  filtros:       'Filtro',
  aceites:       'Aceite / Lubricante',
  pinturas:      'Pintura / Recubrimiento',
  selladores:    'Sellador / Adhesivo',
  aerosoles:     'Aerosol Técnico',
  cintas:        'Cinta',
  abrasivos:     'Abrasivo (Disco/Lija)',
  mechas:        'Mecha / Accesorio',
  electrodos:    'Electrodo',
  precintos:     'Precinto',
  herramientas_pintura: 'Herramientas de Pintura',
  varios:        'Varios / Ferretería',
  aplique_ext:   'Aplique Exterior',
  empotrable:    'Empotrable / Estaca',
  aplique_int:   'Aplique Interior',
  colgante:      'Colgante Industrial',
  proyector_hid: 'Proyector HID',
  reflector_led: 'Reflector LED',
  reflector_rgb: 'Reflector RGB DMX',
  banador:       'Bañador / Wallwasher',
  tira_led:      'Tira LED',
  led_e27:       'Lámpara LED E27',
  dicroica_led:  'Dicroica LED',
  tubo_fluor:    'Tubo Fluorescente',
  bajo_consumo:  'Bajo Consumo / PLC',
  sodio:         'Sodio / Mercurio',
  dicroica_halogena: 'Dicroica / Halógena',
  guantes:       'Guantes',
  anteojos:      'Anteojos / Antiparras',
  protectores:   'Protector Facial / Auditivo',
  cascos:        'Casco de Seguridad',
  botas:         'Botas de Goma',
  botines:       'Botines de Seguridad',
  botines_mujer: 'Botín Capri Gray PU (Mujer)',
  bolsos:        'Bolso / Porta Herramienta',
  arneses:       'Equipos de Altura y Sujeción',
  eslingas:      'Eslinga de Faja',
  criquets:      'Criquet Tensor',
  camisas:       'Camisa de Trabajo',
  pantalones:    'Pantalón de Trabajo',
  camperas:      'Campera de Trabajo',
  mamelucos:     'Mameluco',
  chalecos:      'Chaleco Fluorescente',
  delantales:    'Delantal / Saco Soldador',
  capas:         'Capa de Lluvia',
  canopvc:       'Caño Eléctrico PVC',
  canohierro:    'Caño Hierro / Chapa',
  canosanit:     'Caño PVC Sanitario',
  gabmetalico:   'Gabinete Metálico',
  gabestanco:    'Gabinete Estanco',
  gabmedidor:    'Gabinete de Medidor',
  cajapaso:      'Caja de Paso',
  cajaembutir:   'Caja de Embutir',
  conectores:    'Conector de Cañería',
  curvas:        'Curva 90°',
  uniones:       'Unión / Cupla',
  prensas:       'Prensa Cable / Pipeta',
  mecanismos:    'Llave / Toma / Bastidor',
  pat:           'Equipo PAT',
  unipolar:      'Cable Unipolar',
  ttr:           'Cable TTR',
  subterraneo:   'Cable Subterráneo',
  alta_potencia: 'Cable de Alta Potencia Morado',
  preen:         'Cable Preensamblado',
  conc:          'Cable Concéntrico',
  desnudo:       'Cable Desnudo',
  especial:      'Cable Especial',
  termcu:        'Terminal de Cobre',
  termal:        'Terminal de Aluminio',
  puntera:       'Puntera Aislada',
  empalme:       'Empalme',
  herraje:       'Herraje de Línea',
  prensa:        'Prensacable',
  herr_portatiles: 'Herramienta Portátil',
  maq_banco:     'Maquinaria de Banco',
  corte_manual:  'Herramienta de Corte Manual',
  maq_pesada:    'Maquinaria de Obra Pesada',
  generadores:   'Grupo Electrógeno',
  compresores:   'Compresor de Aire',
  mano:          'Herramienta de Mano',
  llaves:        'Llave',
  medicion:      'Instrumento de Medición',
  albanileria:   'Herramienta de Albañilería',
  escaleras:     'Escalera',
  excavacion:    'Herramienta de Excavación',
  varios_panol:  'Varios de Pañol',
  adhesivos:     'Adhesivo / Alambre',
  senalizacion:  'Señalización',
  gabinetes: 'Gabinete',
  cajas:     'Caja',
  embutidos:     'Artefactos para embutir',
  alumbrado:     'Alumbrado público',
  reflectores:   'Reflectores',
  proyectores:   'Proyectores',
  apliques:      'Apliques / Pared / Piso',
  especiales:    'Especiales / Colgantes',
  rotos:         'Rotos / Para revisión',
  // ── Instalación Eléctrica (formulario nuevo) ──
  modulos:       'Módulo para Embutir',
  cajas_ie:      'Caja para Embutir (Módulos)',
  canieria:      'Accesorio de Cañería'
};

// ============================================================
// 1.2 Columnas — Depósito
// ============================================================
const DEP_COL_MOV = {
  ID_PEDIDO:    1,
  FECHA:        2,
  TIPO:         3,
  RESPONSABLE:  4,
  OBRA:         5,
  ZONA:         6,
  FAMILIA:      7,
  MARCA:        8,
  DESCRIPCION:  9,
  CANTIDAD:     10,
  UNIDAD:       11,
  OBS_ITEM:     12,
  OBS_GENERAL:  13,
  NRO_ENVIO:    14,
  UBIC_DEPOSITO: 15,
  UBIC_ESTANTE:  16,
  UBIC_COLUMNA:  17,
  UBIC_FILA:     18,
  NRO_FACTURA:   19,
  TOTAL:         19,
};

const DEP_COL_STOCK = {
  ID:             1,
  ZONA:           2,
  FAMILIA:        3,
  MARCA:          4,
  DESCRIPCION:    5,
  IMAGEN:         6,   
  UNIDAD:         7,   
  ENTRADAS:       8,
  SALIDAS:        9,
  DEVOLUCIONES:   10,
  STOCK_ACTUAL:   11,
  STOCK_MINIMO:   12,
  ESTADO:         13,
  ULT_MOVIMIENTO: 14,
  ULT_OBS:        15,  
  ULT_FECHA:      16,
  ULT_HORA:       17,
  UBIC_DEPOSITO:  18,
  UBIC_ESTANTE:   19,
  UBIC_COLUMNA:   20,
  UBIC_FILA:      21,
  ULT_MOV_OBS:    22,  
  TOTAL:          22,
};

// ============================================================
// 1.3 Columnas — Traslados
// ============================================================
const TRA_COL_MOV = {
  ID:           1,
  FECHA:        2,
  RESPONSABLE:  3,
  RUTA:         4,
  CATEGORIA:    5,
  DESCRIPCION:  6,
  DETALLE:      7,
  SERIE:        8,
  CANTIDAD:     9,
  ESTADO:       10,
  EQUIPO:       11,
  OBS_ITEM:     12,
  OBS_GENERAL:  13,
  NRO_TRASLADO: 14,
  TOTAL:        14,
};

const TRA_COL_STOCK = {
  ID:           1,
  DEPOSITO:     2,
  CATEGORIA:    3,
  DESCRIPCION:  4,
  DETALLE:      5,
  ENTRADAS:     6,
  SALIDAS:      7,
  STOCK_ACTUAL: 8,
  ESTADO_ITEM:  9,
  ULT_MOV:      10,
  ULT_FECHA:    11,
  ULT_HORA:     12,
  TOTAL:        12,
};

// ============================================================
// 2. UTILIDADES COMUNES
// ============================================================

// ============================================================
// 2.1 Respuestas JSON
// ============================================================
function jsonResp(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// 2.2 Formateo de fecha/hora de celdas
// ============================================================
function formatearFechaCelda(valor) {
  if (valor instanceof Date) {
    return Utilities.formatDate(valor, Session.getScriptTimeZone(), 'dd/MM/yyyy');
  }
  return String(valor || '');
}

function formatearHoraCelda(valor) {
  if (valor instanceof Date) {
    return Utilities.formatDate(valor, Session.getScriptTimeZone(), 'HH:mm');
  }
  return String(valor || '');
}

function dep_normalizarFecha(f, timezone) {
  if (!f) return Utilities.formatDate(new Date(), timezone || Session.getScriptTimeZone(), 'd/M/yyyy, HH:mm:ss');
  var str = String(f).trim();
  if (str.indexOf('T') !== -1 && str.indexOf('Z') !== -1) {
    try {
      var d = new Date(str);
      if (!isNaN(d.getTime())) {
        var day = d.getDate();
        var month = d.getMonth() + 1;
        var year = d.getFullYear();
        var hours = String(d.getHours()).padStart(2, '0');
        var mins = String(d.getMinutes()).padStart(2, '0');
        var secs = String(d.getSeconds()).padStart(2, '0');
        return day + '/' + month + '/' + year + ', ' + hours + ':' + mins + ':' + secs;
      }
    } catch (e) {}
  }
  return str;
}

// ============================================================
// 2.3 Conversión de fila a objeto
// ============================================================
function _filaAObjeto(row) {
  const stockActual = Number(row[DEP_COL_STOCK.STOCK_ACTUAL - 1]) || 0;
  const stockMinimo = Number(row[DEP_COL_STOCK.STOCK_MINIMO - 1]) || 0;
  const estadoRaw   = String(row[DEP_COL_STOCK.ESTADO - 1] || '').trim();
  const estado      = estadoRaw || (stockActual <= stockMinimo ? 'REPONER' : 'OK');

  return {
    id:           String(row[DEP_COL_STOCK.ID           - 1] || ''),
    zona:         String(row[DEP_COL_STOCK.ZONA         - 1] || ''),
    familia:      String(row[DEP_COL_STOCK.FAMILIA      - 1] || ''),
    marca:        String(row[DEP_COL_STOCK.MARCA        - 1] || ''),
    descripcion:  String(row[DEP_COL_STOCK.DESCRIPCION  - 1] || ''),
    entradas:     Number(row[DEP_COL_STOCK.ENTRADAS     - 1]) || 0,
    salidas:      Number(row[DEP_COL_STOCK.SALIDAS      - 1]) || 0,
    devoluciones: Number(row[DEP_COL_STOCK.DEVOLUCIONES - 1]) || 0,
    stock_actual: stockActual,
    stock_minimo: stockMinimo,
    estado:       estado,
    ult_mov:      String(row[DEP_COL_STOCK.ULT_MOVIMIENTO - 1] || ''),
    ult_fecha:    formatearFechaCelda(row[DEP_COL_STOCK.ULT_FECHA - 1]),
    ult_hora:     formatearHoraCelda(row[DEP_COL_STOCK.ULT_HORA  - 1]),
    ubicacion_deposito: String(row[DEP_COL_STOCK.UBIC_DEPOSITO - 1] || ''),
    ubicacion_estante:  String(row[DEP_COL_STOCK.UBIC_ESTANTE  - 1] || ''),
    ubicacion_columna:  String(row[DEP_COL_STOCK.UBIC_COLUMNA  - 1] || ''),
    ubicacion_fila:     String(row[DEP_COL_STOCK.UBIC_FILA     - 1] || ''),
    imagen:  String(row[DEP_COL_STOCK.IMAGEN  - 1] || ''),
    unidad:  String(row[DEP_COL_STOCK.UNIDAD  - 1] || ''),
    ult_obs: String(row[DEP_COL_STOCK.ULT_OBS - 1] || ''),
    ult_mov_obs: String(row[DEP_COL_STOCK.ULT_MOV_OBS - 1] || ''),
  };
}

// ============================================================
// 2.4 Validación de consistencia
// ============================================================
function validarConsistenciaFamilias() {
  const faltanEnOrden = Object.keys(FAMILIAS).filter(k => !(k in ORDEN_DESCRIPCION));
  const faltanEnFamilias = Object.keys(ORDEN_DESCRIPCION).filter(k => !(k in FAMILIAS));
  if (faltanEnOrden.length || faltanEnFamilias.length) {
    Logger.log('⚠ Inconsistencia FAMILIAS/ORDEN_DESCRIPCION: ' +
      JSON.stringify({ faltanEnOrden, faltanEnFamilias }));
  }
}

// ============================================================
// 3. GESTIÓN DE FOTOS EN DRIVE
// ============================================================
const CARPETA_FOTOS_STOCK_ID = '1GmRJIr7yEUb5-fbqfrJQGZd8uSKad0jz'; // ← reemplazar por el ID real de tu carpeta de Drive

function subirImagenDrive(base64Data, nombreArchivo) {
  const carpeta = DriveApp.getFolderById(CARPETA_FOTOS_STOCK_ID);
  const bytes   = Utilities.base64Decode(base64Data);
  const blob    = Utilities.newBlob(bytes, 'image/jpeg', nombreArchivo);
  const archivo = carpeta.createFile(blob);
  archivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return `https://drive.google.com/thumbnail?id=${archivo.getId()}&sz=w1000`;
}

function carpetaParaEliminar() {
  const carpetaPrincipal = DriveApp.getFolderById(CARPETA_FOTOS_STOCK_ID);
  const existentes = carpetaPrincipal.getFoldersByName('Para eliminar');
  if (existentes.hasNext()) return existentes.next();
  return carpetaPrincipal.createFolder('Para eliminar');
}

function moverImagenAPapeleraInterna(idArchivo) {
  try {
    const archivo = DriveApp.getFileById(idArchivo);
    const destino = carpetaParaEliminar();
    const timezone = Session.getScriptTimeZone();
    const fechaTag = Utilities.formatDate(new Date(), timezone, 'yyyy-MM-dd');

    archivo.setName(fechaTag + '__' + archivo.getName());

    const padres = archivo.getParents();
    while (padres.hasNext()) {
      padres.next().removeFile(archivo);
    }
    destino.addFile(archivo);
  } catch (err) {
    Logger.log('No se pudo mover a "Para eliminar": ' + err.message);
  }
}

function limpiarImagenesVencidas() {
  const LIMITE_DIAS = 14;
  const carpeta = carpetaParaEliminar();
  const archivos = carpeta.getFiles();
  const ahora = new Date();

  while (archivos.hasNext()) {
    const archivo = archivos.next();
    const nombre = archivo.getName();
    const match = nombre.match(/^(\d{4}-\d{2}-\d{2})__/);
    if (!match) continue;

    const fechaMovido = new Date(match[1] + 'T00:00:00');
    const diasPasados = (ahora - fechaMovido) / (1000 * 60 * 60 * 24);

    if (diasPasados >= LIMITE_DIAS) {
      archivo.setTrashed(true);
      Logger.log('Eliminado definitivamente (venció el plazo): ' + nombre);
    }
  }
}

// ============================================================
// 4. PUNTOS DE ENTRADA
// ============================================================
function doGet(e) {
  const params = e.parameter || {};

  if (params.action === 'json') {
    try {
      const ss        = SpreadsheetApp.getActiveSpreadsheet();
      const hojaStock = ss.getSheetByName('Stock');

      if (!hojaStock) {
        return jsonResp({ ok: false, error: 'Hoja Stock no encontrada.' });
      }

      const ultimaFila = hojaStock.getLastRow();
      if (ultimaFila <= 1) {
        return jsonResp({ ok: true, productos: [] });
      }

      const datos       = hojaStock.getRange(2, 1, ultimaFila - 1, DEP_COL_STOCK.TOTAL).getValues();
      const zonaBuscada = (params.zona || '').trim().toLowerCase();

      const productos = datos
        .filter(r => {
          if (!zonaBuscada) return true;
          return String(r[DEP_COL_STOCK.ZONA - 1]).trim().toLowerCase() === zonaBuscada;
        })
        .map(_filaAObjeto);

      return jsonResp({ ok: true, productos });

    } catch (err) {
      Logger.log('ERROR doGet json: ' + err.message);
      return jsonResp({ ok: false, error: err.message });
    }
  }

  if (params.action === 'lookup-ubicacion') {
    try {
      const ss        = SpreadsheetApp.getActiveSpreadsheet();
      const hojaStock = ss.getSheetByName('Stock');

      if (!hojaStock) {
        return jsonResp({ ok: false, error: 'Hoja Stock no encontrada.' });
      }

      const ultimaFila = hojaStock.getLastRow();
      if (ultimaFila <= 1) {
        return jsonResp({ ok: true, encontrada: false });
      }

      const datos       = hojaStock.getRange(2, 1, ultimaFila - 1, DEP_COL_STOCK.TOTAL).getValues();
      const zonaBuscada = (params.zona || '').trim().toLowerCase();
      const textoBusq   = (params.descripcion || params.marca || '').trim().toLowerCase();
      const tokens      = textoBusq.split('|').map(t => t.trim()).filter(Boolean);

      const fila = datos.find(r => {
        const zonaRow = String(r[DEP_COL_STOCK.ZONA - 1] || '').trim().toLowerCase();
        if (zonaBuscada && zonaRow !== zonaBuscada) return false;

        const campo = (
          String(r[DEP_COL_STOCK.DESCRIPCION - 1] || '') + ' ' +
          String(r[DEP_COL_STOCK.MARCA       - 1] || '')
        ).toLowerCase();

        return tokens.length > 0 && tokens.every(t => campo.includes(t));
      });

      if (!fila) {
        return jsonResp({ ok: true, encontrada: false });
      }

      const obj = _filaAObjeto(fila);
      return jsonResp({
        ok: true,
        encontrada: true,
        ubicacion: {
          deposito: obj.ubicacion_deposito,
          estante:  obj.ubicacion_estante,
          columna:  obj.ubicacion_columna,
          fila:     obj.ubicacion_fila
        }
      });

    } catch (err) {
      Logger.log('ERROR doGet lookup-ubicacion: ' + err.message);
      return jsonResp({ ok: false, error: err.message });
    }
  }

if (params.action === 'movimientos') {
  try {
    const ss      = SpreadsheetApp.getActiveSpreadsheet();
    const hojaMov = ss.getSheetByName('Movimientos');

    if (!hojaMov) {
      return jsonResp({ ok: true, movimientos: [] });
    }

    const ultimaFila = hojaMov.getLastRow();
    if (ultimaFila <= 1) {
      return jsonResp({ ok: true, movimientos: [] });
    }

    const limite = Number(params.limit) || 1500;
    const datos = hojaMov.getRange(2, 1, ultimaFila - 1, DEP_COL_MOV.TOTAL).getValues();

    const movimientos = datos.slice(-limite).map(r => ({
      fecha:        formatearFechaCelda(r[DEP_COL_MOV.FECHA - 1]) + ' ' + formatearHoraCelda(r[DEP_COL_MOV.FECHA - 1]),
      tipo:         String(r[DEP_COL_MOV.TIPO - 1] || ''),
      zona:         String(r[DEP_COL_MOV.ZONA - 1] || ''),
      descripcion:  String(r[DEP_COL_MOV.DESCRIPCION - 1] || ''),
      cantidad:     Number(r[DEP_COL_MOV.CANTIDAD - 1]) || 0,
      responsable:  String(r[DEP_COL_MOV.RESPONSABLE - 1] || ''),
      obra:         String(r[DEP_COL_MOV.OBRA - 1] || ''),
      factura:      String(r[DEP_COL_MOV.NRO_FACTURA - 1] || ''),
    }));

    return jsonResp({ ok: true, movimientos });

  } catch (err) {
    Logger.log('ERROR doGet movimientos: ' + err.message);
    return jsonResp({ ok: false, error: err.message });
  }
}

  try {
    const ss        = SpreadsheetApp.getActiveSpreadsheet();
    const hojaStock = ss.getSheetByName('Stock');

    if (!hojaStock) {
      return _htmlError('No se encontró la hoja Stock.');
    }

    const ultimaFila = hojaStock.getLastRow();
    if (ultimaFila <= 1) {
      return _htmlError('La hoja Stock está vacía.');
    }

    const datos = hojaStock
      .getRange(2, 1, ultimaFila - 1, DEP_COL_STOCK.TOTAL)
      .getValues();

    if (params.id) {
      const idBuscado = params.id.trim().toUpperCase();
      const fila = datos.find(r =>
        String(r[DEP_COL_STOCK.ID - 1]).trim().toUpperCase() === idBuscado
      );

      if (!fila) {
        return _htmlError(`Producto "${params.id}" no encontrado en Stock.`);
      }

      return _htmlProducto(_filaAObjeto(fila));
    }

    if (params.zona) {
      const zonaBuscada = params.zona.trim().toLowerCase();
      const productos = datos
        .filter(r => String(r[DEP_COL_STOCK.ZONA - 1]).trim().toLowerCase() === zonaBuscada)
        .map(_filaAObjeto);

      if (productos.length === 0) {
        return _htmlError(`No hay productos registrados para la zona "${params.zona}".`);
      }

      return _htmlZona(params.zona, productos);
    }

    return _htmlError('Parámetro requerido: action=json&zona=..., id=PROD-001, o zona=Nombre.');

  } catch (err) {
    Logger.log('ERROR doGet html: ' + err.message);
    return _htmlError('Error interno: ' + err.message);
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (_) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: 'Sistema ocupado, intentá en unos segundos.' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const data = JSON.parse(e.postData.contents);
    Logger.log('Payload recibido: ' + JSON.stringify(data));

    const ss = SpreadsheetApp.openById('1PWCKGAQgZfBEWPwqWppsbylLdJLxJe3I6XWrEAhBwQk');

    if (data.accion === 'ajuste-rapido') {
      return ajusteRapidoStockOpcionB(data, ss);
    } else if (data.accion === 'crear-producto') {
      return crearProductoNuevo(data, ss);
    } else if (data.accion === 'actualizar-observacion') {
      return actualizarObservacionProducto(data, ss);
    } else if (data.accion === 'actualizar-ubicacion') {
      return actualizarUbicacionProducto(data, ss);
    } else if (data.accion === 'actualizar-datos') {
      return actualizarDatosProducto(data, ss);
    } else if (data.accion === 'actualizar-imagen') {
      return actualizarImagenProducto(data, ss);
    } else if (data.accion === 'eliminar-imagen') {
      return eliminarImagenProducto(data, ss);
    } else if (data.tipo === 'Traslado') {
      return procesarTraslado(data, ss);
    } else {
      return procesarDeposito(data, ss);
    }

  } catch (err) {
    Logger.log('ERROR doPost: ' + err.message);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// ============================================================
// 5. MÓDULO DEPÓSITO
// ============================================================

// ============================================================
// 5.1 Procesamiento principal
// ============================================================
function procesarDeposito(data, ss) {
  let hojaMov   = ss.getSheetByName('Movimientos') || ss.insertSheet('Movimientos');
  let hojaStock = ss.getSheetByName('Stock')       || ss.insertSheet('Stock');

  dep_inicializarHojaMovimientos(hojaMov);
  dep_inicializarHojaStock(hojaStock);

  const tipo         = data.tipo_movimiento || '';
  const fecha        = dep_normalizarFecha(data.fecha);
  const responsable  = data.responsable     || '';
  const obra         = data.obra            || '';
  const zona         = data.zona            || 'Sin zona';
  const obsGenerales = data.observaciones   || '';

  const idPedido = dep_generarIdPedido(hojaMov, tipo);
  const nroEnvio = dep_generarNroEnvio();

  const ahora     = new Date();
  const timezone  = Session.getScriptTimeZone();
  const fechaHoy  = Utilities.formatDate(ahora, timezone, 'dd/MM/yyyy');
  const horaAhora = Utilities.formatDate(ahora, timezone, 'HH:mm');

  for (const [key, nombreFamilia] of Object.entries(FAMILIAS)) {
    const items = data[key] || [];
    items.forEach(item => {
      
      for (let prop in item) {
        if (String(item[prop]).trim().toUpperCase() === 'OTRO' && item[prop + '_otro']) {
          item[prop] = item[prop + '_otro'];
        }
      }
      if (item.marca_sel) {
        item.marca = item.marca_sel;
      }
      if (item.soporte === 'RIEL_DIN') {
        item.soporte = 'RIEL DIN';
      }
      if (item.rieldim && String(item.rieldim).trim() !== '') {
        item.rieldim = item.rieldim + ' módulos';
      }
       const FAMILIAS_CABLE = ['unipolar','ttr','subterraneo','preen','conc','desnudo','especial','alta_potencia'];
      if (FAMILIAS_CABLE.includes(key) && item.presentacion && String(item.presentacion).trim() !== '') {
        item.presentacion = 'Presentación ' + String(item.presentacion).trim();
      }
      if ((key === 'alumbrado' || key === 'gabinetes' || key === 'cajas') && (item.largo || item.ancho || item.alto)) {
        const partes = [item.largo, item.ancho, item.alto].filter(v => v && String(v).trim() !== '');
        if (partes.length > 0) {
          item.dimensiones = partes.join('x') + ' mm';
        }
      }
      if (key === 'embutidos' || key === 'apliques' || key === 'especiales' || key === 'rotos') {
        if (item.diametro || item.diametro_alto) {
          const partes = [item.diametro, item.diametro_alto].filter(v => v && String(v).trim() !== '');
          if (partes.length > 0) item.dimensiones = 'Ø' + partes.join(' x ') + ' mm';
        } else if (item.lado || item.lado_alto) {
          const partes = [item.lado, item.lado_alto].filter(v => v && String(v).trim() !== '');
          if (partes.length > 0) item.dimensiones = partes.join('x') + ' mm';
        } else if (item.largo || item.ancho || item.alto) {
          const partes = [item.largo, item.ancho, item.alto].filter(v => v && String(v).trim() !== '');
          if (partes.length > 0) item.dimensiones = partes.join('x') + ' mm';
        }
      }
           let marca = item.marca || 'No especificado';
      if (key === 'filtros' && item.codigo) {
        marca = marca + ' | ' + item.codigo;
      }
      const cantidad     = Number(item.cantidad) || 0;
      const unidad       = item.unidad        || 'un';
      const obs          = item.observaciones || '';

      if (item.nro_bobina && String(item.nro_bobina).trim() !== '') {
        item.nro_bobina = 'N° bobina ' + String(item.nro_bobina).trim();
      }
      if (item.codigo_bobina && String(item.codigo_bobina).trim() !== '') {
        item.codigo_bobina = 'Cód. ' + String(item.codigo_bobina).trim();
      }
      if (item.peso_bobina && String(item.peso_bobina).trim() !== '') {
        item.peso_bobina = String(item.peso_bobina).trim() + 'kg';
      }

      const descripcion  = armarDescripcion(key, item);
      let imagenUrl = '';
      if (item.fotos_base64 && Array.isArray(item.fotos_base64) && item.fotos_base64.length > 0) {
        const urls = item.fotos_base64.map((b64, idx) => {
          return subirImagenDrive(b64, `${key}_${Date.now()}_${idx}.jpg`);
        });
        imagenUrl = urls.join('||');
      } else if (item.foto_base64) {
        imagenUrl = subirImagenDrive(item.foto_base64, `${key}_${Date.now()}.jpg`);
      }

      const ubicacion = {
        deposito: item.deposito || '',
        estante:  item.estante  || '',
        columna:  item.columna  || '',
        fila:     item.fila     || ''
      };

      hojaMov.appendRow([
        idPedido, fecha, tipo, responsable, obra, zona,
        nombreFamilia, marca, descripcion,
        cantidad, unidad, obs, obsGenerales, nroEnvio,
        ubicacion.deposito, ubicacion.estante, ubicacion.columna, ubicacion.fila,
        ''   // N° Factura — no aplica a este tipo de movimiento
      ]);

      dep_actualizarStock(hojaStock, zona, nombreFamilia, marca, descripcion, tipo, cantidad, fechaHoy, horaAhora, ubicacion, unidad, obs, obsGenerales, imagenUrl);
    });
  }

  if (data.producto_nuevo && data.producto_nuevo.descripcion && data.producto_nuevo.descripcion.trim() !== '') {
    const pn       = data.producto_nuevo;
    const cantidad = Number(pn.cantidad) || 0;
    const unidad   = pn.unidad           || 'un';

    let pnDimensiones = '';
    if (pn.diametro || pn.diametro_alto) {
      const partes = [pn.diametro, pn.diametro_alto].filter(v => v && String(v).trim() !== '');
      if (partes.length > 0) pnDimensiones = 'Ø' + partes.join(' x ') + ' mm';
    } else if (pn.lado || pn.lado_alto) {
      const partes = [pn.lado, pn.lado_alto].filter(v => v && String(v).trim() !== '');
      if (partes.length > 0) pnDimensiones = partes.join('x') + ' mm';
    } else if (pn.largo || pn.ancho || pn.alto) {
      const partes = [pn.largo, pn.ancho, pn.alto].filter(v => v && String(v).trim() !== '');
      if (partes.length > 0) pnDimensiones = partes.join('x') + ' mm';
    }
    const pnDescripcionFinal = pn.descripcion.trim()
      + (pn.presentacion ? ' | Presentación ' + pn.presentacion : '')
      + (pnDimensiones ? ' | ' + pnDimensiones : '')
      + (pn.nro_bobina ? ' | N° bobina ' + String(pn.nro_bobina).trim() : '')
      + (pn.codigo_bobina ? ' | Cód. ' + String(pn.codigo_bobina).trim() : '')
      + (pn.peso_bobina ? ' | ' + String(pn.peso_bobina).trim() + 'kg' : '');

    hojaMov.appendRow([
      idPedido, fecha, tipo, responsable, obra, zona,
      'Producto nuevo', '—', pnDescripcionFinal,
      cantidad, unidad, pn.observacion || '', obsGenerales, nroEnvio,
      pn.deposito || '', pn.estante || '', pn.columna || '', pn.fila || '',
      ''   // N° Factura — no aplica a este tipo de movimiento
    ]);
    const ubicacionNuevo = {
      deposito: pn.deposito || '',
      estante:  pn.estante  || '',
      columna:  pn.columna  || '',
      fila:     pn.fila     || ''
    };

    let imagenNuevoUrl = '';
    if (pn.fotos_base64 && Array.isArray(pn.fotos_base64) && pn.fotos_base64.length > 0) {
      const urls = pn.fotos_base64.map((b64, idx) => {
        return subirImagenDrive(b64, `nuevo_${Date.now()}_${idx}.jpg`);
      });
      imagenNuevoUrl = urls.join('||');
    }

    dep_actualizarStock(hojaStock, zona, 'Producto nuevo', '—', pnDescripcionFinal, tipo, cantidad, fechaHoy, horaAhora, ubicacionNuevo, pn.unidad, pn.observacion, obsGenerales, imagenNuevoUrl);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, id: idPedido, envio: nroEnvio }))
    .setMimeType(ContentService.MimeType.JSON);
}

function armarDescripcion(familiaKey, item) {
  const camposOrden = ORDEN_DESCRIPCION[familiaKey] || [];

  if (camposOrden.length === 0) {
    return Object.keys(item).sort()
      .filter(k => !['marca', 'cantidad', 'unidad', 'observaciones', 'deposito', 'estante', 'columna', 'fila', 'fotos_base64', 'foto_base64', 'presentacion', 'presentacion_otro', 'peso_bobina'].includes(k) && item[k] && item[k] !== '')
      .map(k => item[k])
      .join(' | ');
  }

  let descripcion = camposOrden
    .filter(k => item[k] && item[k] !== '')
    .map(k => item[k])
    .join(' | ');

  if (familiaKey === 'filtros') {
    const compat = item.compatibilidad;
    if (compat && compat.trim() !== '' && compat.trim().toLowerCase() !== 'no especificado') {
      descripcion += ' | ' + compat.trim();
    }
  }

  return descripcion;
}

// ============================================================
// 5.2 Actualización de stock
// ============================================================
function dep_actualizarStock(hojaStock, zona, familia, marca, descripcion, tipo, cantidad, fechaHoy, horaAhora, ubicacion, unidad, obsItem, obsGeneral, imagenUrl) {
  const ultimaFila = hojaStock.getLastRow();
  let filaNum = -1;

  if (ultimaFila > 1) {
    const datos = hojaStock.getRange(2, 1, ultimaFila - 1, DEP_COL_STOCK.TOTAL).getValues();
    for (let i = 0; i < datos.length; i++) {
      if (
        datos[i][DEP_COL_STOCK.ZONA        - 1] === zona        &&
        datos[i][DEP_COL_STOCK.FAMILIA     - 1] === familia     &&
        datos[i][DEP_COL_STOCK.MARCA       - 1] === marca       &&
        datos[i][DEP_COL_STOCK.DESCRIPCION - 1] === descripcion
      ) {
        filaNum = i + 2;
        break;
      }
    }
  }

  if (filaNum === -1) {
    const nuevoId = dep_generarIdProducto(hojaStock);
    hojaStock.appendRow([
      nuevoId, zona, familia, marca, descripcion,
      imagenUrl || '', unidad || '',
      0, 0, 0, 0,
      '', '',
      '', '', '', '',
      '', '', '', '',
      ''
    ]);
    filaNum = hojaStock.getLastRow();
  }

  const valoresActuales = hojaStock
    .getRange(filaNum, DEP_COL_STOCK.ENTRADAS, 1, 3)
    .getValues()[0];

  let entradas     = valoresActuales[0] || 0;
  let salidas      = valoresActuales[1] || 0;
  let devoluciones = valoresActuales[2] || 0;

  if      (tipo === 'ENTRADA')    entradas     += cantidad;
  else if (tipo === 'SALIDA')     salidas      += cantidad;
  else if (tipo === 'DEVOLUCIÓN') devoluciones += cantidad;

  const stockActual = entradas - salidas + devoluciones;

  hojaStock.getRange(filaNum, DEP_COL_STOCK.ENTRADAS, 1, 4)
    .setValues([[entradas, salidas, devoluciones, stockActual]]);

  hojaStock.getRange(filaNum, DEP_COL_STOCK.ESTADO)
    .setFormula(`=IF(K${filaNum}<=L${filaNum},"REPONER","OK")`);

  const celdaEstado = hojaStock.getRange(filaNum, DEP_COL_STOCK.ESTADO);
  if (stockActual <= 0) {
    celdaEstado.setBackground('#fee2e2').setFontColor('#dc2626').setFontWeight('bold');
  } else {
    celdaEstado.setBackground('#dcfce7').setFontColor('#15803d').setFontWeight('bold');
  }

  const celdaStock = hojaStock.getRange(filaNum, DEP_COL_STOCK.STOCK_ACTUAL);
  if (stockActual <= 0) {
    celdaStock.setBackground('#fee2e2').setFontColor('#dc2626').setFontWeight('bold');
  } else {
    celdaStock.setBackground('#dcfce7').setFontColor('#15803d').setFontWeight('bold');
  }

  hojaStock.getRange(filaNum, DEP_COL_STOCK.ULT_MOVIMIENTO).setValue(tipo);
  hojaStock.getRange(filaNum, DEP_COL_STOCK.ULT_FECHA).setValue(fechaHoy);
  hojaStock.getRange(filaNum, DEP_COL_STOCK.ULT_HORA).setValue(horaAhora);

  if (obsItem && String(obsItem).trim() !== '') {
    hojaStock.getRange(filaNum, DEP_COL_STOCK.ULT_OBS).setValue(String(obsItem).trim());
  }

  if (obsGeneral && String(obsGeneral).trim() !== '') {
    hojaStock.getRange(filaNum, DEP_COL_STOCK.ULT_MOV_OBS).setValue(String(obsGeneral).trim());
  }

  if (unidad) {
    hojaStock.getRange(filaNum, DEP_COL_STOCK.UNIDAD).setValue(unidad);
  }

  if (imagenUrl) {
    hojaStock.getRange(filaNum, DEP_COL_STOCK.IMAGEN).setValue(imagenUrl);
  }

  if (ubicacion && (ubicacion.deposito || ubicacion.estante || ubicacion.columna || ubicacion.fila)) {
    hojaStock.getRange(filaNum, DEP_COL_STOCK.UBIC_DEPOSITO, 1, 4)
      .setValues([[ubicacion.deposito || '', ubicacion.estante || '', ubicacion.columna || '', ubicacion.fila || '']]);
  }
}

// ============================================================
// 5.3 Generadores de ID
// ============================================================
function dep_generarNroEnvio() {
  const props    = PropertiesService.getScriptProperties();
  const timezone = Session.getScriptTimeZone();
  const hoy      = Utilities.formatDate(new Date(), timezone, 'yyyy-MM-dd');

  const ultimaFecha = props.getProperty('ENV_FECHA') || '';
  let   ultimoNum   = parseInt(props.getProperty('ENV_NUM') || '0', 10);

  if (ultimaFecha !== hoy) {
    ultimoNum = 0;
    props.setProperty('ENV_FECHA', hoy);
  }

  const nuevoNum = ultimoNum + 1;
  props.setProperty('ENV_NUM', String(nuevoNum));
  return 'ENV-' + String(nuevoNum).padStart(3, '0');
}

function dep_generarIdPedido(hojaMov, tipo) {
  const prefijos = { 'ENTRADA': 'ING', 'SALIDA': 'SAL', 'DEVOLUCIÓN': 'DEV' };
  const prefijo  = prefijos[tipo] || 'MOV';

  const ultimaFila = hojaMov.getLastRow();
  let maxNum = 0;

  if (ultimaFila > 1) {
    const ids = hojaMov.getRange(2, DEP_COL_MOV.ID_PEDIDO, ultimaFila - 1, 1).getValues();
    ids.forEach(([id]) => {
      const s = String(id || '');
      if (s.startsWith(prefijo + '-')) {
        const num = parseInt(s.replace(prefijo + '-', ''), 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
  }
  return prefijo + '-' + String(maxNum + 1).padStart(3, '0');
}

function dep_generarIdProducto(hojaStock) {
  const ultimaFila = hojaStock.getLastRow();
  if (ultimaFila <= 1) return 'PROD-001';

  const ids = hojaStock.getRange(2, DEP_COL_STOCK.ID, ultimaFila - 1, 1).getValues();
  let maxNum = 0;
  ids.forEach(([id]) => {
    const s = String(id || '');
    if (s.startsWith('PROD-')) {
      const num = parseInt(s.replace('PROD-', ''), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  });
  return 'PROD-' + String(maxNum + 1).padStart(3, '0');
}

// ============================================================
// 5.4 Inicialización de hojas
// ============================================================
function dep_inicializarHojaMovimientos(hojaMov) {
  if (hojaMov.getLastRow() > 0) return;

  hojaMov.appendRow([
    'ID Pedido', 'Fecha', 'Tipo', 'Responsable', 'Obra', 'Zona',
    'Familia', 'Marca', 'Descripción', 'Cantidad', 'Unidad',
    'Obs. ítem', 'Obs. generales', 'N° Envío',
    'Depósito', 'Estante', 'Columna', 'Fila',
    'N° Factura'
  ]);

  const header = hojaMov.getRange(1, 1, 1, DEP_COL_MOV.TOTAL);
  header.setFontWeight('bold').setBackground('#1a1a2e').setFontColor('#ffffff');
  hojaMov.setFrozenRows(1);

  const anchos = [90, 150, 90, 130, 150, 160, 160, 110, 280, 80, 70, 180, 200, 110, 90, 70, 70, 60, 100];
  anchos.forEach((w, i) => hojaMov.setColumnWidth(i + 1, w));
}

function dep_inicializarHojaStock(hojaStock) {
  if (hojaStock.getLastRow() > 0) return;

  hojaStock.appendRow([
    'ID Producto', 'Zona', 'Familia', 'Marca', 'Descripción',
    'Imagen', 'Unidad',
    'Entradas', 'Salidas', 'Devoluciones', 'Stock actual',
    '',            
    'Estado',
    'Último mov.', 'Última obs.', 'Fecha', 'Hora',
    'Depósito', 'Estante', 'Columna', 'Fila',
    'Obs. Envío'
  ]);

  const header = hojaStock.getRange(1, 1, 1, DEP_COL_STOCK.TOTAL);
  header.setFontWeight('bold').setBackground('#2563eb').setFontColor('#ffffff');
  hojaStock.setFrozenRows(1);

  hojaStock.getRange(1, DEP_COL_STOCK.STOCK_MINIMO)
    .setValue('Stock mínimo')
    .setNote('Editable a mano en la planilla o desde el panel (Editar ficha). El Estado se recalcula solo con la fórmula.');

  const anchos = [100, 160, 160, 110, 280, 220, 70, 80, 80, 110, 100, 110, 110, 140, 200, 120, 90, 90, 70, 70, 60, 220];
  anchos.forEach((w, i) => hojaStock.setColumnWidth(i + 1, w));
}

// ============================================================
// 5.5 Acciones rápidas desde el HTML
// ============================================================
function ajusteRapidoStockOpcionB(data, ss) {
  const hojaStock = ss.getSheetByName('Stock');
  const hojaMov   = ss.getSheetByName('Movimientos') || ss.insertSheet('Movimientos');
  if (!hojaStock) return jsonResp({ ok: false, error: 'Hoja Stock no encontrada.' });

  dep_inicializarHojaMovimientos(hojaMov);

  const tipoRaw = data.tipo_movimiento || '';
  const tipo = tipoRaw === 'DEVOLUCION' ? 'DEVOLUCIÓN' : tipoRaw; 
  const zona = data.zona || '';
  const ahora = new Date();
  const timezone = Session.getScriptTimeZone();
  const fechaHoy = Utilities.formatDate(ahora, timezone, 'dd/MM/yyyy');
  const horaAhora = Utilities.formatDate(ahora, timezone, 'HH:mm');
  const nroEnvio = dep_generarNroEnvio();
  const idPedido = dep_generarIdPedido(hojaMov, tipo);

  const ultimaFila = hojaStock.getLastRow();
  const datos = ultimaFila > 1 ? hojaStock.getRange(2, 1, ultimaFila - 1, DEP_COL_STOCK.TOTAL).getValues() : [];

  const noEncontrados = [];

  (data.items || []).forEach(item => {
    const idBuscado = String(item.id || '').trim().toUpperCase();
    const fila = datos.find(r => String(r[DEP_COL_STOCK.ID - 1]).trim().toUpperCase() === idBuscado);

    if (!fila) {
      noEncontrados.push(idBuscado);
      return;
    }

    const zonaItem    = String(fila[DEP_COL_STOCK.ZONA        - 1] || data.zona || '');
    const familia     = String(fila[DEP_COL_STOCK.FAMILIA     - 1] || '');
    const marca       = String(fila[DEP_COL_STOCK.MARCA       - 1] || '');
    const descripcion = String(fila[DEP_COL_STOCK.DESCRIPCION - 1] || '');
    const unidad      = String(fila[DEP_COL_STOCK.UNIDAD      - 1] || item.unidad || '');

    const ubicacion = {
      deposito: String(fila[DEP_COL_STOCK.UBIC_DEPOSITO - 1] || ''),
      estante:  String(fila[DEP_COL_STOCK.UBIC_ESTANTE  - 1] || ''),
      columna:  String(fila[DEP_COL_STOCK.UBIC_COLUMNA  - 1] || ''),
      fila:     String(fila[DEP_COL_STOCK.UBIC_FILA     - 1] || '')
    };

    dep_actualizarStock(
      hojaStock, zonaItem, familia, marca, descripcion,
      tipo, Number(item.cantidad) || 0, fechaHoy, horaAhora,
      ubicacion, unidad, '', data.obs_general || '', ''
    );

    hojaMov.appendRow([
      idPedido, dep_normalizarFecha(data.fecha, timezone), tipo, data.responsable || '', data.obra || '', zonaItem,
      familia, marca, descripcion,
      item.cantidad, unidad, '', data.obs_general || '', nroEnvio,
      ubicacion.deposito, ubicacion.estante, ubicacion.columna, ubicacion.fila,
      ''   // N° Factura — no aplica a este tipo de movimiento
    ]);
  });

  if (noEncontrados.length > 0) {
    return jsonResp({ ok: false, error: `No se encontraron estos productos: ${noEncontrados.join(', ')}` });
  }

  return jsonResp({ ok: true, id: idPedido, envio: nroEnvio });
}

function crearProductoNuevo(data, ss) {
  const hojaStock = ss.getSheetByName('Stock');
  const hojaMov   = ss.getSheetByName('Movimientos') || ss.insertSheet('Movimientos');
  if (!hojaStock) return jsonResp({ ok: false, error: 'Hoja Stock no encontrada.' });

  dep_inicializarHojaMovimientos(hojaMov);
  dep_inicializarHojaStock(hojaStock);

  const nuevoId = dep_generarIdProducto(hojaStock);

  const tipoAltaRaw = String(data.tipo_alta || '').trim().toUpperCase();
  const esRetiro     = tipoAltaRaw === 'RETIRO';
  const obraLabel     = esRetiro
    ? 'Ingreso inicial / Alta - Retiro'
    : 'Ingreso inicial / Alta - Depósito';

  const zona        = esRetiro ? '' : (data.zona || '').trim();
  const familia      = (data.familia || 'Varios').trim();
  const marca        = (data.marca || '—').trim();
  const descripcion  = (data.descripcion || '').trim();
  const unidad       = (data.unidad || 'un').trim();
  const stockInicial = Number(data.stock_inicial !== undefined ? data.stock_inicial : data.stock_actual) || 0;
  const stockMinimo  = Number(data.stock_minimo) || 0;
  const responsable  = (data.responsable || 'Alta de producto').trim();

  const ubicDeposito = esRetiro ? '' : (data.deposito || '').trim();
  const ubicEstante  = esRetiro ? '' : (data.estante  || '').trim();
  const ubicColumna  = esRetiro ? '' : (data.columna  || '').trim();
  const ubicFila     = esRetiro ? '' : (data.fila     || '').trim();

  const factura = (data.factura || '').trim();

  const lugarRetiro   = (data.lugar_retiro || '').trim();
  const aclaracionUbi = (data.ubicacion_aclaracion || '').trim();
  const obsUsuario    = (data.observaciones || '').trim();

  let obsItemParts = [];
  if (esRetiro && lugarRetiro) obsItemParts.push('Retiro: ' + lugarRetiro);
  if (!esRetiro && aclaracionUbi) obsItemParts.push(aclaracionUbi);
  if (obsUsuario) obsItemParts.push(obsUsuario);
  const obsItem = obsItemParts.join(' | ');

  let imagenUrl = '';
  let errorFotos = '';
  if (data.fotos_base64 && Array.isArray(data.fotos_base64) && data.fotos_base64.length > 0) {
    try {
      const urls = data.fotos_base64.filter(Boolean).map((b64, idx) => {
        return subirImagenDrive(b64, `prod_${nuevoId}_${Date.now()}_${idx}.jpg`);
      });
      imagenUrl = urls.join('||');
    } catch (errFoto) {
      Logger.log('ERROR subiendo fotos en crearProductoNuevo: ' + errFoto.message);
      errorFotos = errFoto.message;
    }
  } else if (data.foto_base64) {
    try {
      imagenUrl = subirImagenDrive(data.foto_base64, `prod_${nuevoId}_${Date.now()}.jpg`);
    } catch (errFoto) {
      Logger.log('ERROR subiendo foto en crearProductoNuevo: ' + errFoto.message);
      errorFotos = errFoto.message;
    }
  }

  const ahora = new Date();
  const timezone = Session.getScriptTimeZone();
  const fechaHoy = Utilities.formatDate(ahora, timezone, 'dd/MM/yyyy');
  const horaAhora = Utilities.formatDate(ahora, timezone, 'HH:mm');

  const entradas = stockInicial > 0 ? stockInicial : 0;
  const salidas = 0;
  const devoluciones = 0;
  const stockActual = stockInicial;

  hojaStock.appendRow([
    nuevoId, zona, familia, marca, descripcion,
    imagenUrl, unidad,
    entradas, salidas, devoluciones, stockActual,
    stockMinimo,
    '',
    stockInicial > 0 ? 'ENTRADA' : 'ALTA', obsItem, fechaHoy, horaAhora,
    ubicDeposito, ubicEstante, ubicColumna, ubicFila,
    'Alta de producto nuevo'
  ]);

  const filaNum = hojaStock.getLastRow();
  hojaStock.getRange(filaNum, DEP_COL_STOCK.ESTADO).setFormula(`=IF(K${filaNum}<=L${filaNum},"REPONER","OK")`);

  // ── Refuerzo: escribir la imagen explícitamente por columna,          ──
  // ── sin depender de la posición dentro del appendRow.                  ──
  if (imagenUrl) {
    hojaStock.getRange(filaNum, DEP_COL_STOCK.IMAGEN).setValue(imagenUrl);
  }

  const celdaEstado = hojaStock.getRange(filaNum, DEP_COL_STOCK.ESTADO);
  const celdaStock = hojaStock.getRange(filaNum, DEP_COL_STOCK.STOCK_ACTUAL);
  if (stockActual <= stockMinimo) {
    celdaEstado.setBackground('#fee2e2').setFontColor('#dc2626').setFontWeight('bold');
    celdaStock.setBackground('#fee2e2').setFontColor('#dc2626').setFontWeight('bold');
  } else {
    celdaEstado.setBackground('#dcfce7').setFontColor('#15803d').setFontWeight('bold');
    celdaStock.setBackground('#dcfce7').setFontColor('#15803d').setFontWeight('bold');
  }

  const obsGeneralEnvio = (data.obs_general || '').trim();

  if (stockInicial > 0) {
    const idPedido = dep_generarIdPedido(hojaMov, 'ENTRADA');
    const nroEnvio = dep_generarNroEnvio();
    hojaMov.appendRow([
      idPedido, dep_normalizarFecha(null, timezone), 'ENTRADA', responsable, obraLabel, zona,
      familia, marca, descripcion,
      stockInicial, unidad, obsItem, obsGeneralEnvio, nroEnvio,
      ubicDeposito, ubicEstante, ubicColumna, ubicFila,
      factura
    ]);

    if (factura) {
      const filaMovNueva = hojaMov.getLastRow();
      const celdaFactura = hojaMov.getRange(filaMovNueva, DEP_COL_MOV.NRO_FACTURA);
      celdaFactura.setNumberFormat('@');
      celdaFactura.setValue(factura);
    }
  }

  return jsonResp({ ok: true, id: nuevoId, zona: zona, imagen: imagenUrl, error_fotos: errorFotos || null });
}

function actualizarObservacionProducto(data, ss) {
  const hojaStock = ss.getSheetByName('Stock');
  if (!hojaStock) return jsonResp({ ok: false, error: 'Hoja Stock no encontrada.' });

  const idBuscado = String(data.id || '').trim().toUpperCase();
  if (!idBuscado) return jsonResp({ ok: false, error: 'Falta el ID del producto.' });

  const ultimaFila = hojaStock.getLastRow();
  if (ultimaFila <= 1) return jsonResp({ ok: false, error: 'Stock vacío.' });

  const datos = hojaStock.getRange(2, 1, ultimaFila - 1, DEP_COL_STOCK.TOTAL).getValues();
  let filaNum = -1;
  for (let i = 0; i < datos.length; i++) {
    if (String(datos[i][DEP_COL_STOCK.ID - 1]).trim().toUpperCase() === idBuscado) {
      filaNum = i + 2;
      break;
    }
  }
  if (filaNum === -1) return jsonResp({ ok: false, error: 'Producto no encontrado.' });

  hojaStock.getRange(filaNum, DEP_COL_STOCK.ULT_OBS).setValue(String(data.observacion || '').trim());

  return jsonResp({ ok: true });
}

function actualizarUbicacionProducto(data, ss) {
  const hojaStock = ss.getSheetByName('Stock');
  if (!hojaStock) return jsonResp({ ok: false, error: 'Hoja Stock no encontrada.' });

  const idBuscado = String(data.id || '').trim().toUpperCase();
  if (!idBuscado) return jsonResp({ ok: false, error: 'Falta el ID del producto.' });

  const ultimaFila = hojaStock.getLastRow();
  if (ultimaFila <= 1) return jsonResp({ ok: false, error: 'Stock vacío.' });

  const datos = hojaStock.getRange(2, 1, ultimaFila - 1, DEP_COL_STOCK.TOTAL).getValues();
  let filaNum = -1;
  for (let i = 0; i < datos.length; i++) {
    if (String(datos[i][DEP_COL_STOCK.ID - 1]).trim().toUpperCase() === idBuscado) {
      filaNum = i + 2;
      break;
    }
  }
  if (filaNum === -1) return jsonResp({ ok: false, error: 'Producto no encontrado.' });

  hojaStock.getRange(filaNum, DEP_COL_STOCK.UBIC_DEPOSITO, 1, 4).setValues([[
    data.deposito || '', data.estante || '', data.columna || '', data.fila || ''
  ]]);

  return jsonResp({ ok: true });
}

function actualizarDatosProducto(data, ss) {
  const hojaStock = ss.getSheetByName('Stock');
  if (!hojaStock) return jsonResp({ ok: false, error: 'Hoja Stock no encontrada.' });

  const idBuscado = String(data.id || '').trim().toUpperCase();
  if (!idBuscado) return jsonResp({ ok: false, error: 'Falta el ID del producto.' });

  const ultimaFila = hojaStock.getLastRow();
  if (ultimaFila <= 1) return jsonResp({ ok: false, error: 'Stock vacío.' });

  const datos = hojaStock.getRange(2, 1, ultimaFila - 1, DEP_COL_STOCK.TOTAL).getValues();
  let filaNum = -1;
  for (let i = 0; i < datos.length; i++) {
    if (String(datos[i][DEP_COL_STOCK.ID - 1]).trim().toUpperCase() === idBuscado) {
      filaNum = i + 2;
      break;
    }
  }
  if (filaNum === -1) return jsonResp({ ok: false, error: 'Producto no encontrado.' });

  if (data.descripcion !== undefined) {
    hojaStock.getRange(filaNum, DEP_COL_STOCK.DESCRIPCION).setValue(String(data.descripcion || '').trim());
  }
  if (data.marca !== undefined) {
    hojaStock.getRange(filaNum, DEP_COL_STOCK.MARCA).setValue(String(data.marca || '').trim());
  }
  if (data.familia !== undefined) {
    hojaStock.getRange(filaNum, DEP_COL_STOCK.FAMILIA).setValue(String(data.familia || '').trim());
  }
  if (data.stock_minimo !== undefined) {
    const nuevoMinimo = Number(data.stock_minimo);
    if (!isNaN(nuevoMinimo) && nuevoMinimo >= 0) {
      hojaStock.getRange(filaNum, DEP_COL_STOCK.STOCK_MINIMO).setValue(nuevoMinimo);
    }
  }

  return jsonResp({ ok: true });
}

function actualizarImagenProducto(data, ss) {
  const hojaStock = ss.getSheetByName('Stock');
  if (!hojaStock) return jsonResp({ ok: false, error: 'Hoja Stock no encontrada.' });

  const idBuscado = String(data.id || '').trim().toUpperCase();
  if (!idBuscado) return jsonResp({ ok: false, error: 'Falta el ID del producto.' });
  if (!data.foto_base64) return jsonResp({ ok: false, error: 'Falta la foto.' });

  const ultimaFila = hojaStock.getLastRow();
  if (ultimaFila <= 1) return jsonResp({ ok: false, error: 'Stock vacío.' });

  const datos = hojaStock.getRange(2, 1, ultimaFila - 1, DEP_COL_STOCK.TOTAL).getValues();
  let filaNum = -1;
  for (let i = 0; i < datos.length; i++) {
    if (String(datos[i][DEP_COL_STOCK.ID - 1]).trim().toUpperCase() === idBuscado) {
      filaNum = i + 2;
      break;
    }
  }
  if (filaNum === -1) return jsonResp({ ok: false, error: 'Producto no encontrado.' });

  const nuevoLink = subirImagenDrive(data.foto_base64, `stock_${idBuscado}_${Date.now()}.jpg`);

  const celdaImagen = hojaStock.getRange(filaNum, DEP_COL_STOCK.IMAGEN);
  const actual = String(celdaImagen.getValue() || '').trim();
  const links = actual ? actual.split('||').map(s => s.trim()).filter(Boolean) : [];

  const modo = data.modo || 'reemplazar';
  let nuevosLinks;
  if (links.length === 0 || modo === 'reemplazar') {
    nuevosLinks = [nuevoLink];
  } else if (modo === 'agregar') {
    nuevosLinks = [...links, nuevoLink].slice(0, 2);
  } else if (modo === 'reemplazar_1') {
    nuevosLinks = [nuevoLink, links[1]].filter(Boolean);
  } else if (modo === 'reemplazar_2') {
    nuevosLinks = [links[0], nuevoLink].filter(Boolean);
  } else {
    nuevosLinks = [nuevoLink];
  }

  celdaImagen.setValue(nuevosLinks.join('||'));

  return jsonResp({ ok: true, imagen: nuevosLinks.join('||') });
}

function eliminarImagenProducto(data, ss) {
  const hojaStock = ss.getSheetByName('Stock');
  if (!hojaStock) return jsonResp({ ok: false, error: 'Hoja Stock no encontrada.' });

  const idBuscado = String(data.id || '').trim().toUpperCase();
  if (!idBuscado) return jsonResp({ ok: false, error: 'Falta el ID del producto.' });

  const ultimaFila = hojaStock.getLastRow();
  if (ultimaFila <= 1) return jsonResp({ ok: false, error: 'Stock vacío.' });

  const datos = hojaStock.getRange(2, 1, ultimaFila - 1, DEP_COL_STOCK.TOTAL).getValues();
  let filaNum = -1;
  for (let i = 0; i < datos.length; i++) {
    if (String(datos[i][DEP_COL_STOCK.ID - 1]).trim().toUpperCase() === idBuscado) {
      filaNum = i + 2;
      break;
    }
  }
  if (filaNum === -1) return jsonResp({ ok: false, error: 'Producto no encontrado.' });

  const celdaImagen = hojaStock.getRange(filaNum, DEP_COL_STOCK.IMAGEN);
  const actual = String(celdaImagen.getValue() || '').trim();
  const links = actual ? actual.split('||').map(s => s.trim()).filter(Boolean) : [];
  if (links.length === 0) return jsonResp({ ok: false, error: 'Este producto no tiene fotos.' });

  const slot = data.slot; 
  let linksABorrar = [];
  let linksQueQuedan = [];

  if (slot === 'todas') {
    linksABorrar = links;
    linksQueQuedan = [];
  } else {
    const idx = Number(slot) - 1; 
    if (idx < 0 || idx >= links.length) return jsonResp({ ok: false, error: 'Foto no encontrada en esa posición.' });
    linksABorrar = [links[idx]];
    linksQueQuedan = links.filter((_, i) => i !== idx);
  }

  linksABorrar.forEach(link => {
    const match = link.match(/[?&]id=([a-zA-Z0-9_-]+)/) || link.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) moverImagenAPapeleraInterna(match[1]);
  });

  celdaImagen.setValue(linksQueQuedan.join('||'));
  return jsonResp({ ok: true, imagen: linksQueQuedan.join('||') });
}


// ============================================================
// 6. MÓDULO TRASLADOS
// ============================================================
function procesarTraslado(data, ss) {
  const hojaMov   = ss.getSheetByName('Movimientos Traslados') || ss.insertSheet('Movimientos Traslados');
  const hojaStock = ss.getSheetByName('Stock Traslados')       || ss.insertSheet('Stock Traslados');

  tra_inicializarHojaMovimientos(hojaMov);
  tra_inicializarHojaStock(hojaStock);

  const fecha       = data.fecha       || '';
  const responsable = data.responsable || '';
  const origen      = data.origen      || '';
  const destino     = data.destino     || '';
  const obsGeneral  = data.obs_general || '';

  const nroTraslado = tra_generarNroTraslado();
  const idBase      = tra_generarIdMovimiento(hojaMov);

  const ahora     = new Date();
  const timezone  = Session.getScriptTimeZone();
  const fechaHoy  = Utilities.formatDate(ahora, timezone, 'dd/MM/yyyy');
  const horaAhora = Utilities.formatDate(ahora, timezone, 'HH:mm');

  const base = { idBase, fecha, responsable, origen, destino, obsGeneral, nroTraslado };

  (data.escaleras_dielectricas || []).forEach(item => {
    const descripcion = `Escalera Dieléctrica ${item.tipo} ${item.peldanos}`;
    tra_procesarItem(hojaMov, hojaStock, base,
      'Escalera Dieléctrica', descripcion, item.tipo, item.serie || '',
      Number(item.cant) || 0, item.estado || '', '', item.obs || '',
      fechaHoy, horaAhora);
  });

  (data.escaleras_madera || []).forEach(item => {
    const descripcion = `Escalera de Madera ${item.tipo} ${item.peldanos}`;
    tra_procesarItem(hojaMov, hojaStock, base,
      'Escalera de Madera', descripcion, item.tipo, item.serie || '',
      Number(item.cant) || 0, item.estado || '', '', item.obs || '',
      fechaHoy, horaAhora);
  });

  (data.ruedas || []).forEach(item => {
    const descripcion = `Rueda ${item.medida}`;
    tra_procesarItem(hojaMov, hojaStock, base,
      'Rueda de Camión', descripcion, item.tipo || 'Sin tipo', '',
      Number(item.cant) || 0, item.estado || '', item.equipo || '', item.obs || '',
      fechaHoy, horaAhora);
  });

  (data.nuevos || []).forEach(item => {
    tra_procesarItem(hojaMov, hojaStock, base,
      'Material Nuevo', item.nombre.trim(), item.unidad || '', item.desc || '',
      Number(item.cant) || 0, item.estado || '', '', item.obs || '',
      fechaHoy, horaAhora);
  });

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, id: idBase, traslado: nroTraslado }))
    .setMimeType(ContentService.MimeType.JSON);
}

function tra_generarNroTraslado() {
  const props    = PropertiesService.getScriptProperties();
  const timezone = Session.getScriptTimeZone();
  const hoy      = Utilities.formatDate(new Date(), timezone, 'yyyy-MM-dd');

  const ultimaFecha = props.getProperty('TRD_FECHA') || '';
  let   ultimoNum   = parseInt(props.getProperty('TRD_NUM') || '0', 10);

  if (ultimaFecha !== hoy) {
    ultimoNum = 0;
    props.setProperty('TRD_FECHA', hoy);
  }

  const nuevoNum = ultimoNum + 1;
  props.setProperty('TRD_NUM', String(nuevoNum));
  return 'TRD-' + String(nuevoNum).padStart(3, '0');
}

function tra_generarIdMovimiento(hojaMov) {
  const ultimaFila = hojaMov.getLastRow();
  let maxNum = 0;

  if (ultimaFila > 1) {
    const ids = hojaMov.getRange(2, TRA_COL_MOV.ID, ultimaFila - 1, 1).getValues();
    ids.forEach(([id]) => {
      const s = String(id || '');
      if (s.startsWith('TRA-')) {
        const num = parseInt(s.replace('TRA-', ''), 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
  }
  return 'TRA-' + String(maxNum + 1).padStart(3, '0');
}

function tra_generarIdStock(hojaStock) {
  const ultimaFila = hojaStock.getLastRow();
  if (ultimaFila <= 1) return 'ITEM-001';

  const ids = hojaStock.getRange(2, TRA_COL_STOCK.ID, ultimaFila - 1, 1).getValues();
  let maxNum = 0;
  ids.forEach(([id]) => {
    const s = String(id || '');
    if (s.startsWith('ITEM-')) {
      const num = parseInt(s.replace('ITEM-', ''), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  });
  return 'ITEM-' + String(maxNum + 1).padStart(3, '0');
}

function tra_inicializarHojaMovimientos(hoja) {
  if (hoja.getLastRow() > 0) return;

  hoja.appendRow([
    'ID Traslado', 'Fecha', 'Responsable', 'Origen → Destino',
    'Categoría', 'Descripción', 'Detalle', 'N° Serie / ID',
    'Cantidad', 'Estado', 'Camión / Equipo',
    'Obs. ítem', 'Obs. generales', 'N° Traslado',
  ]);

  const header = hoja.getRange(1, 1, 1, TRA_COL_MOV.TOTAL);
  header.setFontWeight('bold').setBackground('#1a1a2e').setFontColor('#ffffff');
  hoja.setFrozenRows(1);

  const anchos = [90, 100, 130, 220, 160, 260, 160, 110, 80, 100, 140, 200, 220, 100];
  anchos.forEach((w, i) => hoja.setColumnWidth(i + 1, w));
}

function tra_inicializarHojaStock(hoja) {
  if (hoja.getLastRow() > 0) return;

  hoja.appendRow([
    'ID Ítem', 'Depósito', 'Categoría', 'Descripción', 'Detalle',
    'Entradas', 'Salidas', 'Stock actual',
    'Último estado', 'Último mov.', 'Fecha', 'Hora',
  ]);

  const header = hoja.getRange(1, 1, 1, TRA_COL_STOCK.TOTAL);
  header.setFontWeight('bold').setBackground('#2563eb').setFontColor('#ffffff');
  hoja.setFrozenRows(1);

  const anchos = [90, 160, 160, 260, 160, 80, 80, 100, 110, 110, 110, 90];
  anchos.forEach((w, i) => hoja.setColumnWidth(i + 1, w));
}

function tra_actualizarStock(hojaStock, deposito, categoria, descripcion, detalle, tipoMov, cantidad, estadoItem, fechaHoy, horaAhora) {
  const ultimaFila = hojaStock.getLastRow();
  let filaNum = -1;

  if (ultimaFila > 1) {
    const datos = hojaStock.getRange(2, 1, ultimaFila - 1, TRA_COL_STOCK.TOTAL).getValues();
    for (let i = 0; i < datos.length; i++) {
      if (
        String(datos[i][TRA_COL_STOCK.DEPOSITO    - 1]) === deposito    &&
        String(datos[i][TRA_COL_STOCK.CATEGORIA   - 1]) === categoria   &&
        String(datos[i][TRA_COL_STOCK.DESCRIPCION - 1]) === descripcion &&
        String(datos[i][TRA_COL_STOCK.DETALLE     - 1]) === detalle
      ) {
        filaNum = i + 2;
        break;
      }
    }
  }

  if (filaNum === -1) {
    const nuevoId = tra_generarIdStock(hojaStock);
    hojaStock.appendRow([
      nuevoId, deposito, categoria, descripcion, detalle,
      0, 0, 0,
      estadoItem, tipoMov, fechaHoy, horaAhora
    ]);
    filaNum = hojaStock.getLastRow();
  }

  const vals = hojaStock.getRange(filaNum, TRA_COL_STOCK.ENTRADAS, 1, 2).getValues()[0];
  let entradas = Number(vals[0]) || 0;
  let salidas  = Number(vals[1]) || 0;

  if (tipoMov === 'ENTRADA') entradas += cantidad;
  if (tipoMov === 'SALIDA')  salidas  += cantidad;

  const stockActual = entradas - salidas;

  hojaStock.getRange(filaNum, TRA_COL_STOCK.ENTRADAS, 1, 3)
    .setValues([[entradas, salidas, stockActual]]);

  const celdaStock = hojaStock.getRange(filaNum, TRA_COL_STOCK.STOCK_ACTUAL);
  if (stockActual <= 0) {
    celdaStock.setBackground('#fee2e2').setFontColor('#dc2626').setFontWeight('bold');
  } else {
    celdaStock.setBackground('#dcfce7').setFontColor('#15803d').setFontWeight('bold');
  }

  hojaStock.getRange(filaNum, TRA_COL_STOCK.ESTADO_ITEM, 1, 4)
    .setValues([[estadoItem, tipoMov, fechaHoy, horaAhora]]);
}

function tra_colorearEstadoMov(hoja, fila) {
  const celda = hoja.getRange(fila, TRA_COL_MOV.ESTADO);
  const val   = celda.getValue();
  if (val === 'Bueno')   { celda.setBackground('#dcfce7').setFontColor('#15803d').setFontWeight('bold'); }
  if (val === 'Regular') { celda.setBackground('#ffedd5').setFontColor('#ea580c').setFontWeight('bold'); }
  if (val === 'Malo')    { celda.setBackground('#fee2e2').setFontColor('#dc2626').setFontWeight('bold'); }
}

function tra_procesarItem(hojaMov, hojaStock, base, categoria, descripcion, detalle, serie, cantidad, estado, equipo, obsItem, fechaHoy, horaAhora) {
  const { idBase, fecha, responsable, origen, destino, obsGeneral, nroTraslado } = base;
  const ruta = origen + ' → ' + destino;

  hojaMov.appendRow([
    idBase, fecha, responsable, ruta,
    categoria, descripcion, detalle, serie,
    cantidad, estado, equipo,
    obsItem, obsGeneral, nroTraslado
  ]);

  tra_colorearEstadoMov(hojaMov, hojaMov.getLastRow());

  tra_actualizarStock(hojaStock, origen,  categoria, descripcion, detalle, 'SALIDA',  cantidad, estado, fechaHoy, horaAhora);
  tra_actualizarStock(hojaStock, destino, categoria, descripcion, detalle, 'ENTRADA', cantidad, estado, fechaHoy, horaAhora);
}

// ============================================================
// 7. VISTAS HTML (QR)
// ============================================================
function _htmlProducto(p) {
  const esReponer  = p.estado === 'REPONER';
  const colorBadge = esReponer ? '#dc2626' : '#16a34a';
  const bgBadge    = esReponer ? '#fee2e2'  : '#dcfce7';
  const colorStock = p.stock_actual <= 0 ? '#dc2626' : (esReponer ? '#ea580c' : '#16a34a');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>${p.descripcion} — RPM Stock</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0f172a;
      color: #f1f5f9;
      min-height: 100vh;
      padding: 16px;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }
    .logo {
      font-size: 13px;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .id-badge {
      margin-left: auto;
      font-size: 11px;
      background: #1e293b;
      color: #64748b;
      padding: 3px 8px;
      border-radius: 20px;
      font-weight: 600;
    }
    .card {
      background: #1e293b;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 12px;
    }
    .familia-tag {
      font-size: 11px;
      font-weight: 600;
      color: #60a5fa;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .descripcion {
      font-size: 17px;
      font-weight: 700;
      color: #f8fafc;
      line-height: 1.3;
      margin-bottom: 4px;
    }
    .marca {
      font-size: 13px;
      color: #94a3b8;
    }
    .zona-chip {
      display: inline-block;
      margin-top: 10px;
      background: #0f172a;
      color: #7dd3fc;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 20px;
    }
    .stock-card {
      background: #1e293b;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 12px;
      text-align: center;
    }
    .stock-label {
      font-size: 12px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .stock-numero {
      font-size: 64px;
      font-weight: 800;
      line-height: 1;
      color: ${colorStock};
    }
    .stock-unidad {
      font-size: 14px;
      color: #64748b;
      margin-top: 4px;
    }
    .estado-badge {
      display: inline-block;
      margin-top: 14px;
      background: ${bgBadge};
      color: ${colorBadge};
      font-size: 14px;
      font-weight: 800;
      padding: 6px 20px;
      border-radius: 30px;
      letter-spacing: 1px;
    }
    .minimo-row {
      margin-top: 12px;
      font-size: 12px;
      color: #64748b;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin-bottom: 12px;
    }
    .stat-box {
      background: #1e293b;
      border-radius: 12px;
      padding: 14px 8px;
      text-align: center;
    }
    .stat-num {
      font-size: 22px;
      font-weight: 700;
      color: #f1f5f9;
    }
    .stat-label {
      font-size: 10px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 3px;
    }
    .stat-box.entradas .stat-num  { color: #4ade80; }
    .stat-box.salidas .stat-num   { color: #f87171; }
    .stat-box.devol .stat-num     { color: #60a5fa; }
    .ultimo-mov {
      background: #1e293b;
      border-radius: 12px;
      padding: 14px 16px;
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.7;
    }
    .ultimo-mov strong { color: #f1f5f9; }
    .footer {
      text-align: center;
      font-size: 11px;
      color: #334155;
      margin-top: 20px;
    }
  </style>
</head>
<body>

  <div class="header">
    <span class="logo">RPM Construcciones</span>
    <span class="id-badge">${p.id}</span>
  </div>

  <div class="card">
    <div class="familia-tag">${p.familia}</div>
    <div class="descripcion">${p.descripcion}</div>
    <div class="marca">${p.marca}</div>
    <span class="zona-chip">📍 ${p.zona}</span>
  </div>

  <div class="stock-card">
    <div class="stock-label">Stock actual</div>
    <div class="stock-numero">${p.stock_actual}</div>
    <div class="stock-unidad">${p.unidad || 'unidades'}</div>
    <div class="estado-badge">${p.estado}</div>
    ${p.stock_minimo > 0 ? `<div class="minimo-row">Mínimo: ${p.stock_minimo} u.</div>` : ''}
  </div>

  <div class="stats-grid">
    <div class="stat-box entradas">
      <div class="stat-num">${p.entradas}</div>
      <div class="stat-label">Entradas</div>
    </div>
    <div class="stat-box salidas">
      <div class="stat-num">${p.salidas}</div>
      <div class="stat-label">Salidas</div>
    </div>
    <div class="stat-box devol">
      <div class="stat-num">${p.devoluciones}</div>
      <div class="stat-label">Devol.</div>
    </div>
  </div>

  ${p.ult_mov ? `
  <div class="ultimo-mov">
    Último movimiento: <strong>${p.ult_mov}</strong><br>
    Fecha: <strong>${p.ult_fecha}</strong> &nbsp;|&nbsp; Hora: <strong>${p.ult_hora}</strong>
  </div>` : ''}

  <div class="footer">RPM Stock · Datos en tiempo real desde Google Sheets</div>

</body>
</html>`;

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function _htmlZona(zona, productos) {
  const filas = productos.map(p => {
    const esReponer   = p.estado === 'REPONER';
    const colorNum    = p.stock_actual <= 0 ? '#dc2626' : (esReponer ? '#ea580c' : '#4ade80');
    const bgEstado    = esReponer ? '#fee2e2' : '#dcfce7';
    const colorEstado = esReponer ? '#dc2626' : '#16a34a';
    return `
    <div class="item-card">
      <div class="item-top">
        <span class="item-familia">${p.familia}</span>
        <span class="item-estado" style="background:${bgEstado};color:${colorEstado}">${p.estado}</span>
      </div>
      <div class="item-desc">${p.descripcion}</div>
      <div class="item-marca">${p.marca}</div>
      <div class="item-bottom">
        <span class="item-id">${p.id}</span>
        <span class="item-stock" style="color:${colorNum}">${p.stock_actual} ${p.unidad || 'u.'}</span>
      </div>
    </div>`;
  }).join('');

  const reponer = productos.filter(p => p.estado === 'REPONER').length;
  const ok      = productos.length - reponer;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>${zona} — RPM Stock</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0f172a;
      color: #f1f5f9;
      min-height: 100vh;
      padding: 16px;
    }
    .header { margin-bottom: 16px; }
    .logo { font-size: 12px; font-weight: 700; color: #64748b; letter-spacing: 1px; text-transform: uppercase; }
    .zona-titulo { font-size: 22px; font-weight: 800; color: #f8fafc; margin-top: 4px; }
    .resumen {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 16px;
    }
    .res-box {
      background: #1e293b;
      border-radius: 12px;
      padding: 12px;
      text-align: center;
    }
    .res-num   { font-size: 28px; font-weight: 800; }
    .res-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
    .res-box.ok .res-num      { color: #4ade80; }
    .res-box.reponer .res-num { color: #f87171; }
    .search-wrap { margin-bottom: 12px; }
    .search-input {
      width: 100%;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      color: #f1f5f9;
      font-size: 14px;
      padding: 10px 14px;
      outline: none;
    }
    .search-input::placeholder { color: #475569; }
    .lista { display: flex; flex-direction: column; gap: 8px; }
    .item-card {
      background: #1e293b;
      border-radius: 12px;
      padding: 14px;
    }
    .item-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .item-familia { font-size: 11px; color: #60a5fa; font-weight: 600; text-transform: uppercase; }
    .item-estado  { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
    .item-desc    { font-size: 14px; font-weight: 600; color: #f8fafc; margin-bottom: 2px; }
    .item-marca   { font-size: 12px; color: #64748b; margin-bottom: 8px; }
    .item-bottom  { display: flex; justify-content: space-between; align-items: center; }
    .item-id      { font-size: 11px; color: #475569; }
    .item-stock   { font-size: 18px; font-weight: 800; }
    .footer { text-align: center; font-size: 11px; color: #334155; margin-top: 20px; }
  </style>
</head>
<body>

  <div class="header">
    <div class="logo">RPM Construcciones</div>
    <div class="zona-titulo">📍 ${zona}</div>
  </div>

  <div class="resumen">
    <div class="res-box ok">
      <div class="res-num">${ok}</div>
      <div class="res-label">OK</div>
    </div>
    <div class="res-box reponer">
      <div class="res-num">${reponer}</div>
      <div class="res-label">Reponer</div>
    </div>
  </div>

  <div class="search-wrap">
    <input class="search-input" type="search" placeholder="Buscar producto..." oninput="filtrar(this.value)">
  </div>

  <div class="lista" id="lista">
    ${filas}
  </div>

  <div class="footer">RPM Stock · ${productos.length} productos · Datos en tiempo real</div>

  <script>
    function filtrar(q) {
      const term = q.toLowerCase();
      document.querySelectorAll('.item-card').forEach(el => {
        el.style.display = el.innerText.toLowerCase().includes(term) ? '' : 'none';
      });
    }
  <\/script>
</body>
</html>`;

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function _htmlError(msg) {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error — RPM Stock</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #0f172a; color: #f1f5f9;
           display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; }
    .box { background: #1e293b; border-radius: 16px; padding: 32px; text-align: center; max-width: 340px; }
    .icon { font-size: 40px; margin-bottom: 12px; }
    .titulo { font-size: 18px; font-weight: 700; color: #f87171; margin-bottom: 8px; }
    .msg { font-size: 14px; color: #94a3b8; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="box">
    <div class="icon">⚠️</div>
    <div class="titulo">No se pudo cargar</div>
    <div class="msg">${msg}</div>
  </div>
</body>
</html>`;
  return HtmlService.createHtmlOutput(html);
}

// ============================================================
// 8. UTILIDADES DE MANTENIMIENTO
// ============================================================

function forzarAutorizacionFuerte() {
  DriveApp.createFile("Prueba_de_Permisos.txt", "El sistema ya tiene permisos");
}

function forzarFormatoTextoFactura() {
  const ss = SpreadsheetApp.openById('1PWCKGAQgZfBEWPwqWppsbylLdJLxJe3I6XWrEAhBwQk');
  const hojaMov = ss.getSheetByName('Movimientos');
  if (!hojaMov) return;
  hojaMov.getRange(1, DEP_COL_MOV.NRO_FACTURA, hojaMov.getMaxRows(), 1).setNumberFormat('@');
  Logger.log('Columna N° Factura formateada como texto.');
}

function instalarTriggerLimpiezaDiaria() {
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'limpiarImagenesVencidas') ScriptApp.deleteTrigger(t);
  });

  ScriptApp.newTrigger('limpiarImagenesVencidas')
    .timeBased()
    .everyDays(1)
    .atHour(3) 
    .create();
}