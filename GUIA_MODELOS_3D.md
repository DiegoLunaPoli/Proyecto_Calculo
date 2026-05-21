# 🎨 Guía Completa: Cómo Integrar Modelos 3D en la Aplicación

## 📦 Paso 1: Preparar tus Modelos 3D

### Formatos Soportados:
- **GLB** (recomendado) - Formato binario compacto
- **GLTF** - Formato JSON con archivos externos
- **FBX** - Requiere conversión
- **OBJ** - Requiere conversión

### Convertir a GLB (si es necesario):
1. Ve a: https://products.aspose.app/3d/conversion
2. Sube tu modelo (FBX, OBJ, etc.)
3. Selecciona "GLB" como formato de salida
4. Descarga el archivo convertido

### Estructura de Archivos Recomendada:
```
turbina-eolica-educativa/
├── public/
│   └── models/
│       ├── base.glb          # Modelo de la base
│       ├── tower.glb         # Modelo de la torre
│       ├── nacelle.glb       # Modelo de la góndola
│       ├── rotor.glb         # Modelo del rotor
│       └── turbine-complete.glb  # Turbina completa (opcional)
```

## 🔧 Paso 2: Crear la Carpeta de Modelos

Ejecuta en la terminal:
```bash
mkdir public/models
```

Luego copia tus archivos .glb a esa carpeta.

## 💻 Paso 3: Crear el Componente de Modelo 3D

Ya he instalado Three.js y React Three Fiber. Ahora crea este componente:

### Archivo: `src/components/Model3D.jsx`

```jsx
import { useRef, useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useGameStore } from '../store/gameStore'

function Model3D({ modelPath, position, rotation, scale, pieceId, isPlaced }) {
  const meshRef = useRef()
  const gltf = useLoader(GLTFLoader, modelPath)

  useEffect(() => {
    if (meshRef.current) {
      // Aplicar sombras
      meshRef.current.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [gltf])

  return (
    <primitive
      ref={meshRef}
      object={gltf.scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  )
}

export default Model3D
```

### Archivo: `src/components/Scene3D.jsx`

```jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import Model3D from './Model3D'
import { useGameStore } from '../store/gameStore'
import './Scene3D.css'

function Scene3D() {
  const { pieces, turbineComplete, isSpinning } = useGameStore()

  return (
    <div className="scene-3d-container">
      <Canvas
        camera={{ position: [5, 3, 5], fov: 50 }}
        shadows
      >
        {/* Iluminación */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />

        {/* Entorno */}
        <Environment preset="sunset" />
        
        {/* Sombras de contacto */}
        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={4}
        />

        {/* Modelos 3D de las piezas */}
        {pieces.map((piece) => {
          if (piece.placed) {
            return (
              <Model3D
                key={piece.id}
                modelPath={\`/models/\${piece.id}.glb\`}
                position={[
                  piece.correctPosition.x,
                  piece.correctPosition.y,
                  piece.correctPosition.z
                ]}
                rotation={[0, 0, 0]}
                scale={1}
                pieceId={piece.id}
                isPlaced={true}
              />
            )
          }
          return null
        })}

        {/* Rotor girando */}
        {turbineComplete && isSpinning && (
          <group rotation={[0, Date.now() * 0.001, 0]}>
            <Model3D
              modelPath="/models/rotor.glb"
              position={[0, 2, 1]}
              rotation={[0, 0, 0]}
              scale={1}
              pieceId="rotor"
              isPlaced={true}
            />
          </group>
        )}

        {/* Controles de cámara */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={10}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}

export default Scene3D
```

### Archivo: `src/components/Scene3D.css`

```css
.scene-3d-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  border-radius: 15px;
  overflow: hidden;
  background: linear-gradient(180deg, #87ceeb 0%, #98d8c8 100%);
}
```

## 🎮 Paso 4: Integrar en GameArea

Reemplaza el contenido de `GameArea.jsx` con:

