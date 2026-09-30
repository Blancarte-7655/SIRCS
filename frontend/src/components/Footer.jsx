import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import LogoMark from './LogoMark.jsx'
import { FlagBadge, Greca } from './Maya.jsx'
import { sitiosRelacionados } from '../data/mock.js'

const TRAMITES = [
  { texto: 'Nuevo registro', to: '/registro' },
  { texto: 'Agendar cita en módulo', to: '/registro' },
  { texto: 'Consultar mi trámite', to: '/#consulta' },
  { texto: 'Mi credencial', to: '/credencial' },
]

// Pie institucional: marca, columnas de ligas y franja legal
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Link to="/" className="brand"><LogoMark /><span><b>SIS</b><small>Sistema de Identidad Simulado</small></span></Link>
          <p>Registro ciudadano en línea, consulta de trámite y credencial digital con verificación por código QR.</p>
          <p className="footer-team"><FlagBadge />Equipo INE · Tlaquepaque, Jalisco</p>
        </div>
        <nav className="footer-col" aria-label="Trámites">
          <h2>Trámites</h2>
          <ul>{TRAMITES.map((t) => <li key={t.texto}><Link to={t.to}>{t.texto}</Link></li>)}</ul>
        </nav>
        <nav className="footer-col" aria-label="Ayuda y consulta">
          <h2>Ayuda</h2>
          <ul>{sitiosRelacionados.slice(0, 3).map((s) => <li key={s.texto}><Link to="/#avisos">{s.texto}</Link></li>)}<li><Link to="/#avisos">Preguntas frecuentes</Link></li></ul>
        </nav>
        <nav className="footer-col" aria-label="Proyecto">
          <h2>Proyecto</h2>
          <ul>{sitiosRelacionados.slice(3).map((s) => <li key={s.texto}><Link to="/">{s.texto}</Link></li>)}<li><Link to="/login">Acceso operativo</Link></li></ul>
        </nav>
      </div>
      <div className="container"><Greca className="footer-greca" /></div>
      <div className="container footer-bottom">
        <ul className="footer-links">
          <li><Link to="/">Términos de uso</Link></li>
          <li><Link to="/">Aviso de privacidad</Link></li>
          <li><Link to="/">Contacto</Link></li>
          <li><Link to="/">Accesibilidad</Link></li>
        </ul>
        <p className="footer-copy">© 2026 SIS</p>
        <div className="social">
          <a href="#main" aria-label="Correo del equipo"><Icon name="mail" /></a>
          <a href="#main" aria-label="Videos del proyecto"><Icon name="play" /></a>
          <a href="#main" aria-label="Repositorio de código"><Icon name="code" /></a>
          <button className="to-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Volver arriba">
            <Icon name="chevronUp" />
          </button>
        </div>
      </div>
    </footer>
  )
}
