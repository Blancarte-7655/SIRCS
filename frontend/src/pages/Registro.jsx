import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { MayaNumber } from '../components/Maya.jsx'
import { municipios } from '../data/mock.js'

const PASOS = ['Datos personales', 'Domicilio', 'Fotografía y firma', 'Revisión y envío']
const ENTIDADES = ['Jalisco', 'Aguascalientes', 'Colima', 'Michoacán', 'Nayarit', 'Zacatecas']

const INICIAL = {
  nombre: 'María Fernanda', ap1: 'Ochoa', ap2: 'Ruelas', fecha: '2003-04-17', entidad: 'Jalisco', sexo: 'Mujer',
  clave: 'OORM030417MJLCLR07', correo: 'mfernanda.ochoa@correo-demo.mx',
  calle: 'C. Independencia', numero: '214', colonia: 'Centro', cp: '45500', municipio: 'San Pedro Tlaquepaque', comprobante: '',
  foto: '', firma: '', confirmo: false,
}

// Reglas de validación por paso: devuelven { campo: mensaje }
function validar(paso, d) {
  const e = {}
  if (paso === 0) {
    if (!d.nombre.trim()) e.nombre = 'Escribe tu nombre.'
    if (!d.ap1.trim()) e.ap1 = 'Escribe tu primer apellido.'
    if (!d.fecha) e.fecha = 'Elige tu fecha de nacimiento.'
    const falta = 18 - d.clave.trim().length
    if (falta) e.clave = falta > 0 ? `La clave debe tener 18 caracteres. Te faltan ${falta}.` : `La clave debe tener 18 caracteres. Sobran ${-falta}.`
    if (!/^\S+@\S+\.\S+$/.test(d.correo)) e.correo = 'Revisa que el correo esté completo.'
  }
  if (paso === 1) {
    if (!d.calle.trim()) e.calle = 'Escribe tu calle.'
    if (!d.numero.trim()) e.numero = 'Escribe el número.'
    if (!d.colonia.trim()) e.colonia = 'Escribe tu colonia.'
    if (!/^\d{5}$/.test(d.cp)) e.cp = 'El código postal tiene 5 números.'
  }
  if (paso === 2) {
    if (!d.foto) e.foto = 'Sube una fotografía de frente, con fondo claro.'
    if (!d.firma) e.firma = 'Dibuja tu firma en el recuadro.'
  }
  if (paso === 3 && !d.confirmo) e.confirmo = 'Confirma que tus datos son correctos para enviar.'
  return e
}

function Field({ id, label, error, hint, children }) {
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <p className="error-msg" id={`${id}-err`}><Icon name="alert" /><span>{error}</span></p>}
      {hint && !error && <p className="hint">{hint}</p>}
    </div>
  )
}

// Recuadro para dibujar la firma con el dedo o el mouse
function SignaturePad({ value, onChange }) {
  const ref = useRef(null)
  const drawing = useRef(false)
  useEffect(() => {
    const c = ref.current
    const r = c.getBoundingClientRect()
    c.width = r.width * 2
    c.height = r.height * 2
    const g = c.getContext('2d')
    g.scale(2, 2)
    g.lineWidth = 2.2
    g.lineCap = 'round'
    g.strokeStyle = '#1A1C1E'
    if (value) { const img = new Image(); img.onload = () => g.drawImage(img, 0, 0, r.width, r.height); img.src = value }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const pos = (e) => { const r = ref.current.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] }
  const down = (e) => { drawing.current = true; ref.current.setPointerCapture(e.pointerId); const g = ref.current.getContext('2d'); g.beginPath(); g.moveTo(...pos(e)) }
  const move = (e) => { if (!drawing.current) return; const g = ref.current.getContext('2d'); g.lineTo(...pos(e)); g.stroke() }
  const up = () => { if (!drawing.current) return; drawing.current = false; onChange(ref.current.toDataURL('image/png')) }
  const clear = () => { const c = ref.current; c.getContext('2d').clearRect(0, 0, c.width, c.height); onChange('') }
  return (
    <div className="sign">
      <canvas ref={ref} className="sign-pad" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} aria-label="Recuadro para firmar" role="img" />
      <div className="sign-foot"><span>Firma dentro del recuadro</span><button type="button" className="btn btn-sm btn-outline" onClick={clear}>Borrar</button></div>
    </div>
  )
}

