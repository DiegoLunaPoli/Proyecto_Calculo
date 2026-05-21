import { create } from 'zustand'

export const useGameStore = create((set, get) => ({
  // Estado del tutorial
  showTutorial: true,
  tutorialStep: 0,
  closeTutorial: () => set({ showTutorial: false }),
  nextTutorialStep: () => set((state) => ({ tutorialStep: state.tutorialStep + 1 })),
  
  // Estado del juego
  currentLevel: 1,
  score: 0,
  turbineComplete: false,
  isSpinning: false,
  
  // Control de gestos
  handTrackingEnabled: false,
  toggleHandTracking: () => set((state) => ({ handTrackingEnabled: !state.handTrackingEnabled })),
  
  // Popup de información
  activePopup: null,
  showPopup: (type) => set({ activePopup: type }),
  closePopup: () => set({ activePopup: null }),
  
  // Pieza seleccionada con gestos
  selectedPiece: null,
  selectPiece: (pieceId) => set({ selectedPiece: pieceId }),
  deselectPiece: () => set({ selectedPiece: null }),
  
  // Piezas de la turbina
  pieces: [
    { id: 'base', name: 'Base', placed: false, position: null, correctPosition: { x: 0, y: -2, z: 0 } },
    { id: 'tower', name: 'Torre', placed: false, position: null, correctPosition: { x: 0, y: 0, z: 0 } },
    { id: 'nacelle', name: 'Góndola', placed: false, position: null, correctPosition: { x: 0, y: 2, z: 0 } },
    { id: 'rotor', name: 'Rotor', placed: false, position: null, correctPosition: { x: 0, y: 2, z: 1 } },
  ],
  
  // Parámetros de viento y energía
  windSpeed: 10, // m/s
  energy: 0, // kWh
  power: 0, // kW
  
  // Acciones
  placePiece: (pieceId, position) => {
    const pieces = get().pieces
    const piece = pieces.find(p => p.id === pieceId)
    
    if (!piece || piece.placed) {
      return false
    }
    
    const correctPos = piece.correctPosition
    
    // Verificar si está cerca de la posición correcta (tolerancia más amplia)
    const distance = Math.sqrt(
      Math.pow(position.x - correctPos.x, 2) +
      Math.pow(position.y - correctPos.y, 2) +
      Math.pow(position.z - correctPos.z, 2)
    )
    
    const isCorrect = distance < 1.5
    
    if (isCorrect) {
      set((state) => ({
        pieces: state.pieces.map(p =>
          p.id === pieceId
            ? { ...p, placed: true, position: correctPos }
            : p
        ),
        score: state.score + 100
      }))
      
      // Verificar si todas las piezas están colocadas
      const updatedPieces = get().pieces
      const allPlaced = updatedPieces.every(p => p.placed)
      if (allPlaced) {
        set({ turbineComplete: true })
      }
      
      return true
    }
    
    return false
  },
  
  setWindSpeed: (speed) => {
    set({ windSpeed: speed })
    get().calculateEnergy()
  },
  
  startSpinning: () => {
    set({ isSpinning: true })
    get().calculateEnergy()
  },
  
  stopSpinning: () => {
    set({ isSpinning: false, power: 0 })
  },
  
  calculateEnergy: () => {
    const { windSpeed, isSpinning } = get()
    
    if (!isSpinning) {
      set({ power: 0, energy: 0 })
      return
    }
    
    // Fórmula simplificada: P = 0.5 * ρ * A * V³ * Cp
    // ρ (densidad del aire) = 1.225 kg/m³
    // A (área del rotor) = π * r² (asumimos r = 2m para niños)
    // Cp (coeficiente de potencia) = 0.4 (simplificado)
    
    const airDensity = 1.225
    const rotorRadius = 2 // metros
    const rotorArea = Math.PI * rotorRadius * rotorRadius
    const powerCoefficient = 0.4
    
    // Potencia en Watts
    const powerWatts = 0.5 * airDensity * rotorArea * Math.pow(windSpeed, 3) * powerCoefficient
    
    // Convertir a kiloWatts
    const powerKW = powerWatts / 1000
    
    // Energía generada por hora (kWh)
    const energyKWh = powerKW
    
    set({ 
      power: Math.round(powerKW * 100) / 100,
      energy: Math.round(energyKWh * 100) / 100
    })
  },
  
  resetGame: () => {
    set({
      turbineComplete: false,
      isSpinning: false,
      score: 0,
      energy: 0,
      power: 0,
      windSpeed: 10,
      pieces: [
        { id: 'base', name: 'Base', placed: false, position: null, correctPosition: { x: 0, y: -2, z: 0 } },
        { id: 'tower', name: 'Torre', placed: false, position: null, correctPosition: { x: 0, y: 0, z: 0 } },
        { id: 'nacelle', name: 'Góndola', placed: false, position: null, correctPosition: { x: 0, y: 2, z: 0 } },
        { id: 'rotor', name: 'Rotor', placed: false, position: null, correctPosition: { x: 0, y: 2, z: 1 } },
      ]
    })
  },
  
  nextLevel: () => {
    set((state) => ({
      currentLevel: state.currentLevel + 1,
      turbineComplete: false,
      isSpinning: false,
      pieces: [
        { id: 'base', name: 'Base', placed: false, position: null, correctPosition: { x: 0, y: -2, z: 0 } },
        { id: 'tower', name: 'Torre', placed: false, position: null, correctPosition: { x: 0, y: 0, z: 0 } },
        { id: 'nacelle', name: 'Góndola', placed: false, position: null, correctPosition: { x: 0, y: 2, z: 0 } },
        { id: 'rotor', name: 'Rotor', placed: false, position: null, correctPosition: { x: 0, y: 2, z: 1 } },
      ]
    }))
  }
}))
