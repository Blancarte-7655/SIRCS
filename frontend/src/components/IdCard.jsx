import { useEffect, useId, useRef } from 'react'
import { Greca } from './Maya.jsx'
import useCardColor from '../hooks/useCardColor.js'

const PERSONA = (
  <svg viewBox="0 0 60 70" aria-hidden="true"><circle cx="30" cy="24" r="13" /><path d="M4 70c2-16 13-24 26-24s24 8 26 24z" /></svg>
)
const MICROTEXTO = 'SIS · SISTEMA DE IDENTIDAD SIMULADO · '.repeat(4)
const NFC = (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 7.5a6.5 6.5 0 010 9M12 5a10 10 0 010 14M15.5 3a13 13 0 010 18M5 10a2.5 2.5 0 010 4" /></svg>
)

// Trama guilloche (papel de seguridad) en el color de la franja elegida
function css(el, name, fallback) {
  return getComputedStyle(el).getPropertyValue(name).trim() || fallback
}

function drawPattern(canvas) {
  const w = canvas.clientWidth || 480
  const h = canvas.clientHeight || 300
  const dpr = 2
  canvas.width = w * dpr
  canvas.height = h * dpr
  const g = canvas.getContext('2d')
  g.scale(dpr, dpr)
  const tint = css(canvas, '--card-a', '#36312B')
  g.lineWidth = 0.5
  // Guilloche: óvalos ondulados concéntricos, como en papel de seguridad
  g.strokeStyle = tint
  g.globalAlpha = 0.22
  const cx = w * 0.78
  const cy = h * 0.55
  for (let k = 0; k < 18; k++) {
    g.beginPath()
    for (let t = 0; t <= Math.PI * 2 + 0.01; t += 0.02) {
      const r = 30 + k * 6 + Math.sin(t * 12 + k * 0.6) * 3
      const x = cx + Math.cos(t) * r * 1.5
      const y = cy + Math.sin(t) * r * 0.8
      t ? g.lineTo(x, y) : g.moveTo(x, y)
    }
    g.stroke()
  }
  g.globalAlpha = 0.08
  for (let y = 8; y < h; y += 3.2) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke() }
}

// QR DECORATIVO: no codifica nada. En la versión real se genera con una librería de QR
// que apunte a la consulta de vigencia del propio SIS.
function drawFakeQr(canvas, seed = 20260928, ink = '#0F3B4A') {
  const n = 25
  const x = canvas.getContext('2d')
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
  x.fillStyle = '#fff'
  x.fillRect(0, 0, n, n)
  x.fillStyle = ink
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (rnd() > 0.52) x.fillRect(i, j, 1, 1)
  ;[[0, 0], [n - 7, 0], [0, n - 7]].forEach(([px, py]) => {
    x.fillStyle = '#fff'; x.fillRect(px - 1, py - 1, 9, 9)
    x.fillStyle = ink; x.fillRect(px, py, 7, 7)
    x.fillStyle = '#fff'; x.fillRect(px + 1, py + 1, 5, 5)
    x.fillStyle = ink; x.fillRect(px + 2, py + 2, 3, 3)
  })
}

// Código de barras DECORATIVO (en la versión real: PDF417 con los datos firmados)
function drawBarcode(canvas) {
  const w = 240
  const h = 30
  canvas.width = w
  canvas.height = h
  const x = canvas.getContext('2d')
  let seed = 4817
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
  x.fillStyle = '#1A1C1E'
  for (let i = 4; i < w - 4;) {
    const bw = 1 + Math.floor(rnd() * 3)
    if (rnd() > 0.22) x.fillRect(i, 0, bw, h)
    i += bw + 1
  }
}

// Sello de seguridad: anillo con microtexto, rosetas finas y pirámide escalonada al centro.
// Lleva un reflejo iridiscente (CSS) como los hologramas de los documentos reales.
function Seal({ className = '' }) {
  const id = useId().replace(/:/g, '')
  return (
    <span className={`c-seal ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <defs><path id={`sr-${id}`} d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1 -76 0" /></defs>
        <circle cx="50" cy="50" r="47" className="s-ring" />
        <circle cx="50" cy="50" r="30" className="s-ring" />
        <text className="s-text"><textPath href={`#sr-${id}`}>SIS · IDENTIDAD VERIFICADA · MÉXICO · SIS · IDENTIDAD VERIFICADA · MÉXICO ·</textPath></text>
        {Array.from({ length: 24 }, (_, i) => (
          <ellipse key={i} cx="50" cy="50" rx="27" ry="9" className="s-rose" transform={`rotate(${i * 7.5} 50 50)`} />
        ))}
        <path className="s-pyr" d="M31 64h38v-5h-5v-5h-5v-5h-5v-5h-8v5h-5v5h-5v5h-5z" />
        <rect className="s-pyr" x="46" y="38" width="8" height="6" />
      </svg>
    </span>
  )
}

// Inclinación discreta y holograma que siguen al puntero (solo con mouse; sin movimiento automático)
function useTilt(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const move = (e) => {
      if (e.pointerType !== 'mouse') return
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      el.style.setProperty('--mx', `${x * 100}%`)
      el.style.setProperty('--my', `${y * 100}%`)
      el.style.setProperty('--sx', `${100 - x * 100}%`)
      if (!reduce) {
        el.style.setProperty('--ry', `${(x - 0.5) * 6}deg`)
        el.style.setProperty('--rx', `${(0.5 - y) * 4}deg`)
      }
    }
    const leave = () => {
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)

    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [ref])
}

