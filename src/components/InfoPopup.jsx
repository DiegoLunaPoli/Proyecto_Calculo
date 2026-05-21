import { useEffect } from 'react'
import './InfoPopup.css'

const infoData = {
  base: {
    title: '🏗️ Base de la Turbina',
    description: 'La base es la estructura que sostiene toda la turbina eólica. Debe ser muy fuerte y estable.',
    facts: [
      'Generalmente está hecha de concreto reforzado',
      'Puede pesar hasta 400 toneladas',
      'Se ancla profundamente en el suelo',
      'Soporta vientos de más de 200 km/h',
    ],
    funFact: '💡 ¿Sabías que la base de una turbina grande puede tener hasta 20 metros de diámetro?',
  },
  tower: {
    title: '🏢 Torre',
    description: 'La torre eleva las aspas a mayor altura donde el viento es más fuerte y constante.',
    facts: [
      'Puede medir entre 60 y 120 metros de altura',
      'Está hecha de acero tubular',
      'Tiene una escalera interior para mantenimiento',
      'Más altura = más energía generada',
    ],
    funFact: '💡 ¡Una torre de 100 metros es tan alta como un edificio de 30 pisos!',
  },
  nacelle: {
    title: '📦 Góndola (Nacelle)',
    description: 'La góndola contiene el generador y todos los componentes que convierten el movimiento en electricidad.',
    facts: [
      'Contiene el generador eléctrico',
      'Tiene un sistema de frenos de seguridad',
      'Puede girar 360° para seguir el viento',
      'Pesa entre 50 y 100 toneladas',
    ],
    funFact: '💡 Dentro de la góndola hay sensores que detectan la dirección del viento automáticamente.',
  },
  rotor: {
    title: '⚙️ Rotor y Aspas',
    description: 'Las aspas capturan la energía del viento y la convierten en movimiento rotatorio.',
    facts: [
      'Cada aspa puede medir hasta 80 metros',
      'Están hechas de fibra de vidrio o carbono',
      'Giran entre 10 y 20 revoluciones por minuto',
      'Su forma aerodinámica es similar a un ala de avión',
    ],
    funFact: '💡 ¡La punta de un aspa puede moverse a más de 300 km/h, más rápido que un auto de carreras!',
  },
  energy: {
    title: '⚡ Energía Eólica',
    description: 'La energía eólica es la energía obtenida del viento. Es limpia, renovable y no contamina.',
    facts: [
      'Una turbina grande puede alimentar 1,500 hogares',
      'No produce gases de efecto invernadero',
      'El viento es gratis e inagotable',
      'Reduce la dependencia de combustibles fósiles',
    ],
    funFact: '💡 En un año, una turbina puede evitar la emisión de 4,000 toneladas de CO₂.',
  },
  devices: {
    title: '🔌 Usos de la Energía',
    description: 'La electricidad generada por turbinas eólicas puede alimentar todo tipo de dispositivos.',
    facts: [
      '📱 Un celular necesita 0.01 kWh para cargarse',
      '💻 Una laptop consume 0.05 kWh por carga',
      '📺 Un TV usa 0.1 kWh por hora',
      '🏠 Una casa promedio usa 1 kWh por hora',
    ],
    funFact: '💡 ¡Con el viento de un día, una turbina puede cargar más de 100,000 celulares!',
  },
}

function InfoPopup({ type, onClose }) {
  const info = infoData[type]

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (!info) return null

  return (
    <div className="info-popup-overlay" onClick={onClose}>
      <div className="info-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>{info.title}</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="popup-content">
          <p className="description">{info.description}</p>

          <div className="facts-section">
            <h3>📚 Datos Interesantes:</h3>
            <ul className="facts-list">
              {info.facts.map((fact, i) => (
                <li key={i} className="fact-item">
                  <span className="fact-bullet">•</span>
                  {fact}
                </li>
              ))}
            </ul>
          </div>

          <div className="fun-fact">{info.funFact}</div>
        </div>

        <button className="got-it-button" onClick={onClose}>
          ¡Entendido! 👍
        </button>
      </div>
    </div>
  )
}

export default InfoPopup
