import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/portal.css'
import './styles/pages.css'
import './styles/card.css'
import './styles/motion.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
