import { useEffect, useState } from 'react'

const fecha = new Intl.DateTimeFormat('es-MX', { timeZone: 'America/Mexico_City', day: '2-digit', month: '2-digit', year: 'numeric' })
const hora = new Intl.DateTimeFormat('es-MX', { timeZone: 'America/Mexico_City', hour: '2-digit', minute: '2-digit', hour12: false })

// Hora del centro de México, se actualiza cada 20 segundos
export default function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 20000)
    return () => clearInterval(id)
  }, [])
  return { texto: `${fecha.format(now)} · ${hora.format(now)}`, iso: now.toISOString() }
}
