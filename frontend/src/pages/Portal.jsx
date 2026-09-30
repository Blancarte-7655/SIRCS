import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { ErrorState, Skeleton } from '../components/States.jsx'
import useFakeRequest from '../hooks/useFakeRequest.js'
import useCardColor from '../hooks/useCardColor.js'
import { FlagBadge, Greca, MayaNumber } from '../components/Maya.jsx'
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
    <article className="tile tile-feature span-2 reveal" id="asistente">
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
  const navigate = useNavigate()
  const [modo, setModo] = useState('folio')
  const [valor, setValor] = useState('')
  const [estado, setEstado] = useState({ tipo: '', msg: '' })
  const [buscando, setBuscando] = useState(false)
  const esFolio = modo === 'folio'

  // Simula GET /api/tramites?folio= o ?correo=
  function consultar(e) {
    e.preventDefault()
    const v = valor.trim()
    if (!v) return setEstado({ tipo: 'error', msg: esFolio ? 'Escribe tu folio de trámite.' : 'Escribe tu correo electrónico.' })
    if (esFolio && !/^TR-\d{4}-\d{6}$/i.test(v)) return setEstado({ tipo: 'error', msg: 'El folio tiene el formato TR-2026-004817.' })
    if (!esFolio && !/^\S+@\S+\.\S+$/.test(v)) return setEstado({ tipo: 'error', msg: 'Revisa que el correo esté completo.' })
    setBuscando(true); setEstado({ tipo: '', msg: '' })
    setTimeout(() => {
      setBuscando(false)
      if (v.toUpperCase() === 'TR-2026-004817' || v.toLowerCase() === 'olivia.apellido@correo-demo.mx') navigate('/credencial')
      else setEstado({ tipo: 'empty', msg: 'No encontramos un trámite con ese dato. Revisa que esté bien escrito.' })
    }, 700)
  }

  return (
    <form className="tile tile-outline reveal" id="consulta" onSubmit={consultar} noValidate>
      <TileHead icon="search" title="Consultar trámite" sub="Avance o corrección de datos" />
      <div className="segmented" role="group" aria-label="Buscar por">
        <button type="button" aria-pressed={esFolio} onClick={() => { setModo('folio'); setEstado({ tipo: '', msg: '' }) }}>Folio</button>
        <button type="button" aria-pressed={!esFolio} onClick={() => { setModo('correo'); setEstado({ tipo: '', msg: '' }) }}>Correo</button>
      </div>
      <div className={`field${estado.tipo === 'error' ? ' has-error' : ''}`}>
        <label htmlFor="consulta-valor" className="sr-only">{esFolio ? 'Folio de trámite' : 'Correo electrónico'}</label>
        <input
          id="consulta-valor" value={valor} onChange={(e) => setValor(e.target.value)}
          type={esFolio ? 'text' : 'email'} className={esFolio ? 'mono' : undefined}
          placeholder={esFolio ? 'TR-2026-004817' : 'tu.correo@ejemplo.mx'}
          aria-invalid={estado.tipo === 'error'} aria-describedby="consulta-msg"
        />
        {estado.msg && (
          <p id="consulta-msg" className={estado.tipo === 'error' ? 'error-msg' : 'hint'} role="status">
            {estado.tipo === 'error' && <Icon name="alert" />}<span>{estado.msg}</span>
          </p>
        )}
      </div>
      <button className="btn btn-primary" type="submit" disabled={buscando}>
        {buscando ? 'Buscando…' : 'Consultar'} <Icon name="arrowRight" />
      </button>
    </form>
  )
}

