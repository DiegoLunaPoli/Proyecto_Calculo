import './ComparisonPanel.css'
import { useGameStore } from '../store/gameStore'

const comparisons = [
  {
    id: 'phone',
    name: 'Celulares',
    icon: '📱',
    consumption: 0.01, // kWh para cargar un celular
    color: '#4caf50'
  },
  {
    id: 'laptop',
    name: 'Laptops',
    icon: '💻',
    consumption: 0.05, // kWh para cargar una laptop
    color: '#2196f3'
  },
  {
    id: 'tv',
    name: 'Televisores',
    icon: '📺',
    consumption: 0.1, // kWh para 1 hora de TV
    color: '#ff9800'
  },
  {
    id: 'fridge',
    name: 'Refrigeradores',
    icon: '🧊',
    consumption: 0.15, // kWh por hora
    color: '#9c27b0'
  },
  {
    id: 'house',
    name: 'Casas',
    icon: '🏠',
    consumption: 1.0, // kWh promedio por hora
    color: '#f44336'
  }
]

function ComparisonPanel() {
  const { energy, showPopup } = useGameStore()

  const handleInfoClick = () => {
    showPopup('devices')
  }

  const calculateUnits = (consumption) => {
    if (energy === 0) return 0
    return Math.floor(energy / consumption)
  }

  return (
    <div className="comparison-panel">
      <div className="panel-header">
        <span className="panel-icon">🔌</span>
        <h3>¿Qué puedes alimentar?</h3>
        <button className="info-button" onClick={handleInfoClick} title="Más información">
          ℹ️
        </button>
      </div>
      
      <div className="comparison-grid">
        {comparisons.map((item) => {
          const units = calculateUnits(item.consumption)
          return (
            <div key={item.id} className="comparison-item" style={{ borderColor: item.color }}>
              <div className="item-icon">{item.icon}</div>
              <div className="item-info">
                <div className="item-name">{item.name}</div>
                <div className="item-count" style={{ color: item.color }}>
                  {units > 0 ? (
                    <>
                      <span className="count-number">{units}</span>
                      <span className="count-label">{units === 1 ? 'unidad' : 'unidades'}</span>
                    </>
                  ) : (
                    <span className="count-label">Necesitas más viento</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="eco-message">
        <div className="eco-icon">🌍</div>
        <p>¡Estás ayudando al planeta con energía limpia!</p>
      </div>
    </div>
  )
}

export default ComparisonPanel
