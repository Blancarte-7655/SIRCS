import { useEffect, useState } from 'react'

const SIZES = ['100%', '112.5%', '125%']
const LABELS = ['A', 'A+', 'A++']

function read(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v === null ? fallback : JSON.parse(v)
  } catch {
    return fallback
  }
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* modo privado */ }
}

// Tamaño de letra (3 niveles) y alto contraste. Se recuerdan en este navegador.
export default function useAccessibility() {
  const [size, setSize] = useState(() => read('sis:text', 0))
  const [contrast, setContrast] = useState(() => read('sis:hc', false))

  useEffect(() => {
    document.documentElement.style.fontSize = SIZES[size]
    write('sis:text', size)
  }, [size])

  useEffect(() => {
    document.documentElement.classList.toggle('hc', contrast)
    write('sis:hc', contrast)
  }, [contrast])

  return {
    sizeLabel: LABELS[size],
    sizeIsLarge: size > 0,
    nextSize: () => setSize((s) => (s + 1) % SIZES.length),
    contrast,
    toggleContrast: () => setContrast((c) => !c),
  }
}
