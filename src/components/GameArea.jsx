import { useState, useRef } from 'react'
import './GameArea.css'
import { useGameStore } from '../store/gameStore'
import TurbinePiece from './TurbinePiece'
import Scene3D from './Scene3D'

function GameArea() {
  const { pieces, turbineComplete, isSpinning, windSpeed } = useGameStore()
  const [use3D, setUse3D] = useState(true)
  const gameAreaRef = useRef(null)

  // Velocidad de rotación adaptable al viento: 0 m/s → parado, 20 m/s → muy rápido
  // Duración de la animación en segundos (menor = más rápido)
  const rotationDuration = isSpinning && windSpeed > 0
    ? Math.max(0.4, 6 - (windSpeed / 20) * 5.6)  // 6s a 0.4s
    : 0

  return (
    <div className="game-area" ref={gameAreaRef}>
      <div className="view-toggle">
        <button 
          className={`toggle-btn ${!use3D ? 'active' : ''}`}
          onClick={() => setUse3D(false)}
          title="Vista 2D con diseños CSS"
        >
          🎨 Vista 2D
        </button>
        <button 
          className={`toggle-btn ${use3D ? 'active' : ''}`}
          onClick={() => setUse3D(true)}
          title="Vista 3D con tus modelos"
        >
          🎮 Vista 3D
        </button>
      </div>

      <div className="game-canvas">
        {use3D ? (
          <>
            {/* Layout 3D: marcadores HTML a la izquierda + canvas a la derecha */}
            <div className="layout-3d">
              {/* Panel de marcadores — orden correcto: rotor arriba, base abajo */}
              {!turbineComplete && (
                <div className="markers-panel-3d">
                  <p className="markers-title-3d">📍 Zona de armado</p>
                  <div className="markers-list-3d">
                    {['rotor','nacelle','tower','base'].map(id => {
                      const piece = pieces.find(p => p.id === id)
                      const labels = { base:'🏗️ Base', tower:'🏢 Torre', nacelle:'📦 Góndola', rotor:'⚙️ Rotor' }
                      return (
                        <div
                          key={id}
                          className={`marker-3d-html marker-${id} ${piece?.placed ? 'placed' : ''}`}
                          data-piece={id}
                        >
                          <span className="marker-3d-html-label">{labels[id]}</span>
                          {piece?.placed
                            ? <span className="marker-placed-badge">✅ Colocada</span>
                            : <span className="marker-3d-html-hint">Suelta aquí</span>
                          }
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Canvas 3D */}
              <div className="canvas-3d-wrapper">
                <Scene3D />
              </div>
            </div>

            {/* Piezas disponibles debajo */}
            {!turbineComplete && (
              <div className="pieces-container pieces-3d">
                <h3 className="pieces-title">🧩 Arrastra las Piezas al panel de armado</h3>
                <div className="pieces-grid">
                  {pieces.filter(p => !p.placed).map((piece) => (
                    <TurbinePiece key={piece.id} piece={piece} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="build-zone">
              <div className={`turbine-assembly ${turbineComplete ? 'complete' : ''}`}>
                {turbineComplete ? (
                  <div className="assembled-turbine">
                    {/* Rotor con velocidad dinámica según el viento */}
                    <div
                      className="turbine-rotor"
                      style={rotationDuration > 0 ? {
                        animation: `rotate ${rotationDuration}s linear infinite`
                      } : {}}
                    >
                      <div className="blade blade-1"></div>
                      <div className="blade blade-2"></div>
                      <div className="blade blade-3"></div>
                    </div>
                    <div className="turbine-nacelle"></div>
                    <div className="turbine-tower"></div>
                    <div className="turbine-base"></div>
                  </div>
                ) : (
                  <div className="assembly-guide">
                    <div className="guide-text">
                      <span className="guide-icon">👆</span>
                      <p>Arrastra las piezas aquí para armar la turbina</p>
                    </div>
                    <div className="position-markers">
                      <div className="marker marker-base" data-piece="base">Base</div>
                      <div className="marker marker-tower" data-piece="tower">Torre</div>
                      <div className="marker marker-nacelle" data-piece="nacelle">Góndola</div>
                      <div className="marker marker-rotor" data-piece="rotor">Rotor</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {!turbineComplete && (
              <div className="pieces-container">
                <h3 className="pieces-title">🧩 Piezas Disponibles</h3>
                <div className="pieces-grid">
                  {pieces.filter(p => !p.placed).map((piece) => (
                    <TurbinePiece key={piece.id} piece={piece} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {turbineComplete && !isSpinning && !use3D && (
          <div className="completion-message">
            <div className="message-content">
              <span className="celebration-icon">🎉</span>
              <h3>¡Excelente trabajo!</h3>
              <p>Ahora ajusta el viento y haz girar la turbina</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameArea
