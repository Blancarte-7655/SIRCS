import { useEffect, useState } from 'react'

const KEY = 'sircs:theme'

function systemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Tema claro / oscuro. Si la persona no elige, se sigue el tema del sistema.
export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(KEY) || systemTheme() } catch { return systemTheme() }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem(KEY, theme) } catch { /* modo privado */ }
  }, [theme])

  return { theme, isDark: theme === 'dark', toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }
}
