/*
  Datos ficticios para la maqueta.
  Cuando exista el backend, cada export se reemplaza por una llamada a la API
  (el nombre del endpoint sugerido va en el comentario de cada uno).
  Ninguna persona aquí es real.
*/

// GET /api/avisos
export const avisos = [
  { id: 1, titulo: 'Mantenimiento programado del sistema el 3 de octubre', fecha: '26/09/28', nuevo: true },
  { id: 2, titulo: 'Horario extendido en el Módulo 03 de Tlaquepaque', fecha: '26/09/15' },
  { id: 3, titulo: 'Cambios en la verificación por correo electrónico', fecha: '26/08/30' },
  { id: 4, titulo: 'Aviso de privacidad simplificado', fecha: '26/08/01' },
]

// GET /api/preguntas
export const preguntas = [
  { id: 1, titulo: '¿Cuánto tarda la validación de mi registro?' },
  { id: 2, titulo: '¿Qué hago si el sistema detecta un duplicado?' },
  { id: 3, titulo: '¿Puedo cambiar mi cita?' },
  { id: 4, titulo: '¿Por qué mi credencial dice MUESTRA?' },
]

export const pasosRegistro = [
  { icon: 'doc', titulo: 'Aviso de privacidad y consentimiento', nota: 'correo electrónico' },
  { icon: 'idBadge', titulo: 'Datos personales', nota: 'acta de nacimiento' },
  { icon: 'pin', titulo: 'Domicilio', nota: 'comprobante reciente' },
  { icon: 'camera', titulo: 'Fotografía y firma', nota: 'en línea o en módulo' },
  { icon: 'shield', titulo: 'Revisión y envío', nota: 'recibes tu folio' },
]

// Opciones del asistente "¿Qué trámite necesito?"
export const tramites = [
  { id: 'nuevo', etiqueta: 'Primera vez', tramite: 'Nuevo registro' },
  { id: 'domicilio', etiqueta: 'Me mudé', tramite: 'Cambio de domicilio' },
  { id: 'reposicion', etiqueta: 'La perdí', tramite: 'Reposición' },
  { id: 'correccion', etiqueta: 'Hay un error', tramite: 'Corrección de datos' },
]

// GET /api/registros?q=&estado=&municipio=
export const registros = [
  { folio: 'RG-26-004817', nombre: 'Olivia Elizabeth Apellido', edad: 22, sexo: 'Mujer', municipio: 'San Pedro Tlaquepaque', actualizado: '28/09/2026 16:42', estado: 'pendiente' },
  { folio: 'RG-26-004809', nombre: 'Luis Ángel Cárdenas Íñiguez', edad: 34, sexo: 'Hombre', municipio: 'Tonalá', actualizado: '28/09/2026 15:10', estado: 'duplicado' },
  { folio: 'RG-26-004795', nombre: 'Ximena Guadalupe Robles Plascencia', edad: 19, sexo: 'Mujer', municipio: 'Zapopan', actualizado: '28/09/2026 12:03', estado: 'activo' },
  { folio: 'RG-26-004771', nombre: 'Ramón Esteban Villaseñor Gómez', edad: 61, sexo: 'Hombre', municipio: 'Guadalajara', actualizado: '27/09/2026 18:55', estado: 'emitida' },
  { folio: 'RG-26-004760', nombre: 'Sofía Anahí Delgado Barajas', edad: 27, sexo: 'Mujer', municipio: 'San Pedro Tlaquepaque', actualizado: '27/09/2026 11:20', estado: 'activo' },
  { folio: 'RG-26-004752', nombre: 'Jesús Alberto Macías Loza', edad: 45, sexo: 'Hombre', municipio: 'Zapopan', actualizado: '27/09/2026 09:41', estado: 'pendiente' },
]

export const estados = {
  activo: { texto: 'Activo', clase: 'pill-ok', accion: 'Ver' },
  pendiente: { texto: 'Pendiente', clase: 'pill-warn', accion: 'Revisar' },
  duplicado: { texto: 'Posible duplicado', clase: 'pill-bad', accion: 'Comparar' },
  emitida: { texto: 'Credencial emitida', clase: 'pill-info', accion: 'Ver' },
}

export const municipios = ['San Pedro Tlaquepaque', 'Guadalajara', 'Zapopan', 'Tonalá']

// GET /api/indicadores
export const indicadores = {
  activos: 12486, activosSemana: 214,
  pendientes: 37, pendientesViejos: 9,
  duplicados: 4,
  emitidasHoy: 58, emitidas7dias: [31, 36, 33, 45, 43, 52, 58],
}

// GET /api/bitacora?limite=4
export const bitacora = [
  { tipo: 'danger', titulo: 'Alerta de duplicado', detalle: 'en RG-26-004809 · coincide 94% con RG-24-011302', hora: '15:10', quien: 'sistema' },
  { tipo: 'ok', titulo: 'Credencial emitida', detalle: 'para RG-26-004771', hora: '14:37', quien: 'J. Ramírez' },
  { tipo: 'primary', titulo: 'Domicilio actualizado', detalle: 'en RG-25-008654', hora: '13:02', quien: 'A. Navarro' },
  { tipo: 'warn', titulo: 'Rol modificado', detalle: 'C. Peña pasó a Supervisor', hora: '10:48', quien: 'admin' },
]

// GET /api/credencial/:folio
export const credencial = {
  nombres: 'Olivia Elizabeth',
  apellidos: 'Apellido',
  folio: 'RG-26-004817',
  nacimiento: '17·04·2003',
  sexo: 'M',
  vigencia: '2026–2036',
  clave: 'AEXO030417MJLPXL04',
  domicilio: 'C. Independencia 214, Col. Centro',
  municipio: 'San Pedro Tlaquepaque',
  estado: 'Jalisco · 14',
  cp: '45500',
  distrito: '16',
  seccion: '2451',
  localidad: '0001',
  rfc: 'AEXO030417H45',
  registro: '2026 01',
  emision: 'Módulo 03 · 28·09·2026',
  firma: 'O. E. Apellido',
}

export const operador = { nombre: 'Jorge Ramírez', iniciales: 'JR', puesto: 'Operador · Módulo 03' }

export const sitiosRelacionados = [
  { icon: 'pin', texto: 'Módulos de atención' },
  { icon: 'shield', texto: 'Consulta de vigencia' },
  { icon: 'help', texto: 'Centro de ayuda' },
  { icon: 'chart', texto: 'Datos abiertos' },
  { icon: 'access', texto: 'Accesibilidad' },
  { icon: 'school', texto: 'Proyecto académico' },
]
