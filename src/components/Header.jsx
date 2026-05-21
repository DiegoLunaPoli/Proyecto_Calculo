import './Header.css'
import { useGameStore } from '../store/gameStore'

function Header() {
  const { score, resetGame } = useGameStore()

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <div className="wind-icon">🌬️</div>
          <h1 className="title">
            <span className="title-main">Turbina Eólica</span>
            <span className="title-sub">Aprende Jugando</span>
          </h1>
        </div>
        
        <div className="score-section">
          <div className="score-card">
            <span className="score-label">⭐ Puntos</span>
            <span className="score-value">{score}</span>
          </div>
          
          <button className="reset-button" onClick={resetGame}>
            🔄 Reiniciar
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
