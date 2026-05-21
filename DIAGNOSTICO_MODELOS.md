# 🔍 Diagnóstico de Modelos 3D

## Problemas Identificados y Soluciones

### ❌ Problema 1: Cubos en lugar de modelos
**Causa:** Los modelos GLB no están cargando correctamente

**Soluciones aplicadas:**
1. ✅ Mejorado el manejo de errores en Model3D.jsx
2. ✅ Agregado console.log para debugging
3. ✅ Placeholder con wireframe para identificar

**Cómo verificar:**
1. Abre la consola del navegador (F12)
2. Busca mensajes como:
   - "Error cargando /models/base.glb"
   - "Mostrando placeholder para..."
3. Si ves estos mensajes, el problema está en los archivos GLB

### ❌ Problema 2: No se puede arrastrar en vista 3D
**Causa:** Las piezas no estaban visibles en vista 3D

**Solución aplicada:**
✅ Ahora las piezas aparecen abajo en la vista 3D también

### ❌ Problema 3: Solo se ve la mitad del recuadro
**Causa:** Altura del contenedor no estaba definida

**Solución aplicada:**
✅ Altura fija de 600px en scene-3d-container

---

## 🔧 Pasos para Verificar tus Modelos

### 1. Verificar que los archivos existen:

Abre la terminal y ejecuta:
\`\`\`bash
ls -la public/models/
\`\`\`

Deberías ver:
\`\`\`
base.glb
tower.glb
nacelle.glb
rotor.glb
\`\`\`

### 2. Verificar el tamaño de los archivos:

\`\`\`bash
ls -lh public/models/*.glb
\`\`\`

Los archivos deben tener tamaño > 0 bytes

### 3. Probar los modelos en un visor online:

1. Ve a: https://gltf-viewer.donmccurdy.com/
2. Arrastra cada archivo .glb
3. Verifica que se vean correctamente

Si NO se ven en el visor online, el problema está en los archivos GLB.

### 4. Verificar en la consola del navegador:

1. Abre http://localhost:5173/
2. Presiona F12 para abrir DevTools
3. Ve a la pestaña "Console"
4. Busca errores relacionados con:
   - "Failed to load"
   - "404"
   - "CORS"
   - "GLTFLoader"

---

## 🐛 Posibles Problemas y Soluciones

### Problema: Error 404 (No encontrado)

**Síntoma:** Console muestra "404 /models/base.glb"

**Causa:** Los archivos no están en la ubicación correcta

**Solución:**
\`\`\`bash
# Verifica la ruta exacta:
pwd
# Deberías estar en: .../turbina-eolica-educativa

# Verifica que la carpeta existe:
ls public/models/

# Si no existe, créala:
mkdir -p public/models

# Copia tus archivos:
cp /ruta/a/tus/modelos/*.glb public/models/
\`\`\`

### Problema: Modelos corruptos

**Síntoma:** Visor online no los muestra

**Causa:** Archivos GLB dañados o mal exportados

**Solución:**
1. Re-exporta desde Blender:
   - File > Export > glTF 2.0 (.glb)
   - Format: GLB (binary)
   - Include: Textures
   - Compression: None (por ahora)

2. O convierte de nuevo:
   - Ve a: https://products.aspose.app/3d/conversion
   - Sube tu modelo original
   - Descarga como GLB

### Problema: Modelos muy grandes

**Síntoma:** Carga muy lenta o timeout

**Causa:** Archivos > 10MB

**Solución:**
\`\`\`bash
# Ver tamaño:
ls -lh public/models/*.glb

# Si son muy grandes, optimiza en Blender:
# 1. Reduce polígonos (Decimate modifier)
# 2. Reduce texturas (2048x2048 máximo)
# 3. Exporta con compresión
\`\`\`

### Problema: CORS Error

**Síntoma:** Console muestra "CORS policy"

**Causa:** Archivos no están en public/

**Solución:**
Los archivos DEBEN estar en \`public/models/\`, no en \`src/\`

---

## ✅ Checklist de Verificación

Marca cada item:

- [ ] Los archivos .glb existen en \`public/models/\`
- [ ] Los archivos tienen tamaño > 0 bytes
- [ ] Los archivos se ven en https://gltf-viewer.donmccurdy.com/
- [ ] No hay errores 404 en la consola
- [ ] No hay errores CORS en la consola
- [ ] El servidor está corriendo (http://localhost:5173/)
- [ ] Refrescaste el navegador (Ctrl + Shift + R)

---

## 🔬 Test Manual

### Paso 1: Verificar carga de UN modelo

Abre la consola del navegador y ejecuta:

\`\`\`javascript
// Test de carga manual:
fetch('/models/base.glb')
  .then(response => {
    console.log('Status:', response.status)
    console.log('OK:', response.ok)
    console.log('Size:', response.headers.get('content-length'))
  })
  .catch(error => console.error('Error:', error))
\`\`\`

**Resultado esperado:**
\`\`\`
Status: 200
OK: true
Size: [número de bytes]
\`\`\`

**Si ves Status: 404:**
Los archivos no están en la ubicación correcta.

### Paso 2: Verificar GLTFLoader

\`\`\`javascript
// En la consola:
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
const loader = new GLTFLoader()
loader.load('/models/base.glb', 
  (gltf) => console.log('✅ Modelo cargado:', gltf),
  (progress) => console.log('Progreso:', progress),
  (error) => console.error('❌ Error:', error)
)
\`\`\`

---

## 📊 Información de tus Modelos

Para ayudarte mejor, necesito saber:

1. **Tamaño de archivos:**
\`\`\`bash
ls -lh public/models/*.glb
\`\`\`

2. **Origen de los modelos:**
- ¿Los creaste en Blender?
- ¿Los descargaste?
- ¿Los convertiste de otro formato?

3. **Formato original:**
- ¿FBX?
- ¿OBJ?
- ¿Ya eran GLB?

4. **Errores en consola:**
- Copia y pega los errores exactos que ves en F12

---

## 🚀 Solución Rápida

Si nada funciona, prueba esto:

### Opción 1: Usar modelos de prueba

\`\`\`bash
# Descarga modelos de prueba:
cd public/models/

# Descarga un modelo simple de prueba
# (Necesitarás buscar modelos GLB gratuitos online)
\`\`\`

### Opción 2: Verificar permisos

\`\`\`bash
# En Windows PowerShell:
Get-ChildItem public/models/*.glb

# Verifica que los archivos sean legibles
\`\`\`

### Opción 3: Reiniciar servidor

\`\`\`bash
# Detén el servidor (Ctrl + C)
# Limpia caché:
rm -rf node_modules/.vite

# Reinicia:
npm run dev
\`\`\`

---

## 📞 Información para Debugging

Cuando veas la consola (F12), busca:

1. **Errores rojos** - Problemas críticos
2. **Warnings amarillos** - Advertencias
3. **Mensajes azules** - Información

Copia y pega los mensajes que veas relacionados con:
- "models"
- "GLTFLoader"
- "404"
- "Failed to load"

---

## 💡 Próximos Pasos

1. **Abre la consola** (F12)
2. **Refresca la página** (Ctrl + Shift + R)
3. **Ve a la pestaña Console**
4. **Busca errores**
5. **Copia los errores** y dime qué ves

Con esa información podré ayudarte mejor a resolver el problema específico de tus modelos.
