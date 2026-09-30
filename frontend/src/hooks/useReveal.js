import { useEffect } from 'react'

// Aparición suave al entrar en pantalla. Solo se usa en elementos con la clase .reveal.
// Sin JavaScript o con "reducir movimiento", el contenido se muestra de inmediato.
export default function useReveal(deps = []) {
  useEffect(() => {
    const root = document.documentElement
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const items = Array.from(document.querySelectorAll('.reveal:not(.in)'))
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('in'))
      return
    }
    root.classList.add('reveal-ready')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
