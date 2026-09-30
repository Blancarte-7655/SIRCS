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
    { label: 'Guía del trámite', to: '/' },
    { label: '¿Quién debe registrarse?', to: '/' },
    { label: 'Cómo es el registro', to: '/#pasos' },
    { label: 'Asistente de trámite', to: '/#asistente' },
  ] },
  { label: 'Registro', to: '/registro', match: ['/registro'], items: [
    { label: 'Nuevo registro', to: '/registro' },
    { label: 'Agendar cita en módulo', to: '/registro' },
    { label: 'Requisitos y documentos', to: '/' },
  ] },
  { label: 'Consulta', to: '/credencial', match: ['/credencial'], items: [
    { label: 'Consultar y corregir', to: '/#consulta' },
    { label: 'Mi credencial', to: '/credencial' },
  ] },
  { label: 'Avisos', to: '/#avisos', match: [], items: [
    { label: 'Avisos', to: '/#avisos' },
    { label: 'Preguntas frecuentes', to: '/#avisos' },
    { label: 'Módulos de atención', to: '/' },
  ] },
]

const IDIOMAS = ['Español', 'English', 'Náhuatl', 'Wixárika', 'Maya']

export default function TopBar() {
  const a11y = useAccessibility()
  const clock = useClock()
  const { isDark, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const [mega, setMega] = useState(false)
  const [megaHeight, setMegaHeight] = useState(210)
  const [drawer, setDrawer] = useState(false)

  // Cierra el menú de celular al cambiar de página
  useEffect(() => { setDrawer(false) }, [pathname])
  useEffect(() => {
    if (!drawer) return
    const onKey = (e) => e.key === 'Escape' && setDrawer(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [drawer])
  const navRef = useRef(null)
  const closeTimer = useRef(null)

  function openMega() {
    clearTimeout(closeTimer.current)
    // Mide la columna más alta para que el fondo blanco las cubra todas
    const subs = navRef.current?.querySelectorAll('.submenu') ?? []
    let h = 0
    subs.forEach((ul) => {
      ul.style.display = 'grid'
      h = Math.max(h, ul.offsetHeight)
      ul.style.display = ''
    })
    if (h) setMegaHeight(h)
    setMega(true)
  }
  function closeMega() {
    closeTimer.current = setTimeout(() => setMega(false), 120)
  }

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

      <header
        className={`site-header${mega ? ' mega-open' : ''}`}
        style={{ '--mega-h': `${megaHeight}px` }}
        onMouseLeave={closeMega}
        onKeyDown={(e) => e.key === 'Escape' && setMega(false)}
      >
        <div className="container">
          <Link to="/" className="brand" aria-label="SIS, inicio">
            <LogoMark />
            <span><b>SIS</b><small>Sistema de Identidad Simulado</small></span>
          </Link>

          <nav
            className="main-nav"
            aria-label="Principal"
            ref={navRef}
            onMouseEnter={openMega}
            onFocus={openMega}
            onBlur={(e) => { if (!navRef.current.contains(e.relatedTarget)) closeMega() }}
          >
            {MENU.map((sec) => (
              <div className="nav-item" key={sec.label}>
                <Link
                  to={sec.to}
                  className={sec.match.includes(pathname) ? 'active' : undefined}
                  aria-current={sec.match.includes(pathname) ? 'page' : undefined}
                >
                  {sec.label}
                </Link>
                <ul className="submenu">
                  {sec.items.map((it) => (
                    <li key={it.label}><Link to={it.to} onClick={() => setMega(false)}>{it.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
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
        <div className="mega-bg" aria-hidden="true" />

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