```jsx
import { useState, useRef } from 'react'
import './GameArea.css'
import { useGameStore } from '../store/gameStore'
import TurbinePiece from './TurbinePiece'
import Scene3D from './Scene3D'

function GameArea() {
  const { pieces, turbineComplete, isSpinning } = useGameStore()
  const [use3D, setUse3D] = useState(true) // Toggle entre 2D y 3D

  return (
    <div className="game-area">
      <div className="view-toggle">
        <button 
          className={\`toggle-btn \${!use3D ? 'active' : ''}\`}
          onClick={() => setUse3D(false)}
        >
          2D
        </button>
        <button 
          className={\`toggle-btn \${use3D ? 'active' : ''}\`}
          onClick={() => setUse3D(true)}
        >
          3D
        </button>
      </div>

      <div className="game-canvas">
        {use3D ? (
          <Scene3D />
        ) : (
          // Tu vista 2D actual
          <div className="build-zone">
            {/* ... código 2D existente ... */}
          </div>
        )}

        {/* Piezas disponibles */}
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
      </div>
    </div>
  )
}

export default GameArea
```

## 📝 Paso 5: Optimizar tus Modelos 3D

### Recomendaciones:
1. **Tamaño de archivo**: Máximo 5MB por modelo
2. **Polígonos**: Entre 5,000 - 20,000 triángulos
3. **Texturas**: Máximo 2048x2048 px
4. **Formato**: GLB (incluye texturas embebidas)

### Herramientas de Optimización:
- **Blender**: File > Export > glTF 2.0 > Opciones de compresión
- **gltf-pipeline**: Herramienta de línea de comandos
  ```bash
  npm install -g gltf-pipeline
  gltf-pipeline -i input.glb -o output.glb -d
  ```

## 🎨 Paso 6: Ajustar Escala y Posición

Si tus modelos se ven muy grandes/pequeños o mal posicionados:

```jsx
// En Scene3D.jsx, ajusta estos valores:
<Model3D
  modelPath="/models/base.glb"
  position={[0, -2, 0]}      // [x, y, z]
  rotation={[0, 0, 0]}       // [x, y, z] en radianes
  scale={0.5}                // Escala (1 = tamaño original)
  pieceId="base"
  isPlaced={true}
/>
```

### Valores de Referencia:
- **Base**: position: [0, -2, 0], scale: 1
- **Torre**: position: [0, 0, 0], scale: 1
- **Góndola**: position: [0, 2, 0], scale: 0.8
- **Rotor**: position: [0, 2, 1], scale: 1.2

## 🔍 Paso 7: Probar tus Modelos

1. Coloca tus archivos .glb en `public/models/`
2. Reinicia el servidor: `npm run dev`
3. Abre http://localhost:5173/
4. Activa el modo 3D con el botón toggle
5. Arrastra las piezas para verlas en 3D

## 🐛 Solución de Problemas

### Modelo no se ve:
- Verifica la ruta: `/models/nombre.glb`
- Revisa la consola del navegador (F12)
- Asegúrate que el archivo esté en `public/models/`

### Modelo muy grande/pequeño:
- Ajusta el parámetro `scale` (0.1 a 2.0)
- En Blender: Apply Scale antes de exportar

### Modelo sin color:
- Asegúrate que las texturas estén embebidas en el GLB
- En Blender: Export > Include > Textures

### Modelo mal orientado:
- Ajusta `rotation`: [Math.PI/2, 0, 0] = 90° en X
- En Blender: Apply Rotation antes de exportar

## 📚 Recursos Adicionales

### Modelos 3D Gratuitos:
- **Sketchfab**: https://sketchfab.com/
- **TurboSquid Free**: https://www.turbosquid.com/Search/3D-Models/free
- **CGTrader Free**: https://www.cgtrader.com/free-3d-models

### Tutoriales:
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- Three.js: https://threejs.org/docs/
- Blender to GLB: https://www.youtube.com/results?search_query=blender+export+glb

## 🎯 Ejemplo Completo

Si tienes un archivo llamado `turbina-base.glb`:

1. Cópialo a: `public/models/base.glb`
2. El componente lo cargará automáticamente
3. Ajusta posición/escala si es necesario
4. ¡Listo!

---

## 💡 Tip Final

Para ver cómo se ve tu modelo antes de integrarlo:
1. Ve a: https://gltf-viewer.donmccurdy.com/
2. Arrastra tu archivo .glb
3. Verifica que se vea bien
4. Luego intégralo en la app
