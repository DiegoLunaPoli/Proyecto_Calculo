import { useState, useRef, useEffect } from 'react'
import './TurbinePiece.css'
import { useGameStore } from '../store/gameStore'

function TurbinePiece({ piece }) {
  const [isDragging, setIsDragging] = useState(false)

  const pieceRef      = useRef(null)
  const ghostRef      = useRef(null)
  const dragging      = useRef(false)
  const offset        = useRef({ x: 0, y: 0 })
  const startClient   = useRef({ x: 0, y: 0 })
  const originRect    = useRef(null)   // posición original para volver si falla
  const rafId         = useRef(null)
  const currentPos    = useRef({ x: 0, y: 0 })
  const moveHandler   = useRef(null)
  const upHandler     = useRef(null)

  const { placePiece, showPopup } = useGameStore()

  useEffect(() => {
    return () => {
      if (moveHandler.current) document.removeEventListener('mousemove', moveHandler.current)
      if (upHandler.current)   document.removeEventListener('mouseup',   upHandler.current)
      if (rafId.current)       cancelAnimationFrame(rafId.current)
      removeGhost()
    }
  }, [])

  // ── Ghost DOM (sin re-renders de React) ──────────────────────────────────
  const createGhost = (rect) => {
    const ghost = pieceRef.current.cloneNode(true)
    ghost.style.cssText = `
      position: fixed;
      width: ${rect.width}px;
      height: ${rect.height}px;
      left: ${rect.left}px;
      top: ${rect.top}px;
      z-index: 9998;
      pointer-events: none;
      opacity: 0.88;
      transform: scale(1.05);
      transition: none;
      margin: 0;
      box-shadow: 0 16px 40px rgba(0,0,0,0.3);
    `
    document.body.appendChild(ghost)
    ghostRef.current = ghost
  }

  const moveGhost = (x, y) => {
    if (!ghostRef.current) return
    ghostRef.current.style.left = `${x}px`
    ghostRef.current.style.top  = `${y}px`
  }

  // Anima el ghost de vuelta al origen y luego lo elimina
  const returnGhostToOrigin = () => {
    if (!ghostRef.current || !originRect.current) {
      removeGhost()
      return
    }
    const g = ghostRef.current
    g.style.transition = 'left 0.25s ease, top 0.25s ease, opacity 0.25s ease'
    g.style.left    = `${originRect.current.left}px`
    g.style.top     = `${originRect.current.top}px`
    g.style.opacity = '0'
    setTimeout(() => { if (g.parentNode) g.remove() }, 260)
    ghostRef.current = null
  }

  const removeGhost = () => {
    if (ghostRef.current) {
      ghostRef.current.remove()
      ghostRef.current = null
    }
  }

  // ── Intentar colocar en el marcador ─────────────────────────────────────
  const finishDrag = (dropX, dropY, moved) => {
    dragging.current = false
    cancelAnimationFrame(rafId.current)
    setIsDragging(false)

    document.removeEventListener('mousemove', moveHandler.current)
    document.removeEventListener('mouseup',   upHandler.current)

    if (!moved) {
      removeGhost()
      showPopup(piece.id)
      return
    }

    // Buscar marcador — funciona tanto en vista 2D (.marker-X) como 3D (.marker-3d-html.marker-X)
    const marker = document.querySelector(`.marker-${piece.id}`)
    if (marker) {      const mr   = marker.getBoundingClientRect()
      const cx   = mr.left + mr.width  / 2
      const cy   = mr.top  + mr.height / 2
      const dist = Math.sqrt((dropX - cx) ** 2 + (dropY - cy) ** 2)
      const tol  = Math.max(mr.width, mr.height) / 2 + 20

      if (dist < tol) {
        removeGhost()
        const ok = placePiece(piece.id, piece.correctPosition)
        if (ok) showFeedback('¡Perfecto! ✨', 'success')
        return
      }
    }

    // Drop inválido → ghost vuelve al origen con animación
    returnGhostToOrigin()
    showFeedback('Intenta colocarlo en el lugar correcto 🎯', 'warning')
  }

  // ── Inicio del arrastre ──────────────────────────────────────────────────
  const onMouseDown = (e) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()

    const rect = pieceRef.current.getBoundingClientRect()
    offset.current      = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    startClient.current = { x: e.clientX, y: e.clientY }
    originRect.current  = { left: rect.left, top: rect.top }
    currentPos.current  = { x: rect.left, y: rect.top }

    dragging.current = true
    setIsDragging(true)
    createGhost(rect)

    const loop = () => {
      moveGhost(currentPos.current.x, currentPos.current.y)
      rafId.current = requestAnimationFrame(loop)
    }
    rafId.current = requestAnimationFrame(loop)

    moveHandler.current = (ev) => {
      if (!dragging.current) return
      currentPos.current = {
        x: ev.clientX - offset.current.x,
        y: ev.clientY - offset.current.y,
      }
    }

    upHandler.current = (ev) => {
      if (!dragging.current) return

      const dx    = ev.clientX - startClient.current.x
      const dy    = ev.clientY - startClient.current.y
      const moved = Math.abs(dx) > 8 || Math.abs(dy) > 8

      // Si las coordenadas son (0,0) o fuera de pantalla (movimiento brusco),
      // tratarlo como drop inválido → volver al origen
      const outOfBounds =
        (ev.clientX === 0 && ev.clientY === 0) ||
        ev.clientX < 0 || ev.clientY < 0 ||
        ev.clientX > window.innerWidth || ev.clientY > window.innerHeight

      if (outOfBounds) {
        dragging.current = false
        cancelAnimationFrame(rafId.current)
        setIsDragging(false)
        document.removeEventListener('mousemove', moveHandler.current)
        document.removeEventListener('mouseup',   upHandler.current)
        returnGhostToOrigin()
        // Solo mostrar feedback si realmente se había movido
        if (moved) showFeedback('Intenta colocarlo en el lugar correcto 🎯', 'warning')
        return
      }

      finishDrag(ev.clientX, ev.clientY, moved)
    }

    document.addEventListener('mousemove', moveHandler.current)
    document.addEventListener('mouseup',   upHandler.current)
  }

  // ── Feedback visual ──────────────────────────────────────────────────────
  const showFeedback = (message, type) => {
    const existing = document.querySelector('.drag-feedback-msg')
    if (existing) existing.remove()

    const fb = document.createElement('div')
    fb.className = 'drag-feedback-msg'
    fb.textContent = message
    Object.assign(fb.style, {
      position:      'fixed',
      top:           '50%',
      left:          '50%',
      transform:     'translate(-50%, -50%)',
      zIndex:        '99999',
      padding:       '20px 40px',
      borderRadius:  '20px',
      fontSize:      '1.4rem',
      fontWeight:    '700',
      color:         'white',
      boxShadow:     '0 8px 30px rgba(0,0,0,0.3)',
      animation:     'fadeInOut 1.5s ease forwards',
      background:    type === 'success'
        ? 'linear-gradient(135deg,#4caf50 0%,#8bc34a 100%)'
        : 'linear-gradient(135deg,#ff9800 0%,#ffc107 100%)',
      pointerEvents: 'none',
    })
    document.body.appendChild(fb)
    setTimeout(() => fb.parentNode && fb.parentNode.removeChild(fb), 1500)
  }

  // ── Visual de la pieza ───────────────────────────────────────────────────
  const renderPieceVisual = () => {
    switch (piece.id) {
      case 'base':
        return (
          <div className="piece-visual base-visual">
            <div className="base-platform"></div>
            <div className="base-support"></div>
          </div>
        )
      case 'tower':
        return (
          <div className="piece-visual tower-visual">
            <div className="tower-segment"></div>
            <div className="tower-detail"></div>
          </div>
        )
      case 'nacelle':
        return (
          <div className="piece-visual nacelle-visual">
            <div className="nacelle-body"></div>
            <div className="nacelle-top"></div>
          </div>
        )
      case 'rotor':
        return (
          <div className="piece-visual rotor-visual">
            <div className="rotor-center"></div>
            <div className="rotor-blade rotor-blade-1"></div>
            <div className="rotor-blade rotor-blade-2"></div>
            <div className="rotor-blade rotor-blade-3"></div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      ref={pieceRef}
      className={`turbine-piece piece-${piece.id} ${isDragging ? 'dragging' : ''}`}
      onMouseDown={onMouseDown}
      data-piece-id={piece.id}
      title="Arrastra al marcador · Clic para info"
    >
      {renderPieceVisual()}
      <div className="piece-name">{piece.name}</div>
      <div className="drag-hint">Arrastra a su lugar</div>
    </div>
  )
}

export default TurbinePiece
