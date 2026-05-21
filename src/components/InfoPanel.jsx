import './InfoPanel.css'
import { useGameStore } from '../store/gameStore'

const PIECES_INFO = [
  { id: 'base',    label: '🏗️ Base',    color: '#ff9800' },
  { id: 'tower',   label: '🏢 Torre',   color: '#9e9e9e' },
  { id: 'nacelle', label: '📦 Góndola', color: '#2196f3' },
  { id: 'rotor',   label: '⚙️ Rotor',   color: '#4caf50' },
  { id: 'energy',  label: '⚡ Energía', color: '#ffc107' },
]

function InfoPanel() {
  const { showPopup } = useGameStore()

  return (
    <div className="info-panel-side">
      <p className="info-panel-title">ℹ️ Info</p>
      <div className="info-panel-buttons">
        {PIECES_INFO.map(({ id, label, color }) => (
          <button
            key={id}
            className="info-panel-btn"
            style={{ '--btn-color': color }}
            onClick={() => showPopup(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default InfoPanel
