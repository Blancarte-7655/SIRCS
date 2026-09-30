// Íconos de línea (estilo Lucide) dibujados en SVG. Uso: <Icon name="check" />
const PATHS = {
  check: <path d="M5 12l5 5 9-10" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
  chevronUp: <path d="M6 15l6-6 6 6" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  download: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-3.5 3.3-5 6.5-5s5.7 1.5 6.5 5M17 11a3 3 0 100-6M21.5 19c-.4-2-1.6-3.4-3.5-4" /></>,
  shield: <><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" /><path d="M9 12l2 2 4-4" /></>,
  log: <><path d="M4 5h16v14H4z" /><path d="M8 9h8M8 13h5" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M3 3l18 18M10.6 5.1A10 10 0 0122 12s-1.2 2.4-3.6 4.5M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7c1.8 0 3.4-.5 4.8-1.3" /><path d="M9.9 9.9a3 3 0 004.2 4.2" /></>,
  alert: <><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  send: <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />,
  text: <path d="M4 18L9 6l5 12M5.8 14h6.4M17 10v6M14 13h6" />,
  contrast: <><circle cx="12" cy="12" r="8" /><path d="M12 4v16a8 8 0 000-16z" fill="currentColor" /></>,
  list: <path d="M4 6h16M4 12h16M4 18h10" />,
  checkSquare: <><path d="M9 11l3 3 8-8" /><path d="M20 12v7H4V5h11" /></>,
  card: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 10h4M7 14h7" /></>,
  clock: <><path d="M12 8v4l3 2" /><circle cx="12" cy="12" r="9" /></>,
  doc: <><path d="M6 3h9l4 4v14H6z" /><path d="M9 12l2 2 4-4" /></>,
  idBadge: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2.5" /><path d="M5.5 16.5c.6-1.8 2-2.5 3.5-2.5s2.9.7 3.5 2.5M15 10h4M15 13h3" /></>,
  pin: <><path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  camera: <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  video: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M10 9l5 3-5 3z" fill="currentColor" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 015 .5c0 1.7-2.5 2-2.5 3.5M12 17h.01" /></>,
  chart: <path d="M4 19V5M4 19h16M8 15v-4M12 15V8M16 15v-6" />,
  access: <><circle cx="12" cy="5" r="2" /><path d="M5 9h14M12 9v12M8 21l4-7 4 7" /></>,
  school: <><path d="M3 9l9-5 9 5-9 5z" /><path d="M7 11v5c3 2 7 2 10 0v-5" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  play: <path d="M8 6l10 6-10 6z" fill="currentColor" />,
  code: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  upload: <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v4h16v-4" /></>,
  pen: <path d="M4 20l4-1 11-11-3-3L5 16l-1 4zM14 6l3 3" />,
  home: <><path d="M4 11l8-7 8 7" /><path d="M6 10v10h12V10" /></>,
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
}

export default function Icon({ name, className = '', ...rest }) {
  return (
    <svg className={`icon ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...rest}>
      {PATHS[name]}
    </svg>
  )
}
