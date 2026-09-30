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

// Sello de seguridad: glifo maya Kin (sol) en su cartucho, con reflejo holográfico.
function Seal({ className = '' }) {
  return (
    <span className={`c-seal foil ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <rect x="8" y="8" width="84" height="84" rx="24" className="s-line" />
        <rect x="16" y="16" width="68" height="68" rx="18" className="s-thin" />
        <circle cx="50" cy="33" r="10" className="s-line" />
        <circle cx="67" cy="50" r="10" className="s-line" />
        <circle cx="50" cy="67" r="10" className="s-line" />
        <circle cx="33" cy="50" r="10" className="s-line" />
        <circle cx="50" cy="50" r="5.5" className="s-fill" />
        {[[26, 26], [74, 26], [26, 74], [74, 74]].map(([x, y]) => <circle key={x + '-' + y} cx={x} cy={y} r="2.6" className="s-fill" />)}
      </svg>
    </span>
  )
}

// Movimiento de la tarjeta:
// - con mouse: se inclina siguiendo el cursor y el brillo holográfico se desplaza;
// - en celular: se inclina suavemente según su posición al hacer scroll.
// Todo se desactiva con "reducir movimiento".
function useTilt(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const set = (k, v) => el.style.setProperty(k, v)
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
      const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
      set('--mx', `${x * 100}%`)
      set('--my', `${y * 100}%`)
      if (!reduce && e.pointerType === 'mouse') {
        el.classList.add('tilting')
        set('--ry', `${(x - 0.5) * 12}deg`)
        set('--rx', `${(0.5 - y) * 9}deg`)
      }
    }
    const leave = () => {
      el.classList.remove('tilting')
      set('--rx', '0deg')
      set('--ry', '0deg')
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)

    let frame = 0
    const touch = window.matchMedia?.('(hover: none)').matches
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const r = el.getBoundingClientRect()
        const t = Math.max(-1, Math.min(1, (r.top + r.height / 2 - window.innerHeight / 2) / (window.innerHeight / 2)))
        set('--rx', `${t * 7}deg`)
        set('--ry', `${-t * 4}deg`)
      })
    }
    if (touch && !reduce) { window.addEventListener('scroll', onScroll, { passive: true }); onScroll() }

    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
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
      <div className="c-strip foil" aria-hidden="true" />
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
          <div className="c-ghost foil">{PERSONA}</div>
        </div>
      </div>
    </CardShell>
  )
}

export function IdCardBack({ data }) {
  const qrRef = useRef(null)
  const barRef = useRef(null)
  const qr2Ref = useRef(null)
  useEffect(() => {
    if (qrRef.current) drawFakeQr(qrRef.current)
    if (qr2Ref.current) drawFakeQr(qr2Ref.current, 1452, '#1A1C1E')
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
        <dl className="c-grid">
          <div className="span-2"><dt>Clave de registro</dt><dd>{data.clave}</dd></div>
          <div><dt>RFC</dt><dd>{data.rfc}</dd></div>
          <div className="span-2"><dt>Domicilio</dt><dd>{data.domicilio}</dd></div>
          <div><dt>C.P.</dt><dd>{data.cp}</dd></div>
          <div className="span-2"><dt>Municipio</dt><dd>{data.municipio}</dd></div>
          <div><dt>Estado</dt><dd>{data.estado}</dd></div>
          <div><dt>Distrito</dt><dd>{data.distrito}</dd></div>
          <div><dt>Sección</dt><dd>{data.seccion}</dd></div>
          <div><dt>Localidad</dt><dd>{data.localidad}</dd></div>
        </dl>
        <div className="c-back-foot">
          <div className="c-signed"><span className="c-sign">{data.firma}</span><small>Registro {data.registro} · {data.emision}</small></div>
          <canvas className="c-barcode" ref={barRef} aria-hidden="true" />
          <div className="c-qr-sm"><canvas ref={qr2Ref} width="25" height="25" aria-hidden="true" /></div>
          <Seal className="c-seal-back" />
        </div>
      </div>
    </CardShell>
  )
}
