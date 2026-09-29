import { useRef, useState } from 'react'
import Icon from '../components/Icon.jsx'
import { pasosRegistro } from '../data/mock.js'

const PASOS = pasosRegistro.slice(1).map((p) => p.titulo) // el paso 0 (aviso) se acepta antes de entrar
const PASO_ACTUAL = 0

function validarClave(valor) {
  const falta = 18 - valor.trim().length
  if (falta === 0) return ''
  return falta > 0 ? `La clave debe tener 18 caracteres. Te faltan ${falta}.` : `La clave debe tener 18 caracteres. Sobran ${-falta}.`
}

export default function Registro() {
  const [clave, setClave] = useState('OORM030417MJLCLR')
  const [errorClave, setErrorClave] = useState(validarClave('OORM030417MJLCLR'))
  const [enviado, setEnviado] = useState(false)
  const claveRef = useRef(null)

  function onSubmit(e) {
    e.preventDefault()
    const err = validarClave(clave)
    setErrorClave(err)
    if (err) { claveRef.current?.focus(); return }
    // Aquí irá POST /api/registros (paso 1)
    setEnviado(true)
  }

  return (
    <>
      <div className="container page">
        <div className="panel-box reg">
          <aside className="reg-steps" aria-label="Pasos del trámite">
            <p className="eyebrow">Nuevo registro · Folio <span className="mono">TR-2026-004817</span></p>
            <ol>
              {PASOS.map((p, i) => (
                <li key={p} className={i < PASO_ACTUAL ? 'done' : i === PASO_ACTUAL ? 'current' : undefined} aria-current={i === PASO_ACTUAL ? 'step' : undefined}>
                  <span className="n">{i + 1}</span>{p}
                </li>
              ))}
            </ol>
          </aside>

          <form className="reg-main" onSubmit={onSubmit} noValidate>
            <div style={{ display: 'grid', gap: 10 }}>
              <p className="eyebrow">Paso {PASO_ACTUAL + 1} de {PASOS.length}</p>
              <h1>Datos personales</h1>
              <div className="progress" role="progressbar" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} aria-label="Avance del trámite"><span style={{ width: '25%' }} /></div>
              <p style={{ color: 'var(--fg-3)', fontSize: '.92rem' }}>Escribe tus datos tal como aparecen en tu acta de nacimiento. Los campos con * son obligatorios.</p>
            </div>

            <div className="grid-3">
              <div className="field"><label htmlFor="r-nombre">Nombre(s) *</label><input id="r-nombre" defaultValue="María Fernanda" autoComplete="given-name" /></div>
              <div className="field"><label htmlFor="r-ap1">Primer apellido *</label><input id="r-ap1" defaultValue="Ochoa" autoComplete="family-name" /></div>
              <div className="field"><label htmlFor="r-ap2">Segundo apellido</label><input id="r-ap2" defaultValue="Ruelas" /></div>
            </div>

            <div className="grid-3">
              <div className="field"><label htmlFor="r-fecha">Fecha de nacimiento *</label><input id="r-fecha" type="date" defaultValue="2003-04-17" /></div>
              <div className="field">
                <label htmlFor="r-entidad">Entidad de nacimiento *</label>
                <select id="r-entidad" defaultValue="Jalisco">
                  {['Jalisco', 'Aguascalientes', 'Colima', 'Michoacán', 'Nayarit', 'Zacatecas'].map((e) => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div className="field">
                <span id="r-sexo" style={{ fontWeight: 700, fontSize: '.9rem' }}>Sexo *</span>
                <div className="radio-row" role="radiogroup" aria-labelledby="r-sexo">
                  {['Mujer', 'Hombre', 'No binario'].map((s, i) => (
                    <label className="radio" key={s} htmlFor={`r-sx-${i}`}><input type="radio" id={`r-sx-${i}`} name="sexo" defaultChecked={i === 0} /> {s}</label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className={`field${errorClave ? ' has-error' : ''}`}>
                <label htmlFor="r-clave">Clave de población *</label>
                <input
                  id="r-clave" ref={claveRef} className="mono" maxLength={18} value={clave}
                  onChange={(e) => setClave(e.target.value.toUpperCase())}
                  onBlur={() => setErrorClave(validarClave(clave))}
                  aria-invalid={!!errorClave} aria-describedby="r-clave-err r-clave-hint"
                />
                {errorClave && <p className="error-msg" id="r-clave-err"><Icon name="alert" /><span>{errorClave}</span></p>}
                <p className="hint" id="r-clave-hint">Se genera a partir de tus datos. Puedes corregirla.</p>
              </div>
              <div className="field">
                <label htmlFor="r-correo">Correo electrónico *</label>
                <input id="r-correo" type="email" defaultValue="mfernanda.ochoa@correo-demo.mx" autoComplete="email" />
                <p className="hint">Te avisaremos aquí cuando tu registro sea validado.</p>
              </div>
            </div>

            <div className="dup-check" role="status">
              <Icon name="shield" />
              <div><b>Sin coincidencias en el registro</b><span>Revisamos nombre, fecha y entidad de nacimiento mientras escribías. No hay otra persona registrada con estos datos.</span></div>
            </div>

            {enviado && <p className="ok-msg" role="status"><Icon name="check" />Datos guardados. El siguiente paso es tu domicilio.</p>}

            <div className="form-actions">
              <button className="btn btn-ghost" type="button">Guardar y continuar después</button>
              <button className="btn btn-primary" type="submit">Continuar a domicilio <Icon name="arrowRight" /></button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
