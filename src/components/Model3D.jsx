import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

// Precargar todos los modelos al inicio
useGLTF.preload('/models/base.glb')
useGLTF.preload('/models/tower.glb')
useGLTF.preload('/models/nacelle.glb')
useGLTF.preload('/models/rotor.glb')

function Model3D({ modelPath, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF(modelPath)

  // Los modelos ya tienen su escala interna (matrix 0.01 en el nodo raíz)
  // NO clonar — usar la escena directamente para evitar problemas de materiales
  // Cada pieza se monta/desmonta independientemente así que no hay conflicto
  return (
    <primitive
      object={scene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  )
}

export default Model3D
