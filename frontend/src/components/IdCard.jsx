import { useEffect, useRef } from 'react'

const PERSONA = (
  <svg viewBox="0 0 60 70" aria-hidden="true"><circle cx="30" cy="24" r="13" /><path d="M4 70c2-16 13-24 26-24s24 8 26 24z" /></svg>
)
const MICROTEXTO = 'SIRCS · SIMULACIÓN ACADÉMICA · SIN VALIDEZ OFICIAL · '.repeat(4)

// Trama decorativa de líneas onduladas y elipses (tipo guilloché)
function drawPattern(canvas) {
  const w = canvas.clientWidth || 480
  const h = canvas.clientHeight || 300
  const dpr = 2
  canvas.width = w * dpr
  canvas.height = h * dpr
  const g = canvas.getContext('2d')
  g.scale(dpr, dpr)
  g.strokeStyle = 'rgba(255,255,255,.55)'
  g.lineWidth = 0.5
  for (let k = 0; k < 18; k++) {
    g.beginPath()
    for (let x = 0; x <= w; x += 4) {
      const y = h * 0.55 + Math.sin(x / 38 + k * 0.35) * (18 + k * 2) + Math.cos(x / 91 + k) * 10 - k * 6
      x ? g.lineTo(x, y) : g.moveTo(x, y)
    }
    g.stroke()
  }
  const cx = w * 0.86
  const cy = h * 0.2
  for (let r = 6; r < 90; r += 7) {
    g.beginPath()
    g.ellipse(cx, cy, r, r * 0.62, r / 40, 0, Math.PI * 2)
    g.stroke()
  }
}

// QR DECORATIVO: no codifica nada. En la versión real se genera con una librería de QR
// que apunte a la consulta de vigencia del propio SIRCS.
function drawFakeQr(canvas) {
  const n = 25
  const x = canvas.getContext('2d')
  let seed = 20260928
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
  x.fillStyle = '#fff'
  x.fillRect(0, 0, n, n)
  x.fillStyle = '#062117'
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (rnd() > 0.52) x.fillRect(i, j, 1, 1)
  ;[[0, 0], [n - 7, 0], [0, n - 7]].forEach(([px, py]) => {
    x.fillStyle = '#fff'; x.fillRect(px - 1, py - 1, 9, 9)
    x.fillStyle = '#062117'; x.fillRect(px, py, 7, 7)
    x.fillStyle = '#fff'; x.fillRect(px + 1, py + 1, 5, 5)
    x.fillStyle = '#062117'; x.fillRect(px + 2, py + 2, 3, 3)
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

function CardShell({ label, children }) {
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
      <div className="holo" />
      <div className="shine" />
      <div className="tri" />
      <div className="inner">{children}</div>
      <div className="c-watermark" aria-hidden="true"><span>MUESTRA</span></div>
    </div>
  )
}

export function IdCardFront({ data }) {
  return (
    <CardShell label={`Anverso de la credencial simulada de ${data.nombres} ${data.apellidos}`}>
      <div className="c-top">
        <div className="c-brand">
          <span className="c-seal">SI</span>
          <div><b>SIRCS</b><small>Identidad digital simulada</small></div>
        </div>
        <span className="c-nfc">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 7.5a6.5 6.5 0 010 9M12 5a10 10 0 010 14M15.5 3a13 13 0 010 18M5 10a2.5 2.5 0 010 4" /></svg>
          NFC
        </span>
      </div>
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
      <div className="c-micro" aria-hidden="true">{MICROTEXTO}</div>
    </CardShell>
  )
}

export function IdCardBack({ data }) {
  const qrRef = useRef(null)
  useEffect(() => { if (qrRef.current) drawFakeQr(qrRef.current) }, [])
  return (
    <CardShell label="Reverso de la credencial simulada con código QR de verificación">
      <div className="c-top">
        <div className="c-brand"><div><b>Verificación</b><small>Escanea para consultar vigencia</small></div></div>
        <span className="c-chip" aria-hidden="true" />
      </div>
      <div className="c-back">
        <div className="c-qr"><canvas ref={qrRef} width="25" height="25" aria-hidden="true" /></div>
        <div className="c-text">
          <span className="c-label">Clave ficticia</span>
          <span className="mono">{data.clave}</span>
          <p>{data.domicilio}<br />Emitida en {data.emision}</p>
          <span className="c-sign">{data.firma}</span>
        </div>
      </div>
      <p className="c-disclaimer">Simulación académica · Sin validez oficial</p>
    </CardShell>
  )
}
