// Detalles de identidad: bandera en recuadro, numeración maya y greca escalonada.

// Bandera en recuadro, SIN escudo (su uso está reservado a documentos oficiales).
export function FlagBadge({ className = '', title = 'Bandera de México' }) {
  return (
    <svg className={`flag-badge ${className}`} viewBox="0 0 30 20" role="img" aria-label={title}>
      <rect width="30" height="20" rx="3" fill="#FFFFFF" />
      <rect width="10" height="20" rx="3" fill="#0B7A55" />
      <rect x="6" width="4" height="20" fill="#0B7A55" />
      <rect x="20" width="10" height="20" rx="3" fill="#C62833" />
      <rect x="20" width="4" height="20" fill="#C62833" />
      <rect x=".5" y=".5" width="29" height="19" rx="2.5" fill="none" stroke="rgba(0,0,0,.18)" />
    </svg>
  )
}

// Numeral maya: punto = 1, barra = 5 (sirve del 1 al 19)
export function MayaNumber({ n, className = '' }) {
  const barras = Math.floor(n / 5)
  const puntos = n % 5
  const h = 4 + barras * 5 + (puntos ? 5 : 0)
  return (
    <svg className={`maya-num ${className}`} viewBox={`0 0 16 ${h}`} role="img" aria-label={`${n}`}>
      {puntos > 0 && Array.from({ length: puntos }, (_, i) => {
        const w = puntos * 3.9
        return <circle key={i} cx={8 - w / 2 + 1.95 + i * 3.9} cy="3" r="1.75" fill="currentColor" />
      })}
      {Array.from({ length: barras }, (_, i) => (
        <rect key={i} x="1" y={(puntos ? 6 : 1) + i * 5} width="14" height="3.2" rx="1.6" fill="currentColor" />
      ))}
    </svg>
  )
}

// Franja de greca escalonada (se colorea con CSS: .greca { background: color })
export function Greca({ className = '' }) {
  return <div className={`greca ${className}`} aria-hidden="true" />
}
