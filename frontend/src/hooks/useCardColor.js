import { useEffect, useState } from 'react'

// Colores que la persona puede elegir para la franja de su credencial
export const CARD_COLORS = [
  { id: 'grafito', nombre: 'Grafito', a: '#36312B', b: '#1E1B17' },
  { id: 'marino', nombre: 'Marino', a: '#24365A', b: '#131E36' },
  { id: 'pizarra', nombre: 'Pizarra', a: '#414D5B', b: '#232A33' },
  { id: 'musgo', nombre: 'Musgo', a: '#37443A', b: '#1E2620' },
]

const KEY = 'sircs:card'
const EVENT = 'sircs:card-color'

function read() {
  try { return localStorage.getItem(KEY) || 'grafito' } catch { return 'grafito' }
}

// Devuelve el color elegido y el estilo (variables CSS) para envolver la tarjeta.
// Se recuerda en el navegador y se sincroniza entre la portada y la página de credencial.
export default function useCardColor() {
  const [id, setId] = useState(read)

  useEffect(() => {
    const sync = () => setId(read())
    window.addEventListener(EVENT, sync)
    return () => window.removeEventListener(EVENT, sync)
  }, [])

  const choose = (nuevo) => {
    try { localStorage.setItem(KEY, nuevo) } catch { /* modo privado */ }
    setId(nuevo)
    window.dispatchEvent(new Event(EVENT))
  }

  const color = CARD_COLORS.find((c) => c.id === id) ?? CARD_COLORS[0]
  return { color, choose, style: { '--card-a': color.a, '--card-b': color.b } }
}
