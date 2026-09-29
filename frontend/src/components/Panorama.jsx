// Ilustración panorámica de la portada (fondo), dibujada en SVG por capas.
// Elementos: sol, pirámide alta al fondo, pirámide de Kukulkán, Ángel de la Independencia,
// quetzal, agaves y nopal. Cada capa se mueve a su ritmo al hacer scroll (--k).
// Los tonos se logran con fill-opacity sobre un solo color (currentColor = tono piedra).

const G = 304 // línea del suelo

// ---------- Pirámide de Kukulkán ----------
function Kukulkan() {
  const niveles = Array.from({ length: 9 }, (_, i) => ({ i, x: 380 + i * 19, w: 440 - i * 38, y: G - (i + 1) * 17 }))
  const cima = niveles[8]
  const templo = { x: 556, w: 88, y: cima.y - 40 }
  return (
    <g className="p-main" mask="url(#pano-cortes)">
      {niveles.map((n) => (
        <g key={n.i}>
          <rect className="t-lit" x={n.x} y={n.y} width={600 - n.x} height="17.5" />
          <rect className="t-shade" x="600" y={n.y} width={n.x + n.w - 600} height="17.5" />
          <rect className="t-line" x={n.x} y={n.y} width={n.w} height="2.6" />
          {/* tableros con paneles hundidos */}
          {Array.from({ length: Math.floor((n.w - 16) / 22) }, (_, k) => n.x + 8 + k * 22)
            .filter((px) => px < 562 || px > 628)
            .map((px) => <rect key={px} className="t-panel" x={px} y={n.y + 6} width="11" height="7" rx="1" />)}
        </g>
      ))}
      {/* escalinata central con alfardas y cabezas de serpiente */}
      <rect className="t-stair" x="578" y={cima.y} width="44" height={G - cima.y} />
      <rect className="t-line" x="572" y={cima.y} width="6" height={G - cima.y} />
      <rect className="t-line" x="622" y={cima.y} width="6" height={G - cima.y} />
      <path className="t-line" d="M572 304 h-14 q-6 -1 -5 -6 q2 -4 8 -4 h11z" />
      <path className="t-line" d="M628 304 h14 q6 -1 5 -6 q-2 -4 -8 -4 h-11z" />
      {/* templo superior */}
      <rect className="t-lit" x={templo.x} y={templo.y} width="44" height="40" />
      <rect className="t-shade" x="600" y={templo.y} width="44" height="40" />
      <rect className="t-line" x={templo.x - 2} y={templo.y} width={templo.w + 4} height="9" />
      <rect className="t-line" x={templo.x - 6} y={templo.y - 6} width={templo.w + 12} height="6" />
    </g>
  )
}

// ---------- Pirámide alta al fondo (estilo Tikal) ----------
function Tikal() {
  return (
    <g className="p-far">
      {Array.from({ length: 6 }, (_, i) => {
        const x = 120 + i * 12, w = 170 - i * 24, y = G - (i + 1) * 22
        return (
          <g key={i}>
            <rect className="t-lit" x={x} y={y} width={205 - x} height="22.5" />
            <rect className="t-shade" x="205" y={y} width={x + w - 205} height="22.5" />
            <rect className="t-line" x={x} y={y} width={w} height="2.4" />
          </g>
        )
      })}
      <rect className="t-stair" x="197" y="172" width="16" height="132" />
      <rect className="t-lit" x="186" y="118" width="19" height="56" />
      <rect className="t-shade" x="205" y="118" width="19" height="56" />
      <rect className="t-line" x="180" y="108" width="50" height="10" />
      <rect className="t-line" x="192" y="92" width="26" height="16" />
    </g>
  )
}

// ---------- Ángel de la Independencia ----------
const alaIzq = [
  'M877 42 C866 35 856 25 849 14 C858 21 867 29 878 40Z',
  'M877 44 C864 39 852 32 845 24 C855 29 866 35 877 46Z',
  'M877 47 C866 46 856 42 849 37 C859 40 868 44 877 49Z',
]
const espejo = (d) => d.replace(/(-?\d+(\.\d+)?) (-?\d+(\.\d+)?)/g, (_, x, _a, y) => `${(1762 - Number(x)).toFixed(0)} ${y}`)

