import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { bitacora, estados, indicadores, municipios, operador, registros } from '../data/mock.js'

const fmt = new Intl.NumberFormat('es-MX')
const DOT = { danger: 'var(--danger)', ok: 'var(--ok)', primary: 'var(--primary)', warn: 'var(--warn)' }

function Sparkline({ values }) {
  const w = 120, h = 28, max = Math.max(...values), min = Math.min(...values)
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - 3 - ((v - min) / (max - min || 1)) * (h - 8)])
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const [lx, ly] = pts[pts.length - 1]
  return (
    <svg className="sparkline" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label={`Tendencia de 7 días: de ${values[0]} a ${values[values.length - 1]}`}>
      <path d={`${line} L${w} ${h} L0 ${h}Z`} fill="var(--primary-soft)" />
      <path d={line} fill="none" stroke="var(--primary)" strokeWidth="2" />
      <circle cx={lx - 1} cy={ly} r="2.6" fill="var(--primary)" />
    </svg>
  )
}

export default function Panel() {
  const [q, setQ] = useState('')
  const [estado, setEstado] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [seleccion, setSeleccion] = useState(['RG-26-004817', 'RG-26-004809'])

  // En el sistema real este filtro lo hace la API: GET /api/registros?q=&estado=&municipio=
  const filas = useMemo(() => {
    const t = q.trim().toLowerCase()
    return registros.filter((r) =>
      (!t || r.nombre.toLowerCase().includes(t) || r.folio.toLowerCase().includes(t)) &&
      (!estado || r.estado === estado) &&
      (!municipio || r.municipio === municipio))
  }, [q, estado, municipio])

  const todos = filas.length > 0 && filas.every((r) => seleccion.includes(r.folio))
  const algunos = filas.some((r) => seleccion.includes(r.folio))
  const toggle = (folio) => setSeleccion((s) => (s.includes(folio) ? s.filter((x) => x !== folio) : [...s, folio]))
  const toggleTodos = () => setSeleccion((s) => (todos ? s.filter((f) => !filas.some((r) => r.folio === f)) : [...new Set([...s, ...filas.map((r) => r.folio)])]))

  return (
    <>
      <div className="demo-bar">Simulación académica · Sin validez oficial</div>
      <div className="panel">
        <aside className="panel-side">
          <div>
            <p className="eyebrow">Operación</p>
            <nav className="side-nav" aria-label="Secciones del panel">
              <Link to="/panel" aria-current="page"><Icon name="list" />Registro de personas</Link>
              <Link to="/panel"><Icon name="checkSquare" />Validaciones<span className="count">{indicadores.pendientes}</span></Link>
              <Link to="/credencial"><Icon name="card" />Credenciales</Link>
              <Link to="/panel"><Icon name="clock" />Bitácora</Link>
              <Link to="/panel"><Icon name="users" />Usuarios y roles</Link>
            </nav>
          </div>
          <div className="user-chip"><span className="avatar">{operador.iniciales}</span><div><b>{operador.nombre}</b><small>{operador.puesto}</small></div></div>
        </aside>

        <div className="panel-main">
          <div className="panel-head">
            <div><h1>Registro de personas</h1><p>Datos de muestra</p></div>
            <Link className="btn btn-primary" to="/registro"><Icon name="plus" />Nuevo registro</Link>
          </div>

          <div className="kpis">
            <div className="kpi"><span className="label">Registros activos</span><span className="value">{fmt.format(indicadores.activos)}</span><span className="delta">+{indicadores.activosSemana} esta semana</span></div>
            <div className="kpi"><span className="label">Pendientes de validar</span><span className="value">{indicadores.pendientes}</span><span className="delta">{indicadores.pendientesViejos} con más de 48 h</span></div>
            <div className="kpi alert"><span className="label">Posibles duplicados</span><span className="value">{indicadores.duplicados}</span><span className="delta">Requieren revisión manual</span></div>
            <div className="kpi"><span className="label">Credenciales emitidas hoy</span><span className="value">{indicadores.emitidasHoy}</span><Sparkline values={indicadores.emitidas7dias} /></div>
          </div>

          <div className="toolbar">
            <div className="search">
              <Icon name="search" />
              <label htmlFor="p-q" className="sr-only">Buscar</label>
              <input id="p-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre o folio" />
            </div>
            <label htmlFor="p-estado" className="sr-only">Estado</label>
            <select id="p-estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              {Object.entries(estados).map(([k, v]) => <option key={k} value={k}>{v.texto}</option>)}
            </select>
            <label htmlFor="p-mun" className="sr-only">Municipio</label>
            <select id="p-mun" value={municipio} onChange={(e) => setMunicipio(e.target.value)}>
              <option value="">Todos los municipios</option>
              {municipios.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>

          {seleccion.length > 0 && (
            <div className="bulk-bar">
              <span>{seleccion.length} {seleccion.length === 1 ? 'seleccionado' : 'seleccionados'}</span>
              <button className="btn btn-sm btn-ghost" type="button">Validar</button>
              <button className="btn btn-sm btn-ghost" type="button">Exportar</button>
            </div>
          )}

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th><input type="checkbox" aria-label="Seleccionar todos" checked={todos} ref={(el) => { if (el) el.indeterminate = algunos && !todos }} onChange={toggleTodos} /></th>
                  <th>Persona</th><th>Folio</th><th>Municipio</th><th>Última actualización</th><th>Estado</th><th><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {filas.map((r) => {
                  const sel = seleccion.includes(r.folio)
                  const est = estados[r.estado]
                  return (
                    <tr key={r.folio} className={sel ? 'selected' : undefined}>
                      <td><input type="checkbox" checked={sel} onChange={() => toggle(r.folio)} aria-label={`Seleccionar a ${r.nombre}`} /></td>
                      <td><b>{r.nombre}</b><small>{r.edad} años · {r.sexo}</small></td>
                      <td className="mono nowrap">{r.folio}</td>
                      <td>{r.municipio}</td>
                      <td className="num nowrap">{r.actualizado}</td>
                      <td><span className={`pill ${est.clase}`}>{est.texto}</span></td>
                      <td><button className="btn btn-sm btn-ghost" type="button">{est.accion}</button></td>
                    </tr>
                  )
                })}
                {filas.length === 0 && <tr className="empty-row"><td colSpan={7}>No hay registros con esos filtros.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="table-foot">
            <span>Mostrando {filas.length} de {fmt.format(indicadores.activos)} registros</span>
            <div className="pager">
              <button type="button" aria-label="Página anterior">‹</button>
              <button type="button" aria-current="page">1</button>
              <button type="button">2</button>
              <button type="button">3</button>
              <button type="button" aria-label="Página siguiente">›</button>
            </div>
          </div>

          <section className="activity" aria-labelledby="bitacora-titulo">
            <h2 id="bitacora-titulo">Bitácora reciente</h2>
            <ol>
              {bitacora.map((b) => (
                <li key={b.titulo + b.hora} style={{ '--dot': DOT[b.tipo] }}>
                  <div><p><b>{b.titulo}</b> {b.detalle}</p><time>{b.hora} · {b.quien}</time></div>
                </li>
              ))}
            </ol>
            <Link to="/panel" className="btn btn-sm btn-ghost">Ver bitácora completa</Link>
          </section>
        </div>
      </div>
    </>
  )
}
