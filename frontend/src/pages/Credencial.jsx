import Icon from '../components/Icon.jsx'
import { IdCardBack, IdCardFront } from '../components/IdCard.jsx'
import { credencial } from '../data/mock.js'
import useCardColor, { CARD_COLORS } from '../hooks/useCardColor.js'

export default function Credencial() {
  const { color, choose, style } = useCardColor()
  return (
    <div className="container page">
      <div className="panel-box cred">
        <div className="cred-head">
          <div>
            <p className="eyebrow">Mi credencial</p>
            <h1>Credencial digital</h1>
            <p>Tu credencial en formato tarjeta estándar. Presenta el código QR para verificar su vigencia.</p>
          </div>
          {/* Pendiente: el PDF lo generará el backend, con la marca MUESTRA aplicada en el servidor */}
          <button className="btn btn-primary" type="button"><Icon name="download" />Descargar PDF</button>
        </div>

        <fieldset className="card-colors">
          <legend>Color de tu credencial</legend>
          <div className="swatches">
            {CARD_COLORS.map((c) => (
              <label key={c.id} className="swatch" htmlFor={`cc-${c.id}`}>
                <input type="radio" id={`cc-${c.id}`} name="card-color" checked={color.id === c.id} onChange={() => choose(c.id)} />
                <i style={{ background: `linear-gradient(135deg, ${c.a}, ${c.b})` }} />
                {c.nombre}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="cards" style={style}>
          <div className="card-cap"><p className="eyebrow">Anverso</p><IdCardFront data={credencial} /></div>
          <div className="card-cap"><p className="eyebrow">Reverso</p><IdCardBack data={credencial} /></div>
        </div>
      </div>
    </div>
  )
}
