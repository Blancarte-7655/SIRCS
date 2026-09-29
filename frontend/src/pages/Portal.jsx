import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Skyline from '../components/Skyline.jsx'
import { avisos, preguntas, pasosRegistro, tramites } from '../data/mock.js'

const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']

// Próximos 3 días con citas (se salta domingos). En el sistema real vendrá de la API.
function proximasFechas() {
  const out = []
  const d = new Date()
  while (out.length < 3) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() === 0) continue
    out.push({ mes: MESES[d.getMonth()], dia: d.getDate(), semana: DIAS[d.getDay()], key: d.toDateString() })
  }
  return out
}

function Asistente() {
  const [marcados, setMarcados] = useState([])
  const [resultado, setResultado] = useState('Marca al menos una opción.')
  const toggle = (id) => setMarcados((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]))
  const ver = () => {
    const t = tramites.filter((x) => marcados.includes(x.id)).map((x) => x.tramite)
    setResultado(t.length ? `Tu trámite: ${t.join(' + ')}. Puedes hacerlo en línea.` : 'Marca al menos una opción.')
  }
  return (
    <article className="hcard navigator" id="asistente">
      <h2><Icon name="send" />¿Qué trámite necesito?</h2>
      <p>Marca lo que aplica a tu caso y te decimos qué hacer.</p>
      <div className="options">
        {tramites.map((t) => (
          <label key={t.id} htmlFor={`tr-${t.id}`}>
            <input type="checkbox" id={`tr-${t.id}`} checked={marcados.includes(t.id)} onChange={() => toggle(t.id)} /> {t.etiqueta}
          </label>
        ))}
      </div>
      <p className="result" aria-live="polite">{resultado}</p>
      <button className="btn btn-block" type="button" onClick={ver}>Ver mi trámite <Icon name="chevronRight" /></button>
    </article>
  )
}

function Consulta() {
  const [modo, setModo] = useState('folio')
  const esFolio = modo === 'folio'
  return (
    <article className="hcard glass" id="consulta">
      <div className="hcard-head"><div><h2>Consultar mi trámite</h2><p className="who">Revisa el avance o corrige tus datos</p></div></div>
      <div className="segmented" role="group" aria-label="Buscar por">
        <button type="button" aria-pressed={esFolio} onClick={() => setModo('folio')}>Folio</button>
        <button type="button" aria-pressed={!esFolio} onClick={() => setModo('correo')}>Correo</button>
      </div>
      <div className="field">
        <label htmlFor="consulta-valor">{esFolio ? 'Folio de trámite' : 'Correo electrónico'}</label>
        <input id="consulta-valor" type={esFolio ? 'text' : 'email'} className={esFolio ? 'mono' : undefined} placeholder={esFolio ? 'TR-2026-004817' : 'tu.correo@ejemplo.mx'} />
      </div>
      <div className="spacer" />
      <Link className="btn btn-dark btn-block" to="/credencial">Consultar <Icon name="chevronRight" /></Link>
    </article>
  )
}

function Avisos() {
  const [tab, setTab] = useState('avisos')
  const lista = tab === 'avisos' ? avisos : preguntas
  return (
    <article className="hcard glass" id="avisos">
      <div className="notice-tabs" role="tablist" aria-label="Avisos y preguntas">
        <button role="tab" aria-selected={tab === 'avisos'} onClick={() => setTab('avisos')}>Avisos</button>
        <button role="tab" aria-selected={tab === 'preguntas'} onClick={() => setTab('preguntas')}>Preguntas</button>
      </div>
      <ul className="notice-list" role="tabpanel">
        {lista.map((a) => (
          <li key={a.id}>
            <Link to="/">{a.nuevo && <span className="tag-new">Nuevo</span>}{a.titulo}</Link>
            <time>{a.fecha ?? 'FAQ'}</time>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default function Portal() {
  const fechas = useMemo(proximasFechas, [])
  return (
    <>
      <section className="hero">
        <Skyline />
        <div className="container hero-grid">
          <div className="intro">
            <p className="eyebrow">Portal ciudadano</p>
            <h1>Registro de identificación ciudadana</h1>
            <ul className="facts">
              <li><Icon name="check" />Trámite gratuito</li>
              <li><Icon name="check" />Se llena en unos 10 minutos</li>
              <li><Icon name="check" />Recoge tu credencial con tu folio</li>
            </ul>
            <div className="dates">
              <p><Icon name="calendar" />Próximas fechas con citas disponibles</p>
              <div className="date-chips">
                {fechas.map((f) => (
                  <span className="date-chip" key={f.key}><span>{f.mes}</span><b>{f.dia}</b><small>{f.semana}</small></span>
                ))}
              </div>
            </div>
          </div>

          <article className="hcard">
            <div className="hcard-head">
              <div><h2>Nuevo registro</h2><p className="who">Ciudadanía · primera vez</p></div>
              <div className="badge-icon"><span><Icon name="user" /></span>Mayores de 18</div>
            </div>
            <p className="desc">Ten a la mano tu acta de nacimiento, un comprobante de domicilio y un correo.</p>
            <div className="spacer" />
            <Link className="btn btn-primary btn-block" to="/registro">Iniciar registro <Icon name="chevronRight" /></Link>
          </article>

          <article className="hcard">
            <div className="hcard-head">
              <div><h2>Acceso operativo</h2><p className="who">Personal de módulo y supervisión</p></div>
              <div className="badge-icon"><span><Icon name="users" /></span>Con credenciales</div>
            </div>
            <p className="desc">Valida registros, emite credenciales y revisa la bitácora del módulo.</p>
            <div className="spacer" />
            <Link className="btn btn-accent btn-block" to="/login">Entrar al panel <Icon name="chevronRight" /></Link>
          </article>

          <Asistente />
          <Consulta />
          <Avisos />
        </div>
      </section>

      <section className="section" id="pasos">
        <div className="container">
          <h2 className="section-title">Cómo es el registro</h2>
          <ol className="steps-flow">
            {pasosRegistro.map((p, i) => (
              <li key={p.titulo}>
                <span className="bubble"><Icon name={p.icon} /></span>
                <b>Paso {i + 1}</b>
                <span>{p.titulo}<small>({p.nota})</small></span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 8 }}>
        <div className="container">
          <h2 className="section-title">Guía en video</h2>
          <div className="videos">
            <a href="#pasos"><span className="play"><Icon name="video" /></span><span>Conoce el trámite paso a paso.<b>Ver video (español)</b></span></a>
            <a href="#pasos"><span className="play"><Icon name="video" /></span><span>El mismo recorrido, interpretado.<b>Ver video (lengua de señas)</b></span></a>
          </div>
        </div>
      </section>
    </>
  )
}
