import Icon from '../components/Icon.jsx'
import { IdCardBack, IdCardFront } from '../components/IdCard.jsx'
import { credencial } from '../data/mock.js'

export default function Credencial() {
  return (
    <>
      <div className="demo-bar">Simulación académica · Sin validez oficial</div>
      <div className="container page">
        <div className="panel-box cred">
          <div className="cred-head">
            <div>
              <p className="eyebrow">Diseño propio · 85.6 × 54 mm</p>
              <h1>Credencial digital simulada</h1>
              <p>Formato tarjeta estándar. La marca MUESTRA y la leyenda del reverso van siempre impresas; no se pueden desactivar.</p>
            </div>
            {/* Pendiente: el PDF lo generará el backend, con la marca MUESTRA aplicada en el servidor */}
            <button className="btn btn-primary" type="button"><Icon name="download" />Descargar PDF de muestra</button>
          </div>

          <div className="cards">
            <div className="card-cap"><p className="eyebrow">Anverso · pasa el mouse encima</p><IdCardFront data={credencial} /></div>
            <div className="card-cap"><p className="eyebrow">Reverso</p><IdCardBack data={credencial} /></div>
          </div>

          <div className="notes">
            <div className="note"><b>Seguridad simulada</b><p>Holograma que cambia con el movimiento, imagen fantasma de la foto, microtexto y chip. Son efectos visuales para la demostración.</p></div>
            <div className="note"><b>Nomenclatura segura</b><p>“Folio de registro” y “clave ficticia” en lugar de términos electorales, como acordamos en el análisis legal.</p></div>
            <div className="note"><b>Identidad propia</b><p>Franja verde, blanco y rojo, pero sin escudo ni composición de ninguna credencial oficial. La marca MUESTRA no se puede quitar.</p></div>
          </div>
        </div>
      </div>
    </>
  )
}
