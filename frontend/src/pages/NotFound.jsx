import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { Greca } from '../components/Maya.jsx'

// Página 404: cualquier ruta que no exista
export default function NotFound() {
  return (
    <div className="container page">
      <div className="panel-box notfound">
        <svg className="nf-art" viewBox="0 0 240 150" aria-hidden="true">
          <circle cx="120" cy="80" r="58" className="nf-sun" />
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} x={30 + i * 15} y={140 - (i + 1) * 16} width={180 - i * 30} height="16.5" className={i % 2 ? 'nf-b' : 'nf-a'} />
          ))}
          <rect x="108" y="44" width="24" height="96" className="nf-stair" />
          <rect x="100" y="28" width="40" height="18" className="nf-a" />
          <rect x="96" y="24" width="48" height="5" className="nf-b" />
        </svg>
        <p className="nf-code">404</p>
        <h1>Esta página se perdió entre las pirámides</h1>
        <p>La dirección que buscas no existe o cambió de lugar.</p>
        <div className="done-actions">
          <Link className="btn btn-primary" to="/"><Icon name="home" />Ir al inicio</Link>
          <Link className="btn btn-outline" to="/#avisos"><Icon name="help" />Centro de ayuda</Link>
        </div>
        <Greca className="nf-greca" />
      </div>
    </div>
  )
}
