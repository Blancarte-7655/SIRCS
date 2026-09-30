import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TopBar from './TopBar.jsx'
import Footer from './Footer.jsx'
import useReveal from '../hooks/useReveal.js'

// Estructura común: barra fija arriba, contenido y (opcional) pie de página
export default function Layout({ withFooter = true }) {
  const { pathname, hash } = useLocation()
  useReveal([pathname])

  // Al cambiar de página, sube; si la liga trae #seccion, baja a esa sección
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return (
    <>
      <TopBar />
      <main id="main" tabIndex={-1}>
        {/* key cambia en cada página: dispara la transición suave */}
        <div className="page-fade" key={pathname}><Outlet /></div>
      </main>
      {withFooter && <Footer />}
    </>
  )
}
