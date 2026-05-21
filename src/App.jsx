import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Tutorial from './components/Tutorial'
import GameArea from './components/GameArea'
import EnergyDisplay from './components/EnergyDisplay'
import WindControl from './components/WindControl'
import ComparisonPanel from './components/ComparisonPanel'
import HandTracking from './components/HandTracking'
import InfoPopup from './components/InfoPopup'
import InfoPanel from './components/InfoPanel'
import { useGameStore } from './store/gameStore'

function App() {
  const { 
    showTutorial, 
    turbineComplete, 
    isSpinning,
    currentLevel,
    handTrackingEnabled,
    toggleHandTracking,
    activePopup,
    closePopup,
    selectedPiece,
    selectPiece,
    deselectPiece,
    placePiece
  } = useGameStore()

  const [handPosition, setHandPosition] = useState({ x: 0, y: 0 })

  const handleHandMove = ({ x, y, isPinching }) => {
    setHandPosition({ x, y })
    
    if (isPinching && selectedPiece) {
      // Actualizar posición visual de la pieza seleccionada
      const piece = document.querySelector(`[data-piece-id="${selectedPiece}"]`)
      if (piece) {
        piece.style.left = `${x * window.innerWidth}px`
        piece.style.top = `${y * window.innerHeight}px`
      }
    }
  }

  const handlePinch = ({ x, y }) => {
    // Detectar qué pieza está bajo el cursor
    const elements = document.elementsFromPoint(x * window.innerWidth, y * window.innerHeight)
    const pieceElement = elements.find(el => el.classList.contains('turbine-piece'))
    
    if (pieceElement) {
      const pieceId = pieceElement.getAttribute('data-piece-id')
      selectPiece(pieceId)
    }
  }

  const handleRelease = ({ x, y }) => {
    if (selectedPiece) {
      // Intentar colocar la pieza
      const buildZone = document.querySelector('.build-zone')
      const marker = document.querySelector(`.marker-${selectedPiece}`)
      
      if (buildZone && marker) {
        const markerRect = marker.getBoundingClientRect()
        const dropX = x * window.innerWidth
        const dropY = y * window.innerHeight
        
        const distance = Math.sqrt(
          Math.pow(dropX - (markerRect.left + markerRect.width / 2), 2) +
          Math.pow(dropY - (markerRect.top + markerRect.height / 2), 2)
        )
        
        if (distance < 150) {
          const pieces = useGameStore.getState().pieces
          const piece = pieces.find(p => p.id === selectedPiece)
          if (piece) {
            placePiece(selectedPiece, piece.correctPosition)
          }
        }
      }
      
      deselectPiece()
    }
  }

  return (
    <div className="app">
      <Header />
      
      {showTutorial && <Tutorial />}
      {activePopup && <InfoPopup type={activePopup} onClose={closePopup} />}
      
      <div className="main-container">
        <div className="game-section">
          <div className="level-indicator">
            <span className="level-badge">Nivel {currentLevel}</span>
            <button 
              className={`hand-tracking-toggle ${handTrackingEnabled ? 'active' : ''}`}
              onClick={toggleHandTracking}
              title={handTrackingEnabled ? 'Desactivar control por gestos' : 'Activar control por gestos'}
            >
              {handTrackingEnabled ? '✋ Gestos ON' : '🖱️ Mouse'}
            </button>
          </div>
          
          <GameArea />
          
          {turbineComplete && (
            <div className="controls-panel">
              <WindControl />
            </div>
          )}
        </div>
        
        <div className="info-section">
          <InfoPanel />
          <EnergyDisplay />
          {isSpinning && <ComparisonPanel />}
        </div>
      </div>
      
      {handTrackingEnabled && (
        <HandTracking
          onHandMove={handleHandMove}
          onPinch={handlePinch}
          onRelease={handleRelease}
          enabled={handTrackingEnabled}
        />
      )}
      
      <div className="floating-clouds">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
      </div>
    </div>
  )
}

export default App
