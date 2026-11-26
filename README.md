# SIS · Sistema de Identidad Simulado

Proyecto académico del **Equipo INE · Tlaquepaque**. Simula el registro y la credencialización de personas con **datos 100 % ficticios**.

> **No es un sistema oficial.** No tiene relación con el INE ni con ninguna institución pública. La interfaz no muestra avisos, pero la credencial siempre lleva la marca de agua **MUESTRA**, y el sitio se publica con usuario/contraseña y sin indexar en buscadores.

## Estructura

```
sircs/
├── frontend/                React + Vite (lo visual, con datos ficticios)
│   └── src/
│       ├── styles/          tokens.css (colores y fuentes), base, layout, portal, pages
│       ├── components/      TopBar (barra fija, menú grande y menú de celular), Footer, Layout,
│       │                    IdCard, Panorama (fondo ilustrado), Maya, States (carga/vacío/error), Icon
│       ├── pages/           Portal, Login, Registro (4 pasos), Panel, Credencial, NotFound (404)
│       ├── hooks/           accesibilidad, tema día/noche, reloj, color de credencial y useFakeRequest
│       └── data/mock.js     datos ficticios = contrato de lo que devolverá la API
├── backend/                 Node + Express + PostgreSQL (siguiente etapa)
├── deploy/nginx-sircs.conf   ejemplo de sitio para el servidor
├── docs/                    maqueta HTML y notas de diseño
└── .github/workflows/       despliegue automático al servidor
```

## Correr en tu computadora

Necesitas [Node.js](https://nodejs.org) 20 o más reciente (`node -v` para revisar).

```bash
cd frontend
npm install      # la primera vez
npm run dev      # abre http://localhost:5173
```

Para compilar como quedará en el servidor: `npm run build` (genera `frontend/dist/`).

## Rutas

| Ruta | Pantalla |
|---|---|
| `/` | Portal ciudadano |
| `/login` | Inicio de sesión (ciudadano u operativo) |
| `/registro` | Registro en 4 pasos: datos, domicilio, foto y firma, revisión |
| `/panel` | Panel del operador |
| `/credencial` | Credencial digital simulada |
| cualquier otra | Página 404 |

## Cómo trabajar en equipo

1. Abre el repo en **GitHub Desktop** → *Fetch origin* para traer lo último.
2. Crea una rama para tu cambio (*Current branch → New branch*), por ejemplo `registro-paso-2`.
3. Haz tus cambios, luego **Commit** con un mensaje claro y **Push origin**.
4. Abre un *Pull Request* en GitHub para que otro integrante lo revise.
5. Al unirlo a `main`, el sitio se publica solo en el servidor.

## Despliegue automático

Cada *Push* a `main` que toque `frontend/` ejecuta `.github/workflows/deploy.yml`: compila en GitHub y sube `dist/` por `rsync` a `/var/www/sircs` del servidor.

Configúralo una vez en **Settings → Secrets and variables → Actions** con:

| Secreto | Valor |
|---|---|
| `SSH_HOST` | IP o dominio del servidor |
| `SSH_USER` | usuario con permiso en `/var/www/sircs` (p. ej. `deploy`) |
| `SSH_KEY` | llave privada SSH de ese usuario |

En el servidor, usa `deploy/nginx-sircs.conf` como base: sirve la carpeta, manda todas las rutas a `index.html`, pide usuario/contraseña y agrega `X-Robots-Tag: noindex`.

## Reglas del proyecto (análisis legal)

- Nada de “credencial para votar”, “padrón electoral” ni “lista nominal”. Usamos *credencial de identificación simulada*, *registro de personas* y *listado de registros activos*.
- Sin escudos, logotipos ni composición de documentos oficiales.
- Solo datos ficticios. La marca **MUESTRA** debe aplicarse también en el servidor cuando exista el backend.

## Diseño

Estilo **institucional mexicano**: de día guinda con filetes dorado sobrio, de noche grafito y pino; títulos en serif, filetes finos y greca discreta. Credencial modelo Documento con 5 colores y elementos de seguridad (QR, sellos, código de barras). Ver `docs/diseno.md`.
.......