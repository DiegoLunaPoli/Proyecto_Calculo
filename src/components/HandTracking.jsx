import { useEffect, useRef, useState } from 'react'
import { Hands } from '@mediapipe/hands'
import { Camera } from '@mediapipe/camera_utils'
import './HandTracking.css'

// ── Helpers de geometría ─────────────────────────────────────────────────────
const dist2d = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)

function HandTracking({ onHandMove, onPinch, onRelease, enabled }) {
  const videoRef   = useRef(null)
  const canvasRef  = useRef(null)
  const [isReady,    setIsReady]    = useState(false)
  const [loadStatus, setLoadStatus] = useState('Cargando modelo...') // estado de carga detallado
  const [gesture,    setGesture]    = useState('none')
  const [cursorPos,  setCursorPos]  = useState({ x: -200, y: -200 })

  const lastGesture      = useRef('none')
  const gestureDebounce  = useRef(0)
  const smoothPos        = useRef({ x: 0.5, y: 0.5 })
  const lastScrollY      = useRef(null)   // para calcular delta de scroll
  const isReadyRef       = useRef(false)
  const onHandMoveRef = useRef(onHandMove)
  const onPinchRef    = useRef(onPinch)
  const onReleaseRef  = useRef(onRelease)

  useEffect(() => { onHandMoveRef.current = onHandMove }, [onHandMove])
  useEffect(() => { onPinchRef.current    = onPinch    }, [onPinch])
  useEffect(() => { onReleaseRef.current  = onRelease  }, [onRelease])

  useEffect(() => {
    if (!enabled || !videoRef.current) return

    // ── Procesar cada frame ────────────────────────────────────────────────
    const processResults = (results) => {
      // Primer frame recibido = modelo cargado y funcionando
      if (!isReadyRef.current) {
        isReadyRef.current = true
        setIsReady(true)
        setLoadStatus('')
      }

      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.save()
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (!results.multiHandLandmarks?.length) {
        ctx.restore()
        return
      }

      const lm = results.multiHandLandmarks[0]

      // ── Dibujar mano completa ────────────────────────────────────────────
      const CONNECTIONS = [
        [0,1],[1,2],[2,3],[3,4],
        [0,5],[5,6],[6,7],[7,8],
        [0,9],[9,10],[10,11],[11,12],
        [0,13],[13,14],[14,15],[15,16],
        [0,17],[17,18],[18,19],[19,20],
        [5,9],[9,13],[13,17]
      ]
      ctx.strokeStyle = 'rgba(33,150,243,0.7)'
      ctx.lineWidth = 2
      CONNECTIONS.forEach(([a, b]) => {
        ctx.beginPath()
        ctx.moveTo(lm[a].x * canvas.width, lm[a].y * canvas.height)
        ctx.lineTo(lm[b].x * canvas.width, lm[b].y * canvas.height)
        ctx.stroke()
      })
      lm.forEach((p, i) => {
        ctx.beginPath()
        ctx.arc(p.x * canvas.width, p.y * canvas.height, i === 8 ? 9 : 5, 0, 2 * Math.PI)
        ctx.fillStyle = i === 8 ? '#ff5722' : '#2196f3'
        ctx.fill()
      })

      // ── Detectar gesto con debounce ──────────────────────────────────────
      // PINZA: distancia 2D entre punta del pulgar (4) y punta del índice (8)
      const pinchDist = dist2d(lm[4], lm[8])
      const isPinch   = pinchDist < 0.06

      // SEÑALANDO: índice extendido (punta más arriba que la base)
      const indexExtended = lm[8].y < lm[5].y - 0.04

      const rawGesture = isPinch ? 'pinch' : indexExtended ? 'pointing' : 'none'

      // Debounce: solo salir de 'pinch' si se mantiene no-pinch por 4 frames
      // Esto evita que un ángulo difícil momentáneo suelte el agarre
      if (rawGesture !== 'pinch') {
        gestureDebounce.current = (gestureDebounce.current || 0) + 1
      } else {
        gestureDebounce.current = 0
      }
      const DEBOUNCE_FRAMES = 4
      const currentGesture = (lastGesture.current === 'pinch' && gestureDebounce.current < DEBOUNCE_FRAMES)
        ? 'pinch'   // mantener pinch hasta confirmar que realmente soltó
        : rawGesture

      // ── Posición suavizada del índice ────────────────────────────────────
      // Invertimos X porque el video está espejado
      const rawX = 1 - lm[8].x
      const rawY = lm[8].y
      const SMOOTH = 0.3
      smoothPos.current.x += (rawX - smoothPos.current.x) * SMOOTH
      smoothPos.current.y += (rawY - smoothPos.current.y) * SMOOTH

      const sx = smoothPos.current.x * window.innerWidth
      const sy = smoothPos.current.y * window.innerHeight

      setCursorPos({ x: sx, y: sy })
      setGesture(currentGesture)

      // ── Disparar eventos de mouse ────────────────────────────────────────
      const fire = (type) => {
        // Siempre disparar en el documento (para drag global y mouseup)
        document.dispatchEvent(new MouseEvent(type, {
          bubbles: true, cancelable: true, view: window,
          clientX: sx, clientY: sy, screenX: sx, screenY: sy, button: 0
        }))
        // También en el elemento bajo el cursor (para clicks y hover)
        const el = document.elementFromPoint(sx, sy)
        if (el && el !== document.body && el !== document.documentElement) {
          el.dispatchEvent(new MouseEvent(type, {
            bubbles: true, cancelable: true, view: window,
            clientX: sx, clientY: sy, screenX: sx, screenY: sy, button: 0
          }))
        }
      }

      // Siempre disparar mousemove (para hover y arrastre)
      fire('mousemove')

      // ── Scroll por gestos ────────────────────────────────────────────────
      // Solo hace scroll cuando la mano está en el 20% inferior de la pantalla
      // Así no interfiere con el movimiento normal del cursor
      const inScrollZone = smoothPos.current.y > 0.80

      if (currentGesture === 'pointing' && inScrollZone) {
        const prevY = lastScrollY.current
        if (prevY !== null) {
          const dy = (smoothPos.current.y - prevY) * window.innerHeight
          if (Math.abs(dy) > 0.5) {
            // Scroll proporcional a qué tan abajo está la mano
            // Más abajo = scroll más rápido
            const intensity = (smoothPos.current.y - 0.80) / 0.20  // 0 a 1
            window.scrollBy({ top: dy * 5 * (1 + intensity), behavior: 'auto' })
          }
        }
        lastScrollY.current = smoothPos.current.y
      } else if (!inScrollZone || currentGesture !== 'pointing') {
        lastScrollY.current = null
      }

      // Callback de movimiento para App.jsx
      if (onHandMoveRef.current) {
        onHandMoveRef.current({
          x: smoothPos.current.x,
          y: smoothPos.current.y,
          isPinching: currentGesture === 'pinch'
        })
      }

      // Transición de gestos
      if (currentGesture === 'pinch' && lastGesture.current !== 'pinch') {
        // Inicio de agarre → mousedown
        fire('mousedown')
        if (onPinchRef.current) {
          onPinchRef.current({ x: smoothPos.current.x, y: smoothPos.current.y })
        }
      }

      if (currentGesture !== 'pinch' && lastGesture.current === 'pinch') {
        // Fin de agarre → mouseup + click
        fire('mouseup')
        fire('click')
        if (onReleaseRef.current) {
          onReleaseRef.current({ x: smoothPos.current.x, y: smoothPos.current.y })
        }
      }

      lastGesture.current = currentGesture

      // ── Indicador visual del gesto en el canvas ──────────────────────────
      if (currentGesture === 'pinch') {
        // Círculo verde entre pulgar e índice
        const mx = ((lm[4].x + lm[8].x) / 2) * canvas.width
        const my = ((lm[4].y + lm[8].y) / 2) * canvas.height
        ctx.beginPath()
        ctx.arc(mx, my, 22, 0, 2 * Math.PI)
        ctx.fillStyle = 'rgba(76,175,80,0.4)'
        ctx.fill()
        ctx.strokeStyle = '#4caf50'
        ctx.lineWidth = 3
        ctx.stroke()
      } else if (currentGesture === 'pointing') {
        ctx.beginPath()
        ctx.arc(lm[8].x * canvas.width, lm[8].y * canvas.height, 18, 0, 2 * Math.PI)
        ctx.fillStyle = 'rgba(255,87,34,0.35)'
        ctx.fill()
        ctx.strokeStyle = '#ff5722'
        ctx.lineWidth = 3
        ctx.stroke()
      }

      ctx.restore()
    }

    // ── Inicializar MediaPipe ────────────────────────────────────────────────
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    })
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    })
    hands.onResults(processResults)

    // Inicializar cámara — arrancamos directamente como antes.
    // isReady se pone en true en el PRIMER frame procesado por MediaPipe
    // (dentro de processResults), no al arrancar la cámara, para asegurarnos
    // de que el modelo ya está cargado antes de mostrar "Cámara Activa".
    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) await hands.send({ image: videoRef.current })
      },
      width: 640,
      height: 480
    })

    setLoadStatus('Cargando modelo...')
    camera.start().catch((err) => {
      console.error('Error iniciando cámara:', err)
      setLoadStatus('Error al iniciar cámara. Verifica los permisos.')
    })

    // Timeout: si en 15 segundos no llega ningún frame, mostrar aviso
    const timeoutId = setTimeout(() => {
      if (!isReadyRef.current) {
        setLoadStatus('Tarda más de lo normal. Verifica tu conexión o recarga.')
      }
    }, 15000)

    return () => {
      clearTimeout(timeoutId)
      isReadyRef.current = false
      camera.stop()
      hands.close()
    }
  }, [enabled])

  if (!enabled) return null

  const gestureLabel = {
    none:     '',
    pointing: '☝️ Moviendo',
    pinch:    '🤏 Agarrando',
  }

  return (
    <>
      {/* Cursor virtual sobre toda la pantalla */}
      <div
        className={`hand-cursor gesture-${gesture}`}
        style={{ left: cursorPos.x, top: cursorPos.y }}
        aria-hidden="true"
      />

      <div className="hand-tracking-container">
        {/* Instrucciones y estado — ENCIMA de la cámara, no dentro */}
        <div className="camera-info-bar">
          <div className={`status-indicator ${isReady ? 'active' : 'loading'}`}>
            <span className="status-dot"></span>
            {isReady ? 'Cámara Activa' : loadStatus}
          </div>
          {gesture !== 'none' && (
            <div className={`pinch-indicator gesture-badge-${gesture}`}>
              {gestureLabel[gesture]}
            </div>
          )}
          <div className="instructions-inline">
            <span>☝️ Mover</span>
            <span>🤏 Agarrar</span>
            <span>☝️↓ Scroll</span>
          </div>
        </div>

        {/* Solo video + canvas — sin overlays que tapen la mano */}
        <div className="camera-view">
          <video ref={videoRef} className="input-video" />
          <canvas ref={canvasRef} className="output-canvas" width="640" height="480" />
        </div>
      </div>
    </>
  )
}

export default HandTracking
