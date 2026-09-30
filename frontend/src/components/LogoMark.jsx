// Marca gráfica de SIS: sello de línea fina con greca escalonada y un punto tezontle.
export default function LogoMark({ className = '' }) {
  return (
    <svg className={`logomark ${className}`} viewBox="0 0 40 40" aria-hidden="true">
      <rect className="lm-frame" x=".75" y=".75" width="38.5" height="38.5" rx="3" />
      <path className="lm-fret" d="M9 31V9h16v14h-8v-6h4M25 31h6V25" />
      <rect className="lm-dot" x="28" y="7" width="5" height="5" />
    </svg>
  )
}
