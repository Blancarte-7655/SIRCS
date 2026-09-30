import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { Greca } from '../components/Maya.jsx'

// Página 404: cualquier ruta que no exista
export default function NotFound() {
  return (
    <div className="container page">
      <div className="panel-box notfound">
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