function Angel() {
  return (
    <g className="p-angel">
      {/* basamento */}
      <rect className="t-lit" x="822" y="290" width="58" height="14" />
      <rect className="t-shade" x="880" y="290" width="58" height="14" />
      <rect className="t-lit" x="834" y="278" width="46" height="12" />
      <rect className="t-shade" x="880" y="278" width="46" height="12" />
      <path className="t-line" d="M836 278 q1 -13 7 -16 q7 2 8 16z" />
      <path className="t-line" d="M924 278 q-1 -13 -7 -16 q-7 2 -8 16z" />
      {/* pedestal */}
      <rect className="t-lit" x="850" y="232" width="30" height="46" />
      <rect className="t-shade" x="880" y="232" width="30" height="46" />
      <rect className="t-line" x="846" y="240" width="68" height="4" />
      <rect className="t-line" x="846" y="268" width="68" height="4" />
      {/* fuste con estrías y anillos */}
      <path className="t-lit" d="M868 232 L872 86 H880 V232Z" />
      <path className="t-shade" d="M880 232 V86 H888 L892 232Z" />
      <rect className="t-flute" x="875" y="92" width="1.4" height="136" />
      <rect className="t-flute" x="883" y="92" width="1.4" height="136" />
      {[190, 150, 112].map((y) => <rect key={y} className="t-line" x="866" y={y} width="28" height="5" rx="1" />)}
      {/* capitel */}
      <path className="t-line" d="M868 86 H892 L900 76 H860Z" />
      <rect className="t-line" x="857" y="70" width="46" height="6" rx="1" />
      <circle className="t-line" cx="861" cy="80" r="3" />
      <circle className="t-line" cx="899" cy="80" r="3" />
      {/* Victoria alada */}
      <g className="p-victoria">
        <circle cx="881" cy="66" r="4" />
        <path d="M876 63 C874 54 875 46 878 40 H884 C887 46 888 54 886 63Z" />
        <path d="M873 64 Q881 57 889 64 L891 66 H871Z" />
        <circle cx="881" cy="33" r="4.2" />
        {alaIzq.map((d) => <path key={d} d={d} />)}
        {alaIzq.map((d) => <path key={`r${d}`} d={espejo(d)} />)}
        <path d="M884 38 L897 16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <circle cx="899" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M878 45 L871 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="869" cy="58" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="867" cy="61.5" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </g>
    </g>
  )
}

// ---------- Quetzal ----------
function Quetzal() {
  return (
    <g className="p-quetzal-fly">
      <g className="p-quetzal" transform="translate(1040 92) rotate(-8)">
        {/* plumas largas de la cola, con raquis */}
        <path className="q-tail" d="M16 2 C60 6 110 28 176 26 C118 20 68 0 18 -3Z" />
        <path className="q-tail" d="M14 5 C56 18 100 46 158 54 C104 40 64 16 16 1Z" />
        <path className="q-rib" d="M20 0 C70 7 120 24 172 26" />
        <path className="q-rib" d="M18 3 C62 18 104 42 154 53" />
        <path className="q-under" d="M10 4 C26 11 40 15 54 15 C40 8 26 4 10 0Z" />
        {/* cuerpo, pecho y cabeza con cresta */}
        <ellipse className="q-body" cx="0" cy="0" rx="20" ry="10" />
        <path className="q-back" d="M-14 -6 C-2 -12 12 -10 20 -2 C8 -6 -4 -6 -14 -6Z" />
        <path className="q-breast" d="M-17 2 Q-5 13 11 8 Q0 3 -17 2Z" />
        <circle className="q-body" cx="-20" cy="-4" r="8" />
        <path className="q-body" d="M-27 -9 C-26 -20 -17 -21 -13 -11 C-17 -15 -22 -15 -27 -9Z" />
        <circle className="q-eye" cx="-22.5" cy="-5.5" r="1.9" />
        <circle className="q-pupil" cx="-22.9" cy="-5.6" r="1" />
        <path className="q-beak" d="M-28 -4 L-36 -1 L-27 0.5Z" />
        {/* ala (aletea) */}
        <g className="q-wing">
          <path className="q-body" d="M-4 -6 C6 -34 22 -44 38 -47 C27 -34 19 -18 12 -4Z" />
          <path className="q-back" d="M2 -10 C10 -30 22 -38 34 -42 C24 -30 17 -18 10 -8Z" />
          <path className="q-rib" d="M4 -8 C12 -26 22 -36 34 -42" />
        </g>
      </g>
    </g>
  )
}

