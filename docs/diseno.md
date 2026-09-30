# Sistema de diseño SIS · Institucional mexicano

Elegido entre tres propuestas. **Autoridad, confianza y estabilidad** sin verse frío ni anticuado: composición editorial, mucho aire, filetes finos y un solo acento de color.

## Color (`styles/tokens.css`)

- **Día · Guinda:** fondo blanco cálido `#FAF8F6`, guinda `#5C1A2B` en botones y enlaces (hover `#7A2438`), dorado sobrio `#A8864F` solo en filetes y marcas pequeñas. Piezas oscuras en guinda profundo `#4A1522`.
- **Noche · Grafito y pino:** casi negro `#0C0D0E`, texto claro y verde pino (`#2F6B5A` / `#9CCBBB`) al pasar el cursor y en acentos.
- Roles de acento: `--accent` (filetes), `--accent-ink` (texto), `--accent-solid` (fondo con texto blanco), `--accent-on-dark` (sobre piezas oscuras).
- Estados (`--ok`, `--warn`, `--danger`) no son color de marca. **No escribas colores sueltos en los componentes.**

## Tipografía

- Títulos: **Source Serif 4** 600 (serif institucional); cursiva en el color de acento para la palabra clave del título.
- Texto e interfaz: **Public Sans**.
- Folios, claves y horas: **IBM Plex Mono**.
- Etiquetas: mayúsculas pequeñas con espaciado amplio (`.eyebrow`), precedidas por un cuadro de acento.

## Formas

- Esquinas de 3–4 px, sombras casi nulas; la estructura se marca con filetes de 1 px.
- Piezas importantes con **filete superior de 3 px en el color de acento** (dorado de día, pino de noche).
- Encabezados de sección alineados a la izquierda con descripción a la derecha y filete inferior.

## Identidad maya y mexicana (discreta)

- **Marca** (`components/LogoMark.jsx`): sello de línea fina con greca escalonada y un punto de acento.
- **Greca** (`<Greca />`) solo como filete fino: bajo la portada, separadores, pie y 404.
- **Numeración maya** (`<MayaNumber />`) en los pasos del registro.
- **Bandera en recuadro** (`<FlagBadge />`), siempre sin escudo.

## Portada

Encabezado editorial (título, datos clave en columnas y credencial en marco tipo documento) → servicios en línea → pasos del registro → franja de garantías → guía en video → pie institucional en columnas.

## Movimiento (`styles/motion.css`)

Solo 3 tipos, discretos: aparición suave al cargar y al entrar en pantalla (`.reveal`, `hooks/useReveal.js`); microinteracciones en botones y tarjetas; transiciones entre páginas, pestañas y pasos. Sin parallax ni movimiento continuo. Todo se apaga con "reducir movimiento".

## Credencial (modelo Documento)

Objeto físico: igual en día y noche (`styles/card.css`). Cuerpo claro `--card-paper`, franja lateral en el color que elige la persona (**Guinda**, Grafito, Marino, Pizarra, Musgo) con **MÉXICO** en vertical, nombre en serif y filetes finos entre datos. Datos de muestra: **Olivia Elizabeth Apellido**.

Elementos de seguridad (todos decorativos en esta etapa):
- Trama guilloche y líneas finas de fondo; microtexto; marca de agua **MUESTRA**.
- **QR pequeño** en el anverso y QR de verificación en el reverso.
- **Sello de seguridad** (anillo con microtexto, roseta y pirámide escalonada, con reflejo iridiscente) sobre la foto y junto a la firma.
- **Código de barras** en el reverso (en la versión real: PDF417 con datos firmados).
- Imagen fantasma, NFC y chip; greca en azul maya.

## Accesibilidad (obligatorio)

- Contraste mínimo 4.5:1 en texto; barra superior con tamaño de texto, alto contraste, tema y lengua siempre visible.
- Foco visible en todos los controles; objetivos táctiles de 44 px o más.
- Estados de carga, vacío y error en todo lo que viene de la API.
