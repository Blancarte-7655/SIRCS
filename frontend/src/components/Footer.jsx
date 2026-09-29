import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { FlagBadge, Greca } from './Maya.jsx'
import { sitiosRelacionados } from '../data/mock.js'

export default function Footer() {
  return (
    <>
      <Greca className="footer-greca" />
      <section className="related" aria-label="Sitios relacionados">
        <div className="container related-grid">
          {sitiosRelacionados.map((s) => (
            <Link key={s.texto} to="/"><Icon name={s.icon} />{s.texto}</Link>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <button className="to-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Volver arriba">
          <Icon name="chevronUp" />
        </button>
        <div className="container">
          <div className="footer-row">
            <ul className="footer-links">
              <li><Link to="/">Términos de uso</Link></li>
              <li><Link to="/" className="privacy">Aviso de privacidad</Link></li>
              <li><Link to="/" className="contact">Contacto</Link></li>
              <li><Link to="/">Accesibilidad</Link></li>
            </ul>
          </div>
          <div className="footer-row">
            <Link to="/" className="brand"><span><b>SIRCS</b><small>Proyecto académico</small></span></Link>
            <p className="footer-copy"><FlagBadge />© 2026 SIRCS · Equipo INE · Tlaquepaque</p>
            <div className="social">
              <a href="#main" aria-label="Correo del equipo"><Icon name="mail" /></a>
              <a href="#main" aria-label="Videos del proyecto"><Icon name="play" /></a>
              <a href="#main" aria-label="Repositorio de código"><Icon name="code" /></a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
