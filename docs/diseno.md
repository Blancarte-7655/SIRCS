# Sistema de diseño SIRCS

Base: estilo **“Accesible y ético”** sugerido por la skill UI UX Pro Max para sistemas de gobierno y servicios públicos, con paleta verde · blanco · rojo elegida por el equipo. La estructura del portal se inspira en portales de trámites en línea (barra superior fija, encabezado con reloj, tarjetas sobre el encabezado, pasos y guía en video).

## Colores (tokens)

**Estilo formal.** El color casi no se ve en reposo; aparece al pasar el cursor.

- **Día:** grafito cálido (ligeramente café) con **bronce** al pasar el cursor, sobre tonos piedra.
- **Noche:** carbón con **jade** al pasar el cursor, sobre negro.
- **Credencial:** cuerpo crema y franja formal en uno de **4 colores que elige la persona** (Grafito, Marino, Pizarra, Musgo). El azul maya solo aparece en la greca y la trama. La elección se guarda en el navegador (`hooks/useCardColor.js`) y se ve igual en la portada.
- Destellos verde y rojo de la bandera solo en detalles pequeños (subrayado del título, quetzal, bandera en recuadro).

| Token | Día | Noche | Uso |
|---|---|---|---|
| `--primary` | `#2E2A26` | `#ECE8E2` | botones (grafito de día, claro de noche) |
| `--primary-hover` / `--hover-ink` | `#8C6239` (bronce) | `#1F7F63` / `#6FCBA8` (jade) | solo al pasar el cursor; también el subrayado del menú activo |
| `--primary-ink` | `#2E2A26` | `#ECE8E2` | texto de enlaces e íconos activos |
| `--deep` / `--feature-a` | `#2E2A26` / `#36302A` | `#262A2E` | piezas oscuras |
| `--card-a` / `--card-b` | según el color elegido | | franja de la credencial |
| `--card-maya` | `#2A7FA0` | | azul maya: greca y trama de la credencial |
| `--surface-2` / `--muted` | `#F7F5F2` / `#EFEBE6` | | neutros cálidos (piedra) para fondos e íconos |
| `--flag-green` | `#3F8F6B` | `#4FBF8B` | destellos verdes |
| `--flag-red` / `--accent` | `#C4474F` | `#F0616B` | destellos rojos, subrayado del menú |
| `--bg` | `#FFFFFF` | `#08090A` | fondo |

Regla: usa el azul con moderación (acciones principales y enlaces). `--primary` para fondos (con texto `--on-primary`) y `--primary-ink` para texto o íconos. **No escribas colores sueltos en los componentes.**

## Detalles mayas y de la bandera (`components/Maya.jsx`)

- **Greca escalonada** (`<Greca />`): separadores, pie de página y base de la credencial.
- **Numeración maya** (`<MayaNumber n={3} />`): punto = 1, barra = 5. Se usa en los pasos del registro.
- **Ilustración panorámica** (`components/Panorama.jsx`): fondo de la portada con sol, pirámide alta, pirámide de Kukulkán (tableros, escalinata con alfardas y serpientes, templo con puertas y friso), Ángel de la Independencia (estrías, anillos, capitel y Victoria alada dorada), quetzal (cresta, ojo, plumas de la cola) y agaves y nopal con tunas. Luz y sombra con dos tonos. En celular se recorta al centro.

## Movimiento

- **Profundidad al hacer scroll** (parallax): cada capa del fondo se mueve a su ritmo (`--k` en `Maya.jsx`, `useParallax` en `Portal.jsx`).
- **Animaciones suaves**: el quetzal planea y aletea y el brillo de la credencial pasa solo.
- **Credencial**: con mouse se inclina siguiendo el puntero; en celular se inclina y brilla según el scroll.
- Todo se desactiva si la persona tiene activado “reducir movimiento” en su sistema.
- **Bandera en recuadro** (`<FlagBadge />`): barra superior, separadores y pie. **Siempre sin escudo**: su uso está reservado a documentos oficiales.

## Credencial

Color crema con franja carbón arriba y detalles mayas en azul (con greca), texto oscuro para que se lea bien, y la palabra **MÉXICO** en lugar de bandera. Conserva destellos verde y rojo en las esquinas, holograma iridiscente, imagen fantasma, microtexto y la marca de agua **MUESTRA**. Se ve igual en tema día y noche porque representa un objeto físico.

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
- En celular la barra superior muestra solo íconos (con nombre accesible) y los pasos se vuelven línea de tiempo vertical.
- Se respeta `prefers-reduced-motion` (la credencial no se inclina).

## Referencia visual

`docs/maqueta-v4.html` es la maqueta original en un solo archivo. Ábrela en el navegador para comparar.

## Estados de la interfaz (`components/States.jsx`)

- **Carga**: `<Skeleton />` (bloques grises animados) mientras llegan los datos.
- **Vacío**: `<EmptyState />` cuando una búsqueda no encuentra nada, con una acción para salir (p. ej. “Limpiar filtros”).
- **Error**: `<ErrorState />` con botón “Reintentar”.
- `hooks/useFakeRequest.js` simula la API con retraso; al tener backend se cambia por `fetch`.

## Navegación

- Escritorio: menú grande con todas las subsecciones al pasar el mouse.
- Celular y tableta: botón **Menú** que abre un panel con todas las secciones y subsecciones.
- Transición suave al cambiar de página y página 404 propia.