function Citas() {
  const fechas = useMemo(proximasFechas, [])
  return (
    <article className="tile tile-outline reveal">
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
  const req = useFakeRequest(() => ({ avisos, preguntas }), { delay: 600 }) // GET /api/avisos
  const lista = req.data ? (tab === 'avisos' ? req.data.avisos : req.data.preguntas) : []
  return (
    <article className="tile span-3 reveal" id="avisos">
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
      {req.error && <ErrorState onRetry={req.retry} />}
      <ul className="notice-list" role="tabpanel" aria-busy={req.loading} key={tab}>
        {req.loading && Array.from({ length: 4 }, (_, i) => (
          <li key={i} aria-hidden="true"><Skeleton w={`${70 - i * 8}%`} /><Skeleton w={56} h={10} /></li>
        ))}
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

const GARANTIAS = [
  { icon: 'shield', titulo: 'Datos protegidos', texto: 'Tu información solo se usa para tu registro y se guarda con acceso controlado.' },
  { icon: 'log', titulo: 'Cada cambio, registrado', texto: 'Toda corrección queda en bitácora con fecha, hora y responsable.' },
  { icon: 'access', titulo: 'Para todas las personas', texto: 'Texto ampliable, alto contraste y guía en lengua de señas.' },
]

function Hero() {
  const card = useCardColor()
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy hero-in">
          <p className="hero-eyebrow"><span className="hero-mark" aria-hidden="true" />Registro ciudadano · Tlaquepaque, Jalisco</p>
          <h1>Tu identidad, registrada con <em>orden</em> y certeza.</h1>
          <p className="lead">Registra tus datos, agenda tu cita y consulta tu credencial digital desde cualquier dispositivo, con verificación por código QR.</p>
          <div className="hero-cta">
            <Link className="btn btn-primary btn-lg" to="/registro">Iniciar registro <Icon name="arrowRight" /></Link>
            <Link className="btn btn-outline btn-lg" to="/#consulta">Consultar mi trámite</Link>
          </div>
          <dl className="hero-facts">
            <div><dt>Costo</dt><dd>Gratuito</dd></div>
            <div><dt>Tiempo estimado</dt><dd>10 minutos</dd></div>
            <div><dt>Verificación</dt><dd>Código QR</dd></div>
          </dl>
        </div>
        <figure className="doc hero-in" aria-hidden="true">
          <div className="doc-head"><span>Credencial digital</span><span className="mono">RG-26-004817</span></div>
          <div className="doc-card" style={card.style}><IdCardFront data={credencial} /></div>
          <figcaption><Icon name="check" />Registro validado · Detección de duplicados</figcaption>
        </figure>
      </div>
      <div className="container"><Greca className="hero-rule" /></div>
    </section>
  )
}

export default function Portal() {
  return (
    <>
      <Hero />

      <section className="services" aria-labelledby="servicios-t">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Servicios en línea</p>
            <h2 id="servicios-t">¿Qué necesitas hacer?</h2>
            <p>Todo el trámite se hace aquí. Solo acudes al módulo para tu fotografía, si no la subes en línea.</p>
          </div>
          <div className="tiles">
            <Asistente />
            <Consulta />
            <Citas />
            <Avisos />
            <article className="tile tile-stone reveal">
              <TileHead icon="users" title="Acceso operativo" sub="Personal de módulo y supervisión" />
              <p className="tile-text">Valida registros, emite credenciales y revisa la bitácora.</p>
              <Link className="btn btn-outline" to="/login">Entrar al panel <Icon name="arrowRight" /></Link>
            </article>
          </div>
          <div className="divider reveal" aria-hidden="true"><Greca /><FlagBadge /><Greca /></div>
        </div>
      </section>

      <section className="section" id="pasos">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Paso a paso</p>
            <h2>Cómo es el registro</h2>
            <p>Cinco pasos. Puedes guardar y continuar después con tu folio.</p>
          </div>
          <ol className="steps-flow">
            {pasosRegistro.map((p, i) => (
              <li key={p.titulo} className="reveal" style={{ '--d': `${i * 70}ms` }}>
                <div className="step-top">
                  <span className="step-ic"><Icon name={p.icon} /></span>
                  <span className="maya" title={`Paso ${i + 1}`}><MayaNumber n={i + 1} /></span>
                </div>
                <span className="step-n">Paso {i + 1}</span>
                <b>{p.titulo}</b>
                <span className="step-note">{p.nota}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="pledges" aria-labelledby="garantias-t">
        <div className="container">
          <div className="pledges-intro reveal">
            <p className="eyebrow">Nuestro compromiso</p>
            <h2 id="garantias-t">Un registro serio, claro y seguro.</h2>
            <p>Así cuidamos tu información en cada paso del trámite.</p>
          </div>
          <ul>
            {GARANTIAS.map((g, i) => (
              <li key={g.titulo} className="reveal" style={{ '--d': `${i * 80}ms` }}><Icon name={g.icon} /><b>{g.titulo}</b><p>{g.texto}</p></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Guía en video</p>
            <h2>¿Prefieres verlo?</h2>
          </div>
          <div className="videos reveal">
            <a href="#pasos"><span className="play"><Icon name="play" /></span><span>Conoce el trámite paso a paso<b>Ver video en español</b></span></a>
            <a href="#pasos"><span className="play"><Icon name="play" /></span><span>El mismo recorrido, interpretado<b>Ver video en lengua de señas</b></span></a>
          </div>
        </div>
      </section>
    </>
  )
}
