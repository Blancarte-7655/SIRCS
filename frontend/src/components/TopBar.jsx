import { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Icon from './Icon.jsx'
import useAccessibility from '../hooks/useAccessibility.js'
import useClock from '../hooks/useClock.js'

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
  const { pathname } = useLocation()
  const [mega, setMega] = useState(false)
  const [megaHeight, setMegaHeight] = useState(210)
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
          <span className="demo-flag">Sitio de simulación académica · Sin validez oficial</span>
          <div className="util-actions">
            <button type="button" onClick={a11y.nextSize} aria-pressed={a11y.sizeIsLarge} aria-label={`Tamaño de texto: ${a11y.sizeLabel}. Cambiar`}>
              <Icon name="text" />Texto {a11y.sizeLabel}
            </button>
            <button type="button" onClick={a11y.toggleContrast} aria-pressed={a11y.contrast}>
              <Icon name="contrast" />Alto contraste
            </button>
            <span className="tricolor" aria-hidden="true"><i /><i /><i /></span>
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
          <Link to="/" className="brand" aria-label="SIRCS, inicio">
            <span className="seal">SI</span>
            <span><b>SIRCS</b><small>Sistema de Registro Ciudadano Simulado</small></span>
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
        </div>
        <div className="mega-bg" aria-hidden="true" />
      </header>
    </div>
  )
}
