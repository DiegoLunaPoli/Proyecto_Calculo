# 🌬️ Turbina Eólica Educativa - Instrucciones

## 📋 Cambios Realizados

### ✨ Mejoras Implementadas:

1. **Sistema de Drag & Drop Mejorado**
   - Ahora las piezas se colocan correctamente en sus marcadores
   - Tolerancia ampliada para facilitar el juego
   - Feedback visual mejorado (mensajes más grandes y claros)
   - Las piezas ya no se "pierden" al arrastrarlas

2. **Diseño Profesional de Piezas**
   - ❌ Eliminados los emojis
   - ✅ Piezas dibujadas con CSS puro
   - **Base**: Plataforma marrón con soporte
   - **Torre**: Cilindro gris metálico con detalles
   - **Góndola**: Caja azul con efectos 3D
   - **Rotor**: 3 aspas blancas con centro negro

3. **Turbina Ensamblada Mejorada**
   - Diseño más realista y detallado
   - Mejor proporción entre las piezas
   - Animación de giro más suave (3 segundos por rotación)
   - Sombras y efectos de profundidad

4. **Colores por Pieza**
   - Base: Naranja claro
   - Torre: Azul claro
   - Góndola: Celeste
   - Rotor: Morado claro

## 🎮 Cómo Jugar:

1. **Inicio**: Aparece un tutorial de 4 pasos
2. **Armar**: Arrastra cada pieza a su marcador correspondiente
   - Base → Abajo
   - Torre → Centro
   - Góndola → Arriba de la torre
   - Rotor → Frente de la góndola
3. **Generar Energía**: 
   - Ajusta el viento con el slider (0-20 m/s)
   - Presiona "¡Girar Turbina!"
4. **Ver Resultados**: 
   - Potencia generada (kW)
   - Energía por hora (kWh)
   - Comparación con dispositivos

## 🔧 Comandos Disponibles:

```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## 🌐 Acceso:

- **Local**: http://localhost:5173/
- **Red**: Usa `npm run dev -- --host` para acceder desde otros dispositivos

## 📱 Responsive:

- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1024px)
- ✅ Móvil (< 768px)

## 🎨 Características:

- ✅ Diseño animado y colorido
- ✅ Sistema de puntuación
- ✅ Tutorial interactivo
- ✅ Cálculos físicos reales
- ✅ Comparaciones educativas
- ✅ Sin dependencias pesadas (solo React + Zustand)
- ✅ Carga rápida

## 🐛 Solución de Problemas:

Si algo no funciona:

1. Detén el servidor (Ctrl + C)
2. Ejecuta: `npm install`
3. Ejecuta: `npm run dev`
4. Refresca el navegador con Ctrl + Shift + R

## 📦 Dependencias:

- React 18.2.0
- Zustand 4.4.7 (manejo de estado)
- Vite 5.x (bundler rápido)

## 🚀 Para Producción:

```bash
npm run build
```

Esto genera una carpeta `dist/` que puedes subir a cualquier hosting estático (Vercel, Netlify, GitHub Pages, etc.)