export default function Registro() {
  const [paso, setPaso] = useState(0)
  const [d, setD] = useState(INICIAL)
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [listo, setListo] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const copiarFolio = async () => {
    try { await navigator.clipboard.writeText('RG-26-004817'); setCopiado(true); setTimeout(() => setCopiado(false), 2000) } catch { /* sin permiso: el folio se puede seleccionar a mano */ }
  }
  const topRef = useRef(null)
  const set = (k) => (e) => setD((x) => ({ ...x, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const irA = (n) => { setErrores({}); setPaso(n); topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  function siguiente(e) {
    e.preventDefault()
    const err = validar(paso, d)
    setErrores(err)
    if (Object.keys(err).length) {
      document.getElementById(`r-${Object.keys(err)[0]}`)?.focus()
      return
    }
    if (paso < 3) return irA(paso + 1)
    // Aquí irá POST /api/registros
    setEnviando(true)
    setTimeout(() => { setEnviando(false); setListo(true); topRef.current?.scrollIntoView({ behavior: 'smooth' }) }, 900)
  }

  function onFoto(e) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) return setErrores((x) => ({ ...x, foto: 'El archivo debe ser una imagen (JPG o PNG).' }))
    setD((x) => ({ ...x, foto: URL.createObjectURL(f) }))
    setErrores((x) => ({ ...x, foto: undefined }))
  }

  if (listo) {
    return (
      <div className="container page" ref={topRef}>
        <div className="panel-box done">
          <span className="done-icon"><Icon name="check" /></span>
          <h1>¡Registro enviado!</h1>
          <p>Tu folio es <b className="mono">RG-26-004817</b>. Te avisaremos a <b>{d.correo}</b> cuando esté validado.</p>
          <button className="link-btn" type="button" onClick={copiarFolio} aria-live="polite">
            <Icon name={copiado ? 'check' : 'doc'} />{copiado ? 'Folio copiado' : 'Copiar folio'}
          </button>
          <div className="done-actions">
            <Link className="btn btn-primary" to="/credencial"><Icon name="card" />Ver mi credencial</Link>
            <Link className="btn btn-outline" to="/"><Icon name="home" />Volver al inicio</Link>
          </div>
        </div>
      </div>
    )
  }

  const pct = ((paso + 1) / PASOS.length) * 100

  return (
    <div className="container page" ref={topRef}>
      <div className="panel-box reg">
        <aside className="reg-steps" aria-label="Pasos del trámite">
          <p className="eyebrow">Nuevo registro · Folio <span className="mono">TR-2026-004817</span></p>
          <ol>
            {PASOS.map((p, i) => (
              <li key={p} className={i < paso ? 'done' : i === paso ? 'current' : undefined} aria-current={i === paso ? 'step' : undefined}>
                <button type="button" onClick={() => i < paso && irA(i)} disabled={i >= paso} className="step-btn">
                  <span className="n">{i < paso ? <Icon name="check" /> : <MayaNumber n={i + 1} />}</span>{p}
                </button>
              </li>
            ))}
          </ol>
        </aside>

        <form className="reg-main" onSubmit={siguiente} noValidate key={paso}>
          <div className="reg-head">
            <p className="eyebrow">Paso {paso + 1} de {PASOS.length}</p>
            <h1>{PASOS[paso]}</h1>
            <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Avance del trámite"><span style={{ width: `${pct}%` }} /></div>
          </div>

          {Object.keys(errores).filter((k) => errores[k]).length > 1 && (
            <div className="error-summary" role="alert">
              <b>Revisa {Object.keys(errores).filter((k) => errores[k]).length} campos</b> marcados en rojo para continuar.
            </div>
          )}

          {paso === 0 && (
            <>
              <p className="reg-intro">Escribe tus datos tal como aparecen en tu acta de nacimiento. Los campos con * son obligatorios.</p>
              <div className="grid-3">
                <Field id="r-nombre" label="Nombre(s) *" error={errores.nombre}><input id="r-nombre" value={d.nombre} onChange={set('nombre')} autoComplete="given-name" /></Field>
                <Field id="r-ap1" label="Primer apellido *" error={errores.ap1}><input id="r-ap1" value={d.ap1} onChange={set('ap1')} autoComplete="family-name" /></Field>
                <Field id="r-ap2" label="Segundo apellido"><input id="r-ap2" value={d.ap2} onChange={set('ap2')} /></Field>
              </div>
              <div className="grid-3">
                <Field id="r-fecha" label="Fecha de nacimiento *" error={errores.fecha}><input id="r-fecha" type="date" value={d.fecha} onChange={set('fecha')} /></Field>
                <Field id="r-entidad" label="Entidad de nacimiento *">
                  <select id="r-entidad" value={d.entidad} onChange={set('entidad')}>{ENTIDADES.map((x) => <option key={x}>{x}</option>)}</select>
                </Field>
                <div className="field">
                  <span id="r-sexo-l" className="label">Sexo *</span>
                  <div className="radio-row" role="radiogroup" aria-labelledby="r-sexo-l">
                    {['Mujer', 'Hombre', 'No binario'].map((x, i) => (
                      <label className="radio" key={x} htmlFor={`r-sx-${i}`}><input type="radio" id={`r-sx-${i}`} name="sexo" value={x} checked={d.sexo === x} onChange={set('sexo')} /> {x}</label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid-2">
                <Field id="r-clave" label="Clave de población *" error={errores.clave} hint="Se genera a partir de tus datos. Puedes corregirla.">
                  <input id="r-clave" className="mono" maxLength={18} value={d.clave} onChange={(e) => setD((x) => ({ ...x, clave: e.target.value.toUpperCase() }))} aria-invalid={!!errores.clave} />
                </Field>
                <Field id="r-correo" label="Correo electrónico *" error={errores.correo} hint="Te avisaremos aquí cuando tu registro sea validado.">
                  <input id="r-correo" type="email" value={d.correo} onChange={set('correo')} autoComplete="email" aria-invalid={!!errores.correo} />
                </Field>
              </div>
              <div className="dup-check" role="status">
                <Icon name="shield" />
                <div><b>Sin coincidencias en el registro</b><span>Revisamos nombre, fecha y entidad de nacimiento mientras escribías. No hay otra persona registrada con estos datos.</span></div>
              </div>
            </>
          )}

          {paso === 1 && (
            <>
              <p className="reg-intro">Escribe el domicilio donde vives actualmente, igual que en tu comprobante.</p>
              <div className="grid-3">
                <div className="span-2-col"><Field id="r-calle" label="Calle *" error={errores.calle}><input id="r-calle" value={d.calle} onChange={set('calle')} autoComplete="address-line1" /></Field></div>
                <Field id="r-numero" label="Número *" error={errores.numero}><input id="r-numero" value={d.numero} onChange={set('numero')} inputMode="numeric" /></Field>
              </div>
              <div className="grid-3">
                <Field id="r-colonia" label="Colonia *" error={errores.colonia}><input id="r-colonia" value={d.colonia} onChange={set('colonia')} /></Field>
                <Field id="r-cp" label="Código postal *" error={errores.cp}><input id="r-cp" value={d.cp} onChange={set('cp')} inputMode="numeric" maxLength={5} autoComplete="postal-code" /></Field>
                <Field id="r-municipio" label="Municipio *">
                  <select id="r-municipio" value={d.municipio} onChange={set('municipio')}>{municipios.map((m) => <option key={m}>{m}</option>)}</select>
                </Field>
              </div>
              <Field id="r-comprobante" label="Comprobante de domicilio" hint="Recibo de luz, agua o teléfono de los últimos 3 meses. PDF o imagen.">
                <label className="upload" htmlFor="r-comprobante">
                  <Icon name="upload" /><span>{d.comprobante || 'Elegir archivo'}</span>
                  <input id="r-comprobante" type="file" accept="image/*,application/pdf" onChange={(e) => setD((x) => ({ ...x, comprobante: e.target.files?.[0]?.name || '' }))} />
                </label>
              </Field>
            </>
          )}

          {paso === 2 && (
            <>
              <p className="reg-intro">Tu foto debe ser de frente, sin lentes oscuros ni gorra, con fondo claro. Si prefieres, puedes tomarla en el módulo.</p>
              <div className="grid-2 media-grid">
                <div className={`field${errores.foto ? ' has-error' : ''}`}>
                  <span className="label">Fotografía *</span>
                  <label className="photo-drop" htmlFor="r-foto">
                    {d.foto ? <img src={d.foto} alt="Vista previa de tu fotografía" /> : <><Icon name="camera" /><span>Subir fotografía</span></>}
                    <input id="r-foto" type="file" accept="image/*" onChange={onFoto} />
                  </label>
                  {errores.foto && <p className="error-msg"><Icon name="alert" /><span>{errores.foto}</span></p>}
                </div>
                <div className={`field${errores.firma ? ' has-error' : ''}`}>
                  <span className="label" id="r-firma">Firma *</span>
                  <SignaturePad value={d.firma} onChange={(v) => setD((x) => ({ ...x, firma: v }))} />
                  {errores.firma && <p className="error-msg"><Icon name="alert" /><span>{errores.firma}</span></p>}
                </div>
              </div>
            </>
          )}

          {paso === 3 && (
            <>
              <p className="reg-intro">Revisa que todo esté bien antes de enviar. Puedes regresar a cualquier paso para corregir.</p>
              <div className="review">
                <section>
                  <header><b>Datos personales</b><button type="button" className="link-btn" onClick={() => irA(0)}><Icon name="pen" />Editar</button></header>
                  <dl>
                    <div><dt>Nombre</dt><dd>{d.nombre} {d.ap1} {d.ap2}</dd></div>
                    <div><dt>Nacimiento</dt><dd>{d.fecha.split('-').reverse().join('/')} · {d.entidad}</dd></div>
                    <div><dt>Sexo</dt><dd>{d.sexo}</dd></div>
                    <div><dt>Clave</dt><dd className="mono">{d.clave}</dd></div>
                    <div><dt>Correo</dt><dd>{d.correo}</dd></div>
                  </dl>
                </section>
                <section>
                  <header><b>Domicilio</b><button type="button" className="link-btn" onClick={() => irA(1)}><Icon name="pen" />Editar</button></header>
                  <dl>
                    <div><dt>Dirección</dt><dd>{d.calle} {d.numero}, {d.colonia}</dd></div>
                    <div><dt>Municipio</dt><dd>{d.municipio}, C.P. {d.cp}</dd></div>
                    <div><dt>Comprobante</dt><dd>{d.comprobante || 'Lo presentarás en el módulo'}</dd></div>
                  </dl>
                </section>
                <section>
                  <header><b>Fotografía y firma</b><button type="button" className="link-btn" onClick={() => irA(2)}><Icon name="pen" />Editar</button></header>
                  <div className="review-media">
                    {d.foto && <img src={d.foto} alt="Tu fotografía" />}
                    {d.firma && <img src={d.firma} alt="Tu firma" className="review-sign" />}
                  </div>
                </section>
              </div>
              <div className={`field${errores.confirmo ? ' has-error' : ''}`}>
                <label className="check" htmlFor="r-confirmo"><input id="r-confirmo" type="checkbox" checked={d.confirmo} onChange={set('confirmo')} /> Confirmo que mis datos son correctos y acepto el aviso de privacidad.</label>
                {errores.confirmo && <p className="error-msg"><Icon name="alert" /><span>{errores.confirmo}</span></p>}
              </div>
            </>
          )}

          <div className="form-actions">
            {paso > 0
              ? <button className="btn btn-outline" type="button" onClick={() => irA(paso - 1)}><Icon name="chevronLeft" />Regresar</button>
              : <Link className="btn btn-outline" to="/">Cancelar</Link>}
            <button className="btn btn-primary" type="submit" disabled={enviando}>
              {paso < 3 ? <>Continuar a {PASOS[paso + 1].toLowerCase()} <Icon name="arrowRight" /></> : enviando ? 'Enviando…' : <>Enviar registro <Icon name="check" /></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
