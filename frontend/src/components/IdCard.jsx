import { useEffect, useRef } from 'react'
import { Greca } from './Maya.jsx'

const PERSONA = (
  <svg viewBox="0 0 60 70" aria-hidden="true"><circle cx="30" cy="24" r="13" /><path d="M4 70c2-16 13-24 26-24s24 8 26 24z" /></svg>
)
const MICROTEXTO = 'SIRCS · SISTEMA DE REGISTRO CIUDADANO · '.repeat(4)
const NFC = (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 7.5a6.5 6.5 0 010 9M12 5a10 10 0 010 14M15.5 3a13 13 0 010 18M5 10a2.5 2.5 0 010 4" /></svg>
)

// Trama de fondo: líneas onduladas y cuadros escalonados (pirámide vista desde arriba)
function drawPattern(canvas) {
  const w = canvas.clientWidth || 480
  const h = canvas.clientHeight || 300
  const dpr = 2
  canvas.width = w * dpr
  canvas.height = h * dpr
  const g = canvas.getContext('2d')
  g.scale(dpr, dpr)
  g.strokeStyle = 'rgba(31,111,139,.35)'
  g.lineWidth = 0.5
  for (let k = 0; k < 14; k++) {
    g.beginPath()
    for (let x = 0; x <= w; x += 4) {
      const y = h * 0.78 + Math.sin(x / 38 + k * 0.35) * (14 + k * 2) + Math.cos(x / 91 + k) * 8 - k * 7
      x ? g.lineTo(x, y) : g.moveTo(x, y)
    }
    g.stroke()
  }
  const cx = w * 0.86
  const cy = h * 0.62
  for (let r = 8; r < 100; r += 8) g.strokeRect(cx - r, cy - r * 0.8, r * 2, r * 1.6)
}

// QR DECORATIVO: no codifica nada. En la versión real se genera con una librería de QR
// que apunte a la consulta de vigencia del propio SIRCS.
function drawFakeQr(canvas) {
  const n = 25
  const x = canvas.getContext('2d')
  let seed = 20260928
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
  const ink = '#0F3B4A'
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

// Inclinación 3D y holograma que siguen al puntero
function useTilt(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      el.style.setProperty('--mx', `${x * 100}%`)
      el.style.setProperty('--my', `${y * 100}%`)
      el.style.setProperty('--sx', `${100 - x * 100}%`)
      if (!reduce) {
        el.style.setProperty('--ry', `${(x - 0.5) * 14}deg`)
        el.style.setProperty('--rx', `${(0.5 - y) * 10}deg`)
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
  useTilt(ref)
  useEffect(() => {
    const c = patternRef.current
    if (!c) return
    drawPattern(c)
    const onResize = () => drawPattern(c)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
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
  return (
    <CardShell
      label={`Anverso de la credencial de ${data.nombres} ${data.apellidos}`}
      band={<>
        <div className="c-brand"><b>SIRCS</b><small>Identidad digital</small></div>
        <Mexico extra={<span className="c-nfc">{NFC}</span>} />
      </>}
    >
      <div className="c-body">
        <div className="c-photo">{PERSONA}</div>
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
        <div className="c-ghost" aria-hidden="true">{PERSONA}</div>
      </div>
    </CardShell>
  )
}

export function IdCardBack({ data }) {
  const qrRef = useRef(null)
  useEffect(() => { if (qrRef.current) drawFakeQr(qrRef.current) }, [])
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
          <span className="c-sign">{data.firma}</span>
        </div>
      </div>
    </CardShell>
  )
}
