import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { FlagBadge, Greca, MayaNumber, Pyramid } from '../components/Maya.jsx'
import { IdCardFront } from '../components/IdCard.jsx'
import { avisos, credencial, pasosRegistro, preguntas, tramites } from '../data/mock.js'

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

function TileHead({ icon, title, sub }) {
  return (
    <div className="tile-head">
      <span className="tile-icon"><Icon name={icon} /></span>
      <div><h2>{title}</h2>{sub && <p>{sub}</p>}</div>
    </div>
  )
}

function Asistente() {
  const [marcados, setMarcados] = useState([])
  const [resultado, setResultado] = useState('')
  const toggle = (id) => setMarcados((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]))
  const ver = () => {
    const t = tramites.filter((x) => marcados.includes(x.id)).map((x) => x.tramite)
    setResultado(t.length ? `Tu trámite: ${t.join(' + ')}. Puedes hacerlo en línea.` : 'Marca al menos una opción.')
  }
  return (
    <article className="tile tile-feature span-2" id="asistente">
      <TileHead icon="send" title="¿Qué trámite necesito?" sub="Marca lo que aplica a tu caso." />
      <div className="choice-row">
        {tramites.map((t) => (
          <label key={t.id} htmlFor={`tr-${t.id}`} className="choice">
            <input type="checkbox" id={`tr-${t.id}`} checked={marcados.includes(t.id)} onChange={() => toggle(t.id)} />
            {t.etiqueta}
          </label>
        ))}
      </div>
      <div className="tile-foot">
        <p className="result" aria-live="polite">{resultado}</p>
        <button className="btn btn-light" type="button" onClick={ver}>Ver mi trámite <Icon name="arrowRight" /></button>
      </div>
    </article>
  )
}

function Consulta() {
  const [modo, setModo] = useState('folio')
  const esFolio = modo === 'folio'
  return (
    <article className="tile tile-outline" id="consulta">
      <TileHead icon="search" title="Consultar trámite" sub="Avance o corrección de datos" />
      <div className="segmented" role="group" aria-label="Buscar por">
        <button type="button" aria-pressed={esFolio} onClick={() => setModo('folio')}>Folio</button>
        <button type="button" aria-pressed={!esFolio} onClick={() => setModo('correo')}>Correo</button>
      </div>
      <div className="field">
        <label htmlFor="consulta-valor" className="sr-only">{esFolio ? 'Folio de trámite' : 'Correo electrónico'}</label>
        <input id="consulta-valor" type={esFolio ? 'text' : 'email'} className={esFolio ? 'mono' : undefined} placeholder={esFolio ? 'TR-2026-004817' : 'tu.correo@ejemplo.mx'} />
      </div>
      <Link className="btn btn-primary" to="/credencial">Consultar <Icon name="arrowRight" /></Link>
    </article>
  )
}

function Citas() {
  const fechas = useMemo(proximasFechas, [])
  return (
    <article className="tile tile-outline">
      <TileHead icon="calendar" title="Citas disponibles" sub="Módulo 03 · Tlaquepaque" />
      <div className="date-chips">
        {fechas.map((f) => (
          <span className="date-chip" key={f.key}><small>{f.semana}</small><b>{f.dia}</b><span>{f.mes}</span></span>
        ))}
      </div>
      <Link className="link-arrow" to="/registro">Agendar cita <Icon name="arrowRight" /></Link>
    </article>
  )
}

function Avisos() {
  const [tab, setTab] = useState('avisos')
  const lista = tab === 'avisos' ? avisos : preguntas
  return (
    <article className="tile span-3" id="avisos">
      <div className="tile-head between">
        <div className="tile-head">
          <span className="tile-icon"><Icon name="log" /></span>
          <h2>Avisos y ayuda</h2>
        </div>
        <div className="pill-tabs" role="tablist" aria-label="Avisos y preguntas">
          <button role="tab" aria-selected={tab === 'avisos'} onClick={() => setTab('avisos')}>Avisos</button>
          <button role="tab" aria-selected={tab === 'preguntas'} onClick={() => setTab('preguntas')}>Preguntas</button>
        </div>
      </div>
      <ul className="notice-list" role="tabpanel">
        {lista.map((a) => (
          <li key={a.id}>
            <Link to="/">{a.nuevo && <span className="tag-new">Nuevo</span>}{a.titulo}</Link>
            {a.fecha ? <time>{a.fecha}</time> : <Icon name="chevronRight" />}
          </li>
        ))}
      </ul>
    </article>
  )
}

export default function Portal() {
  return (
    <>
      <section className="hero">
        <Pyramid />
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="kicker"><Icon name="sparkle" />Credencial digital con verificación por QR</span>
            <h1>Tu identidad, <em>en línea</em> y sin filas.</h1>
            <p className="lead">Registra tus datos, agenda tu cita y consulta tu credencial desde cualquier dispositivo.</p>
            <div className="hero-cta">
              <Link className="btn btn-primary btn-lg" to="/registro">Iniciar registro <Icon name="arrowRight" /></Link>
              <Link className="btn btn-outline btn-lg" to="/#consulta">Consultar mi trámite</Link>
            </div>
            <ul className="hero-facts">
              <li><Icon name="check" />Gratuito</li>
              <li><Icon name="clock" />10 minutos</li>
              <li><Icon name="shield" />Detección de duplicados</li>
            </ul>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="orb" />
            <div className="float-card"><IdCardFront data={credencial} /></div>
            <div className="float-badge"><span><Icon name="check" /></span><div><b>Registro validado</b><small>RG-26-004817</small></div></div>
          </div>
        </div>
      </section>

      <section className="tiles-wrap">
        <div className="container tiles">
          <Asistente />
          <Consulta />
          <Citas />
          <Avisos />
          <article className="tile tile-deep">
            <TileHead icon="users" title="Acceso operativo" sub="Personal de módulo y supervisión" />
            <p className="tile-text">Valida registros, emite credenciales y revisa la bitácora.</p>
            <Link className="btn btn-light" to="/login">Entrar al panel <Icon name="arrowRight" /></Link>
          </article>
        </div>
      </section>

      <div className="container divider" aria-hidden="true"><Greca /><FlagBadge /><Greca /></div>

      <section className="section" id="pasos">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Paso a paso</p>
            <h2>Cómo es el registro</h2>
          </div>
          <ol className="steps-flow">
            {pasosRegistro.map((p, i) => (
              <li key={p.titulo}>
                <span className="bubble"><Icon name={p.icon} /><span className="num" title={`Paso ${i + 1}`}><MayaNumber n={i + 1} /></span></span>
                <span className="step-n">Paso {i + 1}</span>
                <b>{p.titulo}</b>
                <span>{p.nota}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Guía en video</p>
            <h2>¿Prefieres verlo?</h2>
          </div>
          <div className="videos">
            <a href="#pasos"><span className="play"><Icon name="play" /></span><span>Conoce el trámite paso a paso<b>Ver video en español</b></span></a>
            <a href="#pasos"><span className="play"><Icon name="play" /></span><span>El mismo recorrido, interpretado<b>Ver video en lengua de señas</b></span></a>
          </div>
        </div>
      </section>
    </>
  )
}
