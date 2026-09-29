# Sistema de diseño SIRCS

Base: estilo **“Accesible y ético”** sugerido por la skill UI UX Pro Max para sistemas de gobierno y servicios públicos, con paleta verde · blanco · rojo elegida por el equipo. La estructura del portal se inspira en portales de trámites en línea (barra superior fija, encabezado con reloj, tarjetas sobre el encabezado, pasos y guía en video).

## Colores (tokens)

**Azul maya** (azul petróleo inspirado en el pigmento maya) como color de marca, con **destellos de verde y rojo de la bandera**. Día con fondo blanco; noche casi negra con el azul encendido.

Se eligió además por **neutralidad**: al simular un registro de corte electoral evitamos colores asociados a partidos (guinda, azul rey, tricolor completo), igual que el INE usa rosa.

| Token | Día | Noche | Uso |
|---|---|---|---|
| `--primary` | `#1F6F8B` | `#1B7F9E` | botones y superficies de marca |
| `--primary-ink` | `#1F6F8B` | `#6CC3DD` | texto e íconos de marca |
| `--deep` | `#0F3B4A` | `#121719` | franja superior y tarjetas oscuras |
| `--flag-green` | `#3F8F6B` | `#4FBF8B` | destellos verdes |
| `--flag-red` / `--accent` | `#C4474F` | `#F0616B` | destellos rojos y marcas escalonadas |
| `--bg` | `#FFFFFF` | `#08090A` | fondo |

Regla: `--primary` para fondos (con texto `--on-primary`) y `--primary-ink` para texto o íconos. **No escribas colores sueltos en los componentes.**

## Detalles mayas y de la bandera (`components/Maya.jsx`)

- **Greca escalonada** (`<Greca />`): separadores, pie de página y base de la credencial.
- **Numeración maya** (`<MayaNumber n={3} />`): punto = 1, barra = 5. Se usa en los pasos del registro.
- **Esquina escalonada**: marca roja en tarjetas y títulos, en forma de escalinata.
- **Pirámide escalonada** (`<Pyramid />`): silueta al fondo de la portada.
- **Bandera en recuadro** (`<FlagBadge />`): barra superior, separadores y pie. **Siempre sin escudo**: su uso está reservado a documentos oficiales.

## Credencial

Blanca con franja azul maya arriba (con greca), texto oscuro para que se lea bien, y la palabra **MÉXICO** en lugar de bandera. Conserva destellos verde y rojo en las esquinas, holograma iridiscente, imagen fantasma, microtexto y la marca de agua **MUESTRA**. Se ve igual en tema día y noche porque representa un objeto físico.

## Logotipo

Solo el texto **SIRCS** en Unbounded, color `--primary-ink`. Sin sello.

## Tipografía

- Títulos: **Manrope** 700–800
- Texto: **Public Sans**
- Folios, claves y horas: **IBM Plex Mono**
- Logotipo SIRCS y marca en la credencial: **Unbounded**

## Accesibilidad (obligatorio)

- Contraste mínimo 4.5:1 en texto.
- Barra superior fija con **tamaño de texto** (3 niveles), **alto contraste** y **tema día/noche**, pensada para personas mayores.
- Foco visible con teclado, enlace “Saltar al contenido”, etiquetas en todos los campos.
- Errores junto al campo, explicando cómo corregirlos.
- Áreas táctiles de al menos 44 × 44 px.
- Se respeta `prefers-reduced-motion` (la credencial no se inclina).

## Referencia visual

`docs/maqueta-v4.html` es la maqueta original en un solo archivo. Ábrela en el navegador para comparar.
