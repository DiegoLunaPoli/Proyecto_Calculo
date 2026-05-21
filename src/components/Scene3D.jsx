import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Model3D from './Model3D'
import { useGameStore } from '../store/gameStore'
import './Scene3D.css'

// Los modelos tienen escala interna 0.01 * 3.94 ≈ 0.0394
// Rotor bbox en coords modelo: x[-3.79, 7.20] y[12.83, 25.33] z[0.47, 0.94]
// Centroide real de vértices en Three.js: [0.023, 0.748, 0.033]
const ROTOR_CENTER = [0.023, 0.748, 0.033]

function RotatingRotor() {
  const pivotRef = useRef()
  const { isSpinning, windSpeed } = useGameStore()

  useFrame((_, delta) => {
    if (pivotRef.current && isSpinning && windSpeed > 0) {
      const speed = 0.5 + (windSpeed / 20) * 3.5
      pivotRef.current.rotation.z += delta * speed
    }
  })

  return (
    <group position={ROTOR_CENTER}>
      <group ref={pivotRef}>
        <group position={[-ROTOR_CENTER[0], -ROTOR_CENTER[1], -ROTOR_CENTER[2]]}>
          <Suspense fallback={null}>
            <Model3D modelPath="/models/rotor.glb" />
          </Suspense>
        </group>
      </group>
    </group>
  )
}

function SceneContent() {
  const { pieces, turbineComplete } = useGameStore()

  return (
    <>
      {/* Iluminación */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 5, 3]} intensity={1.5} castShadow />
      <directionalLight position={[-3, 3, -3]} intensity={0.6} />

      {/* Suelo — a y=0 donde empieza la base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#7ec87e" />
      </mesh>

      {/* Modelos colocados — todos en [0,0,0], sus matrices internas los posicionan */}
      {pieces.map((piece) => {
        if (!piece.placed || piece.id === 'rotor') return null
        return (
          <Suspense key={piece.id} fallback={null}>
            <Model3D modelPath={`/models/${piece.id}.glb`} />
          </Suspense>
        )
      })}

      {/* Rotor giratorio */}
      {turbineComplete && pieces.find(p => p.id === 'rotor')?.placed && (
        <RotatingRotor />
      )}

      {/* Cámara apunta al centro de la turbina (y≈0.5) */}
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={1}
        maxDistance={10}
        target={[0, 0.5, 0]}
      />
    </>
  )
}

function Scene3D() {
  return (
    <div className="scene-3d-container">
      <Canvas
        camera={{ position: [2, 1, 2], fov: 50 }}
        shadows
        style={{ background: 'linear-gradient(180deg, #87ceeb 0%, #b8e4c9 100%)' }}
      >
        <SceneContent />
      </Canvas>

      <div className="scene-controls">
        <p>🖱️ Arrastra para rotar · 🔍 Scroll para zoom</p>
      </div>
    </div>
  )
}

export default Scene3D
