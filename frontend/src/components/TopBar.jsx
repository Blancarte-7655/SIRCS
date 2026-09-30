import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Icon from './Icon.jsx'
import useAccessibility from '../hooks/useAccessibility.js'
import useClock from '../hooks/useClock.js'
import useTheme from '../hooks/useTheme.js'
import { FlagBadge } from './Maya.jsx'
import LogoMark from './LogoMark.jsx'

// Menú principal. Cada sección abre sus subsecciones en el panel desplegable.
const MENU = [
  { label: 'Guía', to: '/', match: ['/'], items: [
    { label: 'Guía del trámite', nota: 'Qué es y para qué sirve', to: '/' },
    { label: '¿Quién debe registrarse?', nota: 'Requisitos por edad y situación', to: '/' },
    { label: 'Cómo es el registro', nota: 'Los cinco pasos', to: '/#pasos' },
    { label: 'Asistente de trámite', nota: 'Descubre qué trámite necesitas', to: '/#asistente' },
  ] },
  { label: 'Registro', to: '/registro', match: ['/registro'], items: [
    { label: 'Nuevo registro', nota: 'Primera vez o reposición', to: '/registro' },
    { label: 'Agendar cita en módulo', nota: 'Elige día y horario', to: '/registro' },
    { label: 'Requisitos y documentos', nota: 'Qué debes tener a la mano', to: '/' },
  ] },
  { label: 'Consulta', to: '/credencial', match: ['/credencial'], items: [
    { label: 'Consultar y corregir', nota: 'Con tu folio o correo', to: '/#consulta' },
    { label: 'Mi credencial', nota: 'Ver, descargar y verificar', to: '/credencial' },
  ] },
  { label: 'Avisos', to: '/#avisos', match: [], items: [
    { label: 'Avisos', nota: 'Novedades del servicio', to: '/#avisos' },
    { label: 'Preguntas frecuentes', nota: 'Respuestas rápidas', to: '/#avisos' },
    { label: 'Módulos de atención', nota: 'Direcciones y horarios', to: '/' },
  ] },
]

const IDIOMAS = ['Español', 'English', 'Náhuatl', 'Wixárika', 'Maya']

export default function TopBar() {
  const a11y = useAccessibility()
  const clock = useClock()
  const { isDark, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(-1) // menú desplegable abierto (índice) o -1
  const [drawer, setDrawer] = useState(false)

  // Cierra el menú de celular al cambiar de página
  useEffect(() => { setDrawer(false) }, [pathname])
  useEffect(() => {
    if (!drawer) return
    const onKey = (e) => e.key === 'Escape' && setDrawer(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [drawer])
  const closeTimer = useRef(null)
  useEffect(() => { setOpen(-1) }, [pathname])

  // Abre el menú de la sección al pasar el cursor o al enfocarla con teclado
  const openAt = (i) => { clearTimeout(closeTimer.current); setOpen(i) }
  const closeSoon = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setOpen(-1), 160) }

  return (
    <div className="topfix">
      <a className="skip-link" href="#main">Saltar al contenido</a>

      <div className="util">
        <div className="container">
          <div className="util-info">
            <span className="hours"><Icon name="clock" />Atención lun a sáb · 8:00 a 20:00</span>
            <span><Icon name="help" /><Link to="/#avisos">Centro de ayuda</Link></span>
          </div>
          <div className="util-actions">
            <button type="button" onClick={a11y.nextSize} aria-pressed={a11y.sizeIsLarge} aria-label={`Tamaño de texto: ${a11y.sizeLabel}. Cambiar`}>
              <Icon name="text" /><span className="lbl">Texto</span> {a11y.sizeLabel}
            </button>
            <button type="button" onClick={a11y.toggleContrast} aria-pressed={a11y.contrast} aria-label="Alto contraste">
              <Icon name="contrast" /><span className="lbl">Alto contraste</span>
            </button>
            <button type="button" onClick={toggleTheme} aria-pressed={isDark} aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}>
              <Icon name={isDark ? 'sun' : 'moon'} /><span className="lbl">{isDark ? 'Día' : 'Noche'}</span>
            </button>
            <FlagBadge />
            <label htmlFor="idioma" className="sr-only">Idioma</label>
            <select id="idioma" defaultValue="Español">
              {IDIOMAS.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>
        </div>
      </div>

      <header className="site-header" onKeyDown={(e) => e.key === 'Escape' && setOpen(-1)}>
        <div className="container">
          <Link to="/" className="brand" aria-label="SIS, inicio">
            <LogoMark />
            <span><b>SIS</b><small>Sistema de Identidad Simulado</small></span>
          </Link>

          <nav className="main-nav" aria-label="Principal">
            {MENU.map((sec, i) => {
              const activo = sec.match.includes(pathname)
              return (
                <div
                  className={`nav-item${open === i ? ' open' : ''}`} key={sec.label}
                  onMouseEnter={() => openAt(i)} onMouseLeave={closeSoon}
                  onFocus={() => openAt(i)}
                  onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) closeSoon() }}
                >
                  <Link to={sec.to} className={activo ? 'active' : undefined} aria-current={activo ? 'page' : undefined} aria-haspopup="true" aria-expanded={open === i}>
                    {sec.label}<Icon name="chevronDown" />
                  </Link>
                  <div className="dropdown">
                    <ul>
                      {sec.items.map((it) => (
                        <li key={it.label}><Link to={it.to} onClick={() => setOpen(-1)}><b>{it.label}</b><small>{it.nota}</small></Link></li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </nav>

          <div className="clock">
            <b>Hora del centro de México</b>
            <time dateTime={clock.iso}>{clock.texto}</time>
          </div>

          <button
            type="button" className="menu-btn" onClick={() => setDrawer((d) => !d)}
            aria-expanded={drawer} aria-controls="menu-movil" aria-label={drawer ? 'Cerrar menú' : 'Abrir menú'}
          >
            <Icon name={drawer ? 'close' : 'menu'} /><span>Menú</span>
          </button>
        </div>

        {/* Menú de celular: todas las secciones con sus subsecciones */}
        <nav id="menu-movil" className={`drawer${drawer ? ' open' : ''}`} aria-label="Menú" hidden={!drawer}>
          <div className="container drawer-grid">
            {MENU.map((sec) => (
              <div key={sec.label} className="drawer-sec">
                <Link to={sec.to} className={`drawer-title${sec.match.includes(pathname) ? ' active' : ''}`}>
                  {sec.label}<Icon name="chevronRight" />
                </Link>
                <ul>
                  {sec.items.map((it) => <li key={it.label}><Link to={it.to} onClick={() => setDrawer(false)}>{it.label}</Link></li>)}
                </ul>
              </div>
            ))}
            <div className="drawer-foot">
              <span><Icon name="clock" />Atención lun a sáb · 8:00 a 20:00</span>
              <Link to="/login" className="btn btn-primary">Acceso operativo</Link>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
