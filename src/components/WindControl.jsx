import { useRef } from 'react'
import './WindControl.css'
import { useGameStore } from '../store/gameStore'

function WindControl() {
  const { windSpeed, setWindSpeed, isSpinning, startSpinning, stopSpinning, resetGame } = useGameStore()
  const sliderRef   = useRef(null)
  const draggingRef = useRef(false)

  // ── Helpers ──────────────────────────────────────────────────────────────
  const getWindDescription = (speed) => {
    if (speed < 5)  return { text: 'Brisa suave',      emoji: '🍃', color: '#a8e6cf' }
    if (speed < 10) return { text: 'Viento moderado',  emoji: '💨', color: '#ffd3b6' }
    if (speed < 15) return { text: 'Viento fuerte',    emoji: '🌬️', color: '#ffaaa5' }
    return              { text: 'Viento muy fuerte',   emoji: '🌪️', color: '#ff8b94' }
  }

  // Convierte posición X del cursor a valor del slider (0-20)
  const posToValue = (clientX) => {
    const rect = sliderRef.current?.getBoundingClientRect()
    if (!rect) return windSpeed
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return Math.round(ratio * 20 * 2) / 2  // paso 0.5
  }

  // ── Handlers del slider (mouse + gestos) ─────────────────────────────────
  const handleSliderMouseDown = (e) => {
    draggingRef.current = true
    setWindSpeed(posToValue(e.clientX))

    const onMove = (ev) => {
      if (!draggingRef.current) return
      setWindSpeed(posToValue(ev.clientX))
    }
    const onUp = () => {
      draggingRef.current = false
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup',   onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup',   onUp)
  }

  const windInfo = getWindDescription(windSpeed)

  return (
    <div className="wind-control">
      <div className="control-header">
        <span className="control-icon">{windInfo.emoji}</span>
        <h3>Control de Viento</h3>
      </div>

      <div className="wind-info" style={{ background: windInfo.color }}>
        <div className="wind-speed-display">
          <span className="speed-value">{windSpeed}</span>
          <span className="speed-unit">m/s</span>
        </div>
        <div className="wind-description">{windInfo.text}</div>
      </div>

      {/* Slider personalizado — responde a mouse Y a eventos simulados por gestos */}
      <div className="slider-container">
        <div
          ref={sliderRef}
          className="wind-slider-track"
          onMouseDown={handleSliderMouseDown}
        >
          <div
            className="wind-slider-fill"
            style={{ width: `${(windSpeed / 20) * 100}%` }}
          />
          <div
            className="wind-slider-thumb"
            style={{ left: `${(windSpeed / 20) * 100}%` }}
          />
        </div>
        <div className="slider-labels">
          <span>0 m/s</span>
          <span>10 m/s</span>
          <span>20 m/s</span>
        </div>
      </div>

      <button
        className={`spin-button ${isSpinning ? 'spinning' : ''}`}
        onClick={isSpinning ? stopSpinning : startSpinning}
      >
        {isSpinning ? (
          <><span className="button-icon">⏸️</span>Detener</>
        ) : (
          <><span className="button-icon">▶️</span>¡Girar Turbina!</>
        )}
      </button>

      <button className="reset-button" onClick={resetGame}>
        🔄 Reiniciar juego
      </button>

      <div className="wind-tips">
        <div className="tip-icon">💡</div>
        <p>Tip: Más viento = más energía generada</p>
      </div>
    </div>
  )
}

export default WindControl
