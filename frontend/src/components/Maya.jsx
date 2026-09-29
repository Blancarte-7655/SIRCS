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

// Silueta de pirámide maya escalonada con templo y escalinata central
const NIVELES = 9
export function Pyramid() {
  const base = { x1: 300, x2: 780, y: 262, h: 15, paso: 22 }
  const niveles = Array.from({ length: NIVELES }, (_, i) => ({
    x: base.x1 + i * base.paso,
    w: base.x2 - base.x1 - i * base.paso * 2,
    y: base.y - (i + 1) * base.h,
  }))
  const top = niveles[NIVELES - 1]
  return (
    <svg className="pyramid" viewBox="0 0 800 262" aria-hidden="true" focusable="false">
      <defs>
        <mask id="escalinata">
          <rect width="800" height="262" fill="#fff" />
          {Array.from({ length: 27 }, (_, i) => (
            <rect key={i} x="516" y={262 - (i + 1) * 5} width="48" height="1.6" fill="#000" />
          ))}
          <rect x="522" y={top.y - 34} width="36" height="26" rx="2" fill="#000" />
        </mask>
      </defs>
      <g className="back" fill="currentColor">
        <path d="M40 262V222h20v-12h20v-12h60v12h20v12h20v40Z" />
        <path d="M150 262V238h120v24Z" />
      </g>
      <g className="front" fill="currentColor" mask="url(#escalinata)">
        {niveles.map((n, i) => <rect key={i} x={n.x} y={n.y} width={n.w} height={base.h + 0.5} />)}
        <rect x="508" y={top.y} width="64" height={262 - top.y} opacity=".85" />
        <rect x="500" y={top.y - 44} width="80" height="44" />
        <rect x="494" y={top.y - 50} width="92" height="8" />
      </g>
    </svg>
  )
}