// ---------- Plantas ----------
function Agave({ x, s = 1 }) {
  const hojas = [-70, -48, -28, -10, 10, 28, 48, 70]
  return (
    <g transform={`translate(${x} ${G}) scale(${s})`}>
      {hojas.map((a) => {
        const l = 64 - Math.abs(a) * 0.35
        return (
          <g key={a} transform={`rotate(${a})`}>
            <path className="t-lit" d={`M-6 0 Q-4 ${-l * 0.6} 0 ${-l} V0Z`} />
            <path className="t-shade" d={`M6 0 Q4 ${-l * 0.6} 0 ${-l} V0Z`} />
            <path className="t-line" d={`M-1 ${-l + 1} L0 ${-l - 6} L1 ${-l + 1}Z`} />
          </g>
        )
      })}
    </g>
  )
}

function Nopal({ x }) {
  const pencas = [
    { cx: 0, cy: -32, rx: 19, ry: 32, r: 0 },
    { cx: -24, cy: -70, rx: 13, ry: 22, r: -25 },
    { cx: 22, cy: -76, rx: 12, ry: 21, r: 20 },
  ]
  return (
    <g transform={`translate(${x} ${G})`}>
      {pencas.map((p, i) => (
        <g key={i} transform={`rotate(${p.r} ${p.cx} ${p.cy})`}>
          <ellipse className="t-shade" cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} />
          <ellipse className="t-lit" cx={p.cx - p.rx * 0.2} cy={p.cy - p.ry * 0.1} rx={p.rx * 0.72} ry={p.ry * 0.8} />
          {[-0.45, 0, 0.45].flatMap((fx) => [-0.5, 0, 0.5].map((fy) => (
            <circle key={`${fx}${fy}`} className="t-line" cx={p.cx + fx * p.rx} cy={p.cy + fy * p.ry} r="1.3" />
          )))}
        </g>
      ))}
      <ellipse className="p-tuna" cx="-30" cy="-93" rx="4" ry="5.5" />
      <ellipse className="p-tuna" cx="24" cy="-98" rx="4" ry="5.5" />
      <ellipse className="p-tuna" cx="33" cy="-92" rx="3.6" ry="5" />
    </g>
  )
}

export default function Panorama() {
  return (
    <svg className="panorama" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs>
        <mask id="pano-cortes">
          <rect width="1440" height="320" fill="#fff" />
          {/* escalones */}
          {Array.from({ length: 30 }, (_, i) => <rect key={i} x="578" y={G - (i + 1) * 5.1} width="44" height="1.4" fill="#000" />)}
          {/* puertas del templo */}
          <rect x="592" y="125" width="16" height="26" rx="1" fill="#000" />
          <rect x="570" y="130" width="11" height="21" rx="1" fill="#000" />
          <rect x="619" y="130" width="11" height="21" rx="1" fill="#000" />
          {/* greca del friso */}
          {Array.from({ length: 10 }, (_, i) => <rect key={i} x={558 + i * 9} y="114" width="4" height="4" fill="#000" />)}
        </mask>
      </defs>

      <g className="layer" style={{ '--k': 0.45 }}>
        <circle className="p-sun" cx="600" cy="170" r="118" />
        <circle className="p-sun-ring" cx="600" cy="170" r="132" />
      </g>

      <g className="layer" style={{ '--k': 0.25 }}>
        <path className="p-ground" d="M0 306 Q360 290 720 300 T1440 296 V320 H0Z" />
        <Tikal />
      </g>

      <g className="layer" style={{ '--k': 0.12 }}>
        {/* silueta opaca para que el sol no se transparente a través de la pirámide */}
        <g className="p-knock">
          {Array.from({ length: 9 }, (_, i) => <rect key={i} x={380 + i * 19} y={G - (i + 1) * 17} width={440 - i * 38} height="18" />)}
          <rect x="550" y="105" width="100" height="48" />
        </g>
        <Kukulkan />
        <Angel />
      </g>

      <g className="layer" style={{ '--k': 0.2 }}>
        <Quetzal />
      </g>

      <g className="layer" style={{ '--k': 0 }}>
        <g className="p-near">
          <Agave x={70} s={1.1} />
          <Agave x={340} s={0.8} />
          <Agave x={1010} s={0.9} />
          <Nopal x={1190} />
          <Agave x={1330} s={1.15} />
        </g>
      </g>
    </svg>
  )
}
