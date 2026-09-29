import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Portal from './pages/Portal.jsx'
import Login from './pages/Login.jsx'
import Registro from './pages/Registro.jsx'
import Panel from './pages/Panel.jsx'
import Credencial from './pages/Credencial.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas públicas: barra fija + pie de página */}
        <Route element={<Layout />}>
          <Route path="/" element={<Portal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/credencial" element={<Credencial />} />
          <Route path="*" element={<Portal />} />
        </Route>
        {/* Panel del operador: sin pie de página */}
        <Route element={<Layout withFooter={false} />}>
          <Route path="/panel" element={<Panel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
