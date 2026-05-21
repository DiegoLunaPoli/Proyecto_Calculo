import { useState } from 'react'
import './Tutorial.css'
import { useGameStore } from '../store/gameStore'

const tutorialSteps = [
  {
    title: '¡Bienvenido! 🎉',
    content: '¡Hola! Vamos a aprender sobre las turbinas eólicas de una forma muy divertida. ¿Estás listo para la aventura?',
    icon: '👋'
  },
  {
    title: '¿Qué es una turbina eólica? 🌬️',
    content: 'Una turbina eólica es como un molino gigante que usa el viento para crear electricidad. ¡Es energía limpia y renovable!',
    icon: '💨'
  },
  {
    title: 'Tu misión 🎯',
    content: 'Debes armar la turbina arrastrando las piezas con el mouse. Coloca cada pieza en su lugar correcto.',
    icon: '🎮'
  },
  {
    title: 'Genera energía ⚡',
    content: 'Cuando termines de armar la turbina, podrás hacerla girar y ver cuánta energía produce. ¡Ajusta el viento para ver diferentes resultados!',
    icon: '⚡'
  }
]

function Tutorial() {
  const [currentStep, setCurrentStep] = useState(0)
  const { closeTutorial } = useGameStore()

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      closeTutorial()
    }
  }

  const handleSkip = () => {
    closeTutorial()
  }

  const step = tutorialSteps[currentStep]

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-modal">
        <div className="tutorial-icon">{step.icon}</div>
        
        <h2 className="tutorial-title">{step.title}</h2>
        
        <p className="tutorial-content">{step.content}</p>
        
        <div className="tutorial-progress">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`progress-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            />
          ))}
        </div>
        
        <div className="tutorial-buttons">
          <button className="skip-button" onClick={handleSkip}>
            Saltar
          </button>
          <button className="next-button" onClick={handleNext}>
            {currentStep < tutorialSteps.length - 1 ? 'Siguiente' : '¡Empezar!'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Tutorial
