import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'

export default function Login() {
  const navigate = useNavigate()
  const [tipo, setTipo] = useState('ciudadano')
  const [verPass, setVerPass] = useState(false)
  const [enviando, setEnviando] = useState(false)

  // Simulación: aún no hay backend. Aquí irá POST /api/auth/login
  function onSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setTimeout(() => navigate(tipo === 'operativo' ? '/panel' : '/credencial'), 700)
  }

  return (
    <div className="container page">
      <div className="panel-box login">
        <div className="login-side">
          <div className="brand"><span><b>SIRCS</b><small>Sistema de Registro Ciudadano Simulado</small></span></div>
          <div>
            <h1>Tu identidad, registrada con orden y transparencia.</h1>
            <p>Consulta el estado de tu registro, actualiza tu domicilio y descarga tu credencial de muestra desde un solo lugar.</p>
          </div>
          <ul>
            <li><Icon name="shield" />Detección de registros duplicados en tiempo real</li>
            <li><Icon name="log" />Bitácora de cada cambio, con fecha y responsable</li>
            <li><Icon name="user" />Accesos separados para ciudadanía y personal operativo</li>
          </ul>
          <svg className="rings" viewBox="0 0 200 200" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth=".6">
              {[95, 80, 65, 50, 35].map((r) => <circle key={r} cx="100" cy="100" r={r} />)}
              <ellipse cx="100" cy="100" rx="95" ry="40" />
              <ellipse cx="100" cy="100" rx="40" ry="95" />
              <ellipse cx="100" cy="100" rx="95" ry="40" transform="rotate(45 100 100)" />
              <ellipse cx="100" cy="100" rx="95" ry="40" transform="rotate(-45 100 100)" />
            </g>
          </svg>
        </div>

        <form className="login-form" onSubmit={onSubmit} noValidate>
          <div>
            <p className="eyebrow">Bienvenido</p>
            <h2>Inicia sesión</h2>
          </div>
          <div className="segmented" role="group" aria-label="Tipo de acceso">
            <button type="button" aria-pressed={tipo === 'ciudadano'} onClick={() => setTipo('ciudadano')}>Ciudadano</button>
            <button type="button" aria-pressed={tipo === 'operativo'} onClick={() => setTipo('operativo')}>Personal operativo</button>
          </div>
          <div className="field">
            <label htmlFor="login-correo">Correo electrónico</label>
            <input id="login-correo" type="email" autoComplete="username" defaultValue="mfernanda.ochoa@correo-demo.mx" />
          </div>
          <div className="field">
            <label htmlFor="login-pass">Contraseña</label>
            <div className="password">
              <input id="login-pass" type={verPass ? 'text' : 'password'} autoComplete="current-password" defaultValue="demo-demo-2026" />
              <button type="button" onClick={() => setVerPass((v) => !v)} aria-label={verPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                <Icon name={verPass ? 'eyeOff' : 'eye'} />
              </button>
            </div>
          </div>
          <div className="row-between">
            <label className="check" htmlFor="login-recordar"><input id="login-recordar" type="checkbox" defaultChecked /> Mantener sesión en este equipo</label>
            <Link to="/login">Olvidé mi contraseña</Link>
          </div>
          <button className="btn btn-primary" type="submit" disabled={enviando}>{enviando ? 'Verificando…' : 'Entrar'}</button>
          <p className="foot-note">
            ¿Aún no tienes registro? <Link to="/registro">Inicia tu trámite en línea</Link>. Puedes pegar tu contraseña o usar el gestor de contraseñas de tu navegador.
          </p>
        </form>
      </div>
    </div>
  )
}
