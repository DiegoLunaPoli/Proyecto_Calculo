import './EnergyDisplay.css'
import { useGameStore } from '../store/gameStore'

function EnergyDisplay() {
  const { power, energy, isSpinning, turbineComplete, showPopup } = useGameStore()

  const handleInfoClick = () => {
    showPopup('energy')
  }

  if (!turbineComplete) {
    return (
      <div className="energy-display">
        <div className="display-header">
          <span className="header-icon">⚡</span>
          <h3>Energía Generada</h3>
        </div>
        <div className="display-content">
          <p className="waiting-message">
            Completa la turbina para ver la energía generada
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="energy-display">
      <div className="display-header">
        <span className="header-icon">⚡</span>
        <h3>Energía Generada</h3>
        <button className="info-button" onClick={handleInfoClick} title="Más información">
          ℹ️
        </button>
      </div>
      
      <div className="display-content">
        {isSpinning ? (
          <>
            <div className="energy-metric">
              <div className="metric-label">Potencia</div>
              <div className="metric-value power-value">
                {power.toFixed(2)}
                <span className="metric-unit">kW</span>
              </div>
            </div>
            
            <div className="energy-metric">
              <div className="metric-label">Energía por Hora</div>
              <div className="metric-value energy-value">
                {energy.toFixed(2)}
                <span className="metric-unit">kWh</span>
              </div>
            </div>
            
            <div className="energy-bar">
              <div 
                className="energy-fill" 
                style={{ width: `${Math.min((power / 5) * 100, 100)}%` }}
              ></div>
            </div>
            
            <div className="fun-fact">
              <span className="fact-icon">💡</span>
              <p>¡Estás generando energía limpia!</p>
            </div>
          </>
        ) : (
          <div className="start-prompt">
            <span className="prompt-icon">🌬️</span>
            <p>Ajusta el viento y presiona "Girar" para generar energía</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EnergyDisplay
