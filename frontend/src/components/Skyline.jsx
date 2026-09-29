// Silueta decorativa inspirada en Tlaquepaque: parroquia con dos torres y los arcos de El Parián.
const ARCOS = Array.from({ length: 10 }, (_, i) => 200 + i * 56)

export default function Skyline() {
  return (
    <svg className="skyline" viewBox="0 0 760 262" aria-hidden="true" focusable="false">
      <defs>
        <mask id="arcos">
          <rect width="760" height="262" fill="#fff" />
          <g fill="#000">
            {ARCOS.map((x) => <path key={`a${x}`} d={`M${x} 262V206a19 19 0 0 1 38 0V262Z`} />)}
            {ARCOS.map((x) => <path key={`v${x}`} d={`M${x + 6} 176v-14a13 13 0 0 1 26 0v14Z`} />)}
          </g>
        </mask>
        <linearGradient id="desvanecer" x1="0" x2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset=".25" stopColor="currentColor" stopOpacity="1" />
        </linearGradient>
      </defs>
      <g className="back" fill="currentColor">
        <path d="M468 262V70h10V52l14-22 14 22v18h10v192Z" />
        <path d="M584 262V70h10V52l14-22 14 22v18h10v192Z" />
        <path d="M516 262V112l34-26 34 26v150Z" />
        <path d="M528 110a22 22 0 0 1 44 0Z" />
        <rect x="546" y="60" width="8" height="24" />
        <rect x="540" y="66" width="20" height="4" />
        <path d="M330 262V150h40l10-14h50l10 14h30v112Z" />
        <path d="M660 262V140h60l14 20h26v102Z" />
      </g>
      <g className="front" fill="url(#desvanecer)" mask="url(#arcos)">
        <rect x="180" y="148" width="580" height="114" />
        <rect x="176" y="140" width="588" height="10" />
      </g>
    </svg>
  )
}
