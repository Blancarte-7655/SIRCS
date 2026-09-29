import Icon from '../components/Icon.jsx'
import { IdCardBack, IdCardFront } from '../components/IdCard.jsx'
import { credencial } from '../data/mock.js'

export default function Credencial() {
  return (
    <>
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

          <div className="cards">
            <div className="card-cap"><p className="eyebrow">Anverso</p><IdCardFront data={credencial} /></div>
            <div className="card-cap"><p className="eyebrow">Reverso</p><IdCardBack data={credencial} /></div>
          </div>

        </div>
      </div>
    </>
  )
}
