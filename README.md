# 🌬️ Turbina Eólica Educativa - Proyecto Completo

## 🎯 Descripción del Proyecto

Aplicación web interactiva educativa para enseñar a niños sobre turbinas eólicas y energía renovable mediante juegos y reconocimiento de gestos.

## ✨ Características Implementadas

### 🎮 Funcionalidades Principales:
- ✅ **Drag & Drop mejorado** - Arrastra piezas con el mouse
- ✅ **Reconocimiento de manos** - Control por gestos con MediaPipe (pulgar + índice)
- ✅ **Piezas visuales detalladas** - Diseños CSS profesionales sin emojis
- ✅ **Sistema de información educativa** - Pop-ups con datos interesantes
- ✅ **Cálculos físicos reales** - Fórmula de potencia eólica
- ✅ **Comparaciones prácticas** - Cuántos dispositivos puedes alimentar
- ✅ **Tutorial interactivo** - 4 pasos para aprender a jugar
- ✅ **Soporte para modelos 3D** - Integración con Three.js
- ✅ **Diseño responsive** - Funciona en móviles, tablets y desktop
- ✅ **Animaciones fluidas** - CSS animations para mejor UX

### 🎨 Componentes Creados:

1. **Header** - Logo, puntuación y botón de reinicio
2. **Tutorial** - Guía paso a paso
3. **GameArea** - Área principal del juego
4. **TurbinePiece** - Piezas arrastrables con diseños detallados
5. **HandTracking** - Reconocimiento de gestos con cámara
6. **InfoPopup** - Ventanas educativas con información
7. **EnergyDisplay** - Muestra energía generada
8. **WindControl** - Control de velocidad del viento
9. **ComparisonPanel** - Comparación con dispositivos
10. **Scene3D** - Escena 3D con Three.js (para modelos)
11. **Model3D** - Cargador de modelos GLB

## 🚀 Cómo Usar