function CardShell({ label, band, children }) {
  const ref = useRef(null)
  const patternRef = useRef(null)
  const { color } = useCardColor()
  useTilt(ref)
  useEffect(() => {
    const c = patternRef.current
    if (!c) return
    // Espera un cuadro para que el color elegido ya esté aplicado
    const frame = requestAnimationFrame(() => drawPattern(c))
    const onResize = () => drawPattern(c)
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', onResize) }
  }, [color.id])
  return (
    <div className="id-card" ref={ref} role="img" aria-label={label}>
      <canvas className="pattern" ref={patternRef} aria-hidden="true" />
      <div className="glow" />
      <div className="inner">
        <div className="c-band">{band}<Greca className="c-band-greca" /></div>
        {children}
        <div className="c-foot"><Greca className="c-greca" /><div className="c-micro" aria-hidden="true">{MICROTEXTO}</div></div>
      </div>
      <div className="holo" />
      <div className="shine" />
      <div className="c-watermark" aria-hidden="true"><span>MUESTRA</span></div>
    </div>
  )
}

function Mexico({ extra }) {
  return (
    <div className="c-right">
      <span className="c-country">MÉXICO</span>
      {extra}
    </div>
  )
}

export function IdCardFront({ data }) {
  const miniQrRef = useRef(null)
  useEffect(() => { if (miniQrRef.current) drawFakeQr(miniQrRef.current, 4817, '#1A1C1E') }, [])
  return (
    <CardShell
      label={`Anverso de la credencial de ${data.nombres} ${data.apellidos}`}
      band={<>
        <div className="c-brand"><b>SIS</b><small>Identidad digital</small></div>
        <Mexico extra={<span className="c-nfc">{NFC}</span>} />
      </>}
    >
      <div className="c-body">
        <div className="c-photo-wrap"><div className="c-photo">{PERSONA}</div><Seal className="c-seal-front" /></div>
        <div className="c-data">
          <div className="c-name">
            <span className="c-label">Nombre</span>
            <b>{data.nombres}</b>
            <span>{data.apellidos}</span>
          </div>
          <dl>
            <div><dt>Folio</dt><dd>{data.folio}</dd></div>
            <div><dt>Nacimiento</dt><dd>{data.nacimiento}</dd></div>
            <div><dt>Sexo</dt><dd>{data.sexo}</dd></div>
            <div><dt>Vigencia</dt><dd className="valid">{data.vigencia}</dd></div>
          </dl>
        </div>
        <div className="c-side" aria-hidden="true">
          <div className="c-mini-qr"><canvas ref={miniQrRef} width="25" height="25" /></div>
          <div className="c-ghost">{PERSONA}</div>
        </div>
      </div>
    </CardShell>
  )
}

export function IdCardBack({ data }) {
  const qrRef = useRef(null)
  const barRef = useRef(null)
  useEffect(() => {
    if (qrRef.current) drawFakeQr(qrRef.current)
    if (barRef.current) drawBarcode(barRef.current)
  }, [])
  return (
    <CardShell
      label="Reverso de la credencial con código QR de verificación"
      band={<>
        <div className="c-brand"><b>Verificación</b><small>Escanea para consultar vigencia</small></div>
        <Mexico extra={<span className="c-chip" aria-hidden="true" />} />
      </>}
    >
      <div className="c-body c-back">
        <div className="c-qr"><canvas ref={qrRef} width="25" height="25" aria-hidden="true" /></div>
        <div className="c-text">
          <span className="c-label">Clave de registro</span>
          <span className="mono">{data.clave}</span>
          <p>{data.domicilio}<br />Emitida en {data.emision}</p>
          <div className="c-sign-row"><span className="c-sign">{data.firma}</span><Seal className="c-seal-back" /></div>
          <canvas className="c-barcode" ref={barRef} aria-hidden="true" />
        </div>
      </div>
    </CardShell>
  )
}
