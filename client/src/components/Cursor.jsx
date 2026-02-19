import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseDown = () => setClicking(true)
    const handleMouseUp = () => setClicking(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    const animate = () => {
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.1
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.1

      if (cursorRef.current) {
        cursorRef.current.style.left = mousePos.current.x + 'px'
        cursorRef.current.style.top = mousePos.current.y + 'px'
      }
      if (followerRef.current) {
        followerRef.current.style.left = cursorPos.current.x + 'px'
        followerRef.current.style.top = cursorPos.current.y + 'px'
      }
      requestAnimationFrame(animate)
    }
    const animId = requestAnimationFrame(animate)

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, .news-card, .trending-card, .featured-card')) {
        setHovering(true)
      }
    }
    const handleMouseOut = (e) => {
      if (e.target.closest('a, button, .news-card, .trending-card, .featured-card')) {
        setHovering(false)
      }
    }

    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className={`cursor${hovering ? ' hover' : ''}${clicking ? ' click' : ''}`}
      />
      <div ref={followerRef} className="cursor-follower" />
    </>
  )
}