### Iniciar el Proyecto:
\`\`\`bash
cd turbina-eolica-educativa
npm run dev
\`\`\`

Abre: **http://localhost:5173/**

### Controles:

#### 🖱️ Modo Mouse (Por defecto):
1. Arrastra las piezas a sus marcadores
2. Suelta cerca del marcador correcto
3. La pieza se "enganchará" automáticamente

#### ✋ Modo Gestos (Clic en "✋ Gestos ON"):
1. Permite acceso a la cámara
2. Junta pulgar e índice para "agarrar"
3. Mueve la mano para arrastrar
4. Separa dedos para "soltar"

#### ℹ️ Información Educativa:
- Haz clic en cualquier pieza para ver información
- Haz clic en el botón ℹ️ en Energía o Dispositivos
- Lee datos interesantes y curiosidades

## 📚 Archivos Importantes

### Guías:
- **INSTRUCCIONES.md** - Instrucciones básicas del proyecto
- **GUIA_MODELOS_3D.md** - Cómo integrar tus modelos 3D
- **README.md** - Este archivo

### Componentes Principales:
- `src/App.jsx` - Componente principal
- `src/store/gameStore.js` - Estado global con Zustand
- `src/components/HandTracking.jsx` - Reconocimiento de gestos
- `src/components/InfoPopup.jsx` - Pop-ups educativos
- `src/components/Scene3D.jsx` - Escena 3D

## 🎨 Integrar tus Modelos 3D

### Paso Rápido:
1. Coloca tus archivos `.glb` en `public/models/`
2. Nombra los archivos: `base.glb`, `tower.glb`, `nacelle.glb`, `rotor.glb`
3. Reinicia el servidor
4. ¡Listo! Los modelos se cargarán automáticamente

### Guía Completa:
Lee **GUIA_MODELOS_3D.md** para instrucciones detalladas sobre:
- Convertir formatos (FBX, OBJ → GLB)
- Optimizar modelos
- Ajustar escala y posición
- Solucionar problemas comunes

## 🛠️ Tecnologías Utilizadas

- **React 18.2** - Framework principal
- **Vite 5.x** - Build tool rápido
- **Zustand 4.4** - Manejo de estado
- **MediaPipe Hands** - Reconocimiento de gestos
- **Three.js** - Renderizado 3D
- **React Three Fiber** - Three.js para React
- **@react-three/drei** - Helpers para R3F
- **CSS3** - Animaciones y estilos

## 📦 Estructura del Proyecto

\`\`\`
turbina-eolica-educativa/
├── public/
│   └── models/              # Coloca tus modelos 3D aquí
│       ├── base.glb
│       ├── tower.glb
│       ├── nacelle.glb
│       └── rotor.glb
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Tutorial.jsx
│   │   ├── GameArea.jsx
│   │   ├── TurbinePiece.jsx
│   │   ├── HandTracking.jsx
│   │   ├── InfoPopup.jsx
│   │   ├── EnergyDisplay.jsx
│   │   ├── WindControl.jsx
│   │   ├── ComparisonPanel.jsx
│   │   ├── Scene3D.jsx
│   │   └── Model3D.jsx
│   ├── store/
│   │   └── gameStore.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── GUIA_MODELOS_3D.md
├── INSTRUCCIONES.md
├── README.md
└── package.json
\`\`\`

## 🎓 Contenido Educativo

### Información Disponible:
- **Base**: Estructura, peso, materiales
- **Torre**: Altura, construcción, función
- **Góndola**: Componentes internos, generador
- **Rotor**: Aspas, velocidad, aerodinámica
- **Energía**: Cómo funciona, beneficios ambientales
- **Dispositivos**: Comparaciones de consumo

### Datos Curiosos:
- Cada sección tiene un "¿Sabías que...?"
- Comparaciones con objetos cotidianos
- Datos técnicos simplificados para niños

## 🔧 Comandos Disponibles

\`\`\`bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run preview      # Vista previa de build

# Mantenimiento
npm install          # Instala dependencias
npm run lint         # Revisa código
\`\`\`

## 🌐 Despliegue

### Opciones Gratuitas:
1. **Vercel** (Recomendado)
   \`\`\`bash
   npm install -g vercel
   vercel
   \`\`\`

2. **Netlify**
   - Arrastra la carpeta `dist/` a netlify.com

3. **GitHub Pages**
   \`\`\`bash
   npm run build
   # Sube la carpeta dist/ a gh-pages
   \`\`\`

## 📱 Responsive

- ✅ Desktop (1400px+) - Vista completa
- ✅ Laptop (1024px - 1400px) - Optimizado
- ✅ Tablet (768px - 1024px) - Layout vertical
- ✅ Móvil (< 768px) - Interfaz simplificada

## 🐛 Solución de Problemas

### El servidor no inicia:
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
npm run dev
\`\`\`

### La cámara no funciona:
- Permite permisos de cámara en el navegador
- Usa HTTPS o localhost
- Verifica que no esté en uso por otra app

### Los modelos 3D no cargan:
- Verifica que estén en `public/models/`
- Revisa la consola del navegador (F12)
- Lee GUIA_MODELOS_3D.md

### Piezas no se colocan:
- Arrastra cerca del marcador (tolerancia 150px)
- Verifica que no estén ya colocadas
- Refresca la página (Ctrl + Shift + R)

## 📊 Fórmulas Físicas

### Potencia Eólica:
\`\`\`
P = 0.5 × ρ × A × V³ × Cp

Donde:
- P = Potencia (Watts)
- ρ = Densidad del aire (1.225 kg/m³)
- A = Área del rotor (π × r²)
- V = Velocidad del viento (m/s)
- Cp = Coeficiente de potencia (0.4)
\`\`\`

## 🎯 Próximas Mejoras (Opcionales)

- [ ] Turbina vertical (segundo nivel)
- [ ] Más niveles de dificultad
- [ ] Sistema de logros
- [ ] Modo multijugador
- [ ] Exportar resultados como PDF
- [ ] Sonidos y música
- [ ] Más idiomas

## 👨‍💻 Desarrollo

Proyecto desarrollado para materia universitaria.
Enfocado en educación infantil sobre energía renovable.

## 📄 Licencia

Proyecto educativo - Uso libre para fines académicos

---

## 🎉 ¡Listo para Usar!

El servidor está corriendo en: **http://localhost:5173/**

1. Abre el navegador
2. Completa el tutorial
3. Arrastra las piezas
4. Haz clic en ℹ️ para aprender
5. Activa gestos si tienes cámara
6. ¡Diviértete aprendiendo!

**¿Tienes modelos 3D?** → Lee GUIA_MODELOS_3D.md
**¿Problemas?** → Revisa la sección "Solución de Problemas"
