# Sistema de diseño SIRCS

Base: estilo **“Accesible y ético”** sugerido por la skill UI UX Pro Max para sistemas de gobierno y servicios públicos, con paleta verde · blanco · rojo elegida por el equipo. La estructura del portal se inspira en portales de trámites en línea (barra superior fija, encabezado con reloj, tarjetas sobre el encabezado, pasos y guía en video).

## Colores (tokens)

| Token | Claro | Uso |
|---|---|---|
| `--primary` | `#006847` | botones principales, asistente, enlaces |
| `--accent` | `#CE1126` | acentos, sección activa, “Entrar al panel” |
| `--band` | `#004D33` | franja superior |
| `--bg` / `--surface` | `#F3F5F3` / `#FFFFFF` | fondo y tarjetas |
| `--fg` | `#121A16` | texto |
| `--ok`, `--warn`, `--danger` | | estados, no son color de marca |

Todos tienen versión para modo oscuro. **No escribas colores sueltos en los componentes**: usa siempre `var(--token)`.

Evitamos a propósito guinda + dorado (identidad del gobierno federal) y rosa (identidad del INE).

## Tipografía

- Títulos: **Manrope** 700–800
- Texto: **Public Sans**
- Folios, claves y horas: **IBM Plex Mono**
- Marca en la credencial: **Unbounded**

## Accesibilidad (obligatorio)

- Contraste mínimo 4.5:1 en texto.
- Barra superior fija con **tamaño de texto** (3 niveles) y **alto contraste**, pensada para personas mayores.
- Foco visible con teclado, enlace “Saltar al contenido”, etiquetas en todos los campos.
- Errores junto al campo, explicando cómo corregirlos.
- Áreas táctiles de al menos 44 × 44 px.
- Se respeta `prefers-reduced-motion` (la credencial no se inclina).

## Referencia visual

`docs/maqueta-v4.html` es la maqueta original en un solo archivo. Ábrela en el navegador para comparar.
