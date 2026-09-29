import Icon from './Icon.jsx'

// Bloque gris animado mientras llegan los datos
export function Skeleton({ w = '100%', h = 14, r = 6, className = '' }) {
  return <span className={`skeleton ${className}`} style={{ width: w, height: h, borderRadius: r }} aria-hidden="true" />
}

// Cuando no hay resultados
export function EmptyState({ icon = 'search', title, children, action }) {
  return (
    <div className="state" role="status">
      <span className="state-icon"><Icon name={icon} /></span>
      <b>{title}</b>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}

// Cuando algo falla (p. ej. sin conexión)
export function ErrorState({ title = 'No pudimos cargar la información', children = 'Revisa tu conexión e inténtalo de nuevo.', onRetry }) {
  return (
    <div className="state state-error" role="alert">
      <span className="state-icon"><Icon name="alert" /></span>
      <b>{title}</b>
      <p>{children}</p>
      {onRetry && <button className="btn btn-outline btn-sm" type="button" onClick={onRetry}>Reintentar</button>}
    </div>
  )
}
