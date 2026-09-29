import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { FlagBadge, Greca } from './Maya.jsx'
import { sitiosRelacionados } from '../data/mock.js'

export default function Footer() {
  const track = useRef(null)
  const scroll = (dir) => track.current?.scrollBy({ left: dir * 200, behavior: 'smooth' })

  return (
    <>
      <Greca className="footer-greca" />
      <section className="related" aria-label="Sitios relacionados">
        <div className="container">
          <button className="arrow-btn" type="button" onClick={() => scroll(-1)} aria-label="Sitios anteriores"><Icon name="chevronLeft" /></button>
          <div className="related-track" ref={track}>
            {sitiosRelacionados.map((s) => (
              <Link key={s.texto} to="/"><Icon name={s.icon} />{s.texto}</Link>
            ))}
          </div>
          <button className="arrow-btn" type="button" onClick={() => scroll(1)} aria-label="Sitios siguientes"><Icon name="chevronRight" /></button>
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
            </ul>
            <div className="footer-selects">
              <label htmlFor="f-docs" className="sr-only">Documentación</label>
              <select id="f-docs" defaultValue=""><option value="" disabled>Documentación</option><option>Plan maestro</option><option>Análisis legal</option><option>DSD / FEL</option></select>
              <label htmlFor="f-sitios" className="sr-only">Sitios del proyecto</label>
              <select id="f-sitios" defaultValue=""><option value="" disabled>Sitios del proyecto</option><option>Portal ciudadano</option><option>Panel operativo</option></select>
              <label htmlFor="f-equipo" className="sr-only">Equipo</label>
              <select id="f-equipo" defaultValue=""><option value="" disabled>Equipo</option><option>Equipo INE · Tlaquepaque</option></select>
            </div>
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
