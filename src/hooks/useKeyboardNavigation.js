import { useEffect, useCallback } from 'react'

function useKeyboardNavigation({ 
  onLeft, 
  onRight, 
  onSpace, 
  onM,
  onR,
  enabled = true 
}) {
  const handleKeyDown = useCallback((e) => {
    if (!enabled) return

    // Don't trigger if user is typing
    if (
      e.target.tagName === 'INPUT' || 
      e.target.tagName === 'TEXTAREA' || 
      e.target.isContentEditable
    ) {
      return
    }

    // Prevent default for space to avoid page scroll
    if (e.key === ' ') {
      e.preventDefault()
    }

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        onLeft?.()
        break
      case 'ArrowRight':
        e.preventDefault()
        onRight?.()
        break
      case ' ':
        // Space usually handled by the button focus or custom logic
        break
      case 'm':
      case 'M':
        onM?.()
        break
      case 'r':
      case 'R':
        onR?.()
        break
      default:
        break
    }
  }, [onLeft, onRight, onSpace, onM, onR, enabled])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

export default useKeyboardNavigation