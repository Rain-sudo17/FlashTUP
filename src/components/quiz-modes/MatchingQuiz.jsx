import React, { useState, useEffect, useRef, useCallback } from 'react'
import Utils from "../../AppTools/Utils"

function MatchingQuiz({ cards, onComplete }) {
  // Game Data
  const [leftCol, setLeftCol] = useState([]) 
  const [rightCol, setRightCol] = useState([]) 
  
  // Game State
  const [selectedLeft, setSelectedLeft] = useState(null)
  const [connections, setConnections] = useState({}) // Format: { leftId: rightId }
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  // Layout Refs for SVG Lines
  const containerRef = useRef(null)
  const leftRefs = useRef({})
  const rightRefs = useRef({})
  const [lineCoordinates, setLineCoordinates] = useState([])

  // --- INITIALIZATION ---
  useEffect(() => {
    // Take 5 random cards (or less if deck is small)
    const count = Math.min(cards.length, 5)
    const gameCards = Utils.shuffleArray([...cards]).slice(0, count)

    // Left Side = Questions
    const left = gameCards.map(c => ({ id: c.id, text: c.question }))
    // Right Side = Answers (Shuffled independently)
    const right = Utils.shuffleArray(gameCards.map(c => ({ id: c.id, text: c.answer })))

    setLeftCol(left)
    setRightCol(right)
    setConnections({})
    setIsSubmitted(false)
  }, [cards])

  // --- DRAWING LINES ---
  const calculateLines = useCallback(() => {
    if (!containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const coords = []

    // 1. Draw established connections
    Object.entries(connections).forEach(([leftId, rightId]) => {
      const leftEl = leftRefs.current[leftId]
      const rightEl = rightRefs.current[rightId]

      if (leftEl && rightEl) {
        const leftRect = leftEl.getBoundingClientRect()
        const rightRect = rightEl.getBoundingClientRect()

        coords.push({
            id: `${leftId}-${rightId}`,
            x1: leftRect.right - containerRect.left, // Right edge of left card
            y1: leftRect.top + leftRect.height / 2 - containerRect.top, // Center Y
            x2: rightRect.left - containerRect.left, // Left edge of right card
            y2: rightRect.top + rightRect.height / 2 - containerRect.top, // Center Y
            status: isSubmitted 
                ? (leftId.toString() === rightId.toString() ? 'correct' : 'incorrect') 
                : 'active'
        })
      }
    })

    // 2. Draw active dragging line (Optional visual, currently handling via selected highlight)
    // If you wanted a line following the mouse, it would go here. 
    // For now, we just highlight the selected box.

    setLineCoordinates(coords)
  }, [connections, isSubmitted])

  // Recalculate lines on window resize or connection change
  useEffect(() => {
    calculateLines()
    window.addEventListener('resize', calculateLines)
    return () => window.removeEventListener('resize', calculateLines)
  }, [calculateLines, connections])


  // --- INTERACTION HANDLERS ---
  const handleLeftClick = (item) => {
    if (isSubmitted) return
    // If clicking the same one, deselect
    if (selectedLeft === item.id) {
        setSelectedLeft(null)
        return
    }
    // Select new left item
    setSelectedLeft(item.id)
  }

  const handleRightClick = (item) => {
    if (isSubmitted) return
    if (!selectedLeft) return // Must select left first

    // Create or update connection
    setConnections(prev => ({
        ...prev,
        [selectedLeft]: item.id
    }))
    
    // Clear selection so user can pick next pair
    setSelectedLeft(null)
  }

  const handleSubmit = () => {
    let correctCount = 0
    let total = leftCol.length

    Object.entries(connections).forEach(([leftId, rightId]) => {
        if (leftId.toString() === rightId.toString()) {
            correctCount++
        }
    })

    const finalScore = correctCount
    const percentage = Math.round((correctCount / total) * 100)
    
    setScore(finalScore)
    setIsSubmitted(true)
    
    // Don't auto-exit, let user see results. 
    // Parent "onComplete" can be triggered by the "Finish" button that appears.
  }

  const handleFinish = () => {
     onComplete({
        score: score,
        total: leftCol.length,
        percentage: Math.round((score / leftCol.length) * 100)
     })
  }

  const isAllConnected = leftCol.length > 0 && Object.keys(connections).length === leftCol.length

  return (
    <div className="w-full max-w-6xl mx-auto p-4 animate-fadeIn">
      
      {/* HEADER */}
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight">Connect the Dots</h3>
        <p className="text-indigo-200">
            {isSubmitted 
                ? `You got ${score} out of ${leftCol.length} correct!` 
                : "Select a definition on the left, then tap the matching term on the right."}
        </p>
      </div>

      {/* GAME AREA - RELATIVE CONTAINER FOR SVG */}
      <div className="relative" ref={containerRef}>
        
        {/* SVG OVERLAY (Behind Cards) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
            {lineCoordinates.map(line => (
                <line 
                    key={line.id}
                    x1={line.x1} y1={line.y1} 
                    x2={line.x2} y2={line.y2} 
                    strokeWidth="3"
                    className={`transition-all duration-500 ${
                        line.status === 'correct' ? 'stroke-green-500' : 
                        line.status === 'incorrect' ? 'stroke-red-500 opacity-50' : 
                        'stroke-indigo-500'
                    }`}
                    strokeDasharray={line.status === 'active' ? "0" : "5,5"}
                />
            ))}
        </svg>

        <div className="grid grid-cols-2 gap-12 md:gap-24 relative z-10">
            
            {/* LEFT COLUMN */}
            <div className="space-y-6">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest border-b border-indigo-500/30 pb-2 mb-4">Definitions</h4>
                {leftCol.map(item => {
                    const isSelected = selectedLeft === item.id
                    const isConnected = connections[item.id] !== undefined
                    
                    // Determine Styling based on state
                    let styles = "bg-[#0f172a] border-white/10 text-gray-300 hover:border-white/30"
                    
                    if (isSubmitted) {
                         const connectedRightId = connections[item.id]
                         if (connectedRightId && connectedRightId.toString() === item.id.toString()) {
                             styles = "bg-green-500/10 border-green-500 text-green-100" // Correct
                         } else {
                             styles = "bg-red-500/10 border-red-500 text-red-100" // Wrong
                         }
                    } else if (isSelected) {
                        styles = "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-[1.02]"
                    } else if (isConnected) {
                        styles = "bg-indigo-900/20 border-indigo-500/50 text-indigo-100"
                    }

                    return (
                        <div 
                            key={item.id}
                            ref={el => leftRefs.current[item.id] = el}
                            onClick={() => handleLeftClick(item)}
                            className={`
                                relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 min-h-[100px] flex items-center shadow-lg
                                ${styles}
                            `}
                        >
                            <p className="text-sm md:text-base font-medium leading-relaxed">{item.text}</p>
                            
                            {/* Connector Dot Right */}
                            <div className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${isSelected || isConnected ? 'bg-indigo-500' : 'bg-gray-600'}`}></div>
                        </div>
                    )
                })}
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
                 <h4 className="text-xs font-bold text-purple-300 uppercase tracking-widest border-b border-purple-500/30 pb-2 mb-4">Terms</h4>
                 {rightCol.map(item => {
                    // Check if this item is the target of ANY connection
                    const isConnectedTo = Object.values(connections).includes(item.id)
                    
                    let styles = "bg-[#0f172a] border-white/10 text-gray-300 hover:border-white/30"

                    if (isSubmitted) {
                        // Find who connected to me
                        const connectedLeftId = Object.keys(connections).find(key => connections[key] === item.id)
                        if (connectedLeftId && connectedLeftId.toString() === item.id.toString()) {
                             styles = "bg-green-500/10 border-green-500 text-green-100"
                        } else if (connectedLeftId) {
                             styles = "bg-red-500/10 border-red-500 text-red-100 opacity-50"
                        }
                    } else if (isConnectedTo) {
                        styles = "bg-indigo-900/20 border-indigo-500/50 text-indigo-100"
                    }

                    return (
                        <div 
                            key={item.id}
                            ref={el => rightRefs.current[item.id] = el}
                            onClick={() => handleRightClick(item)}
                            className={`
                                relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 min-h-[100px] flex items-center justify-center text-center shadow-lg
                                ${styles}
                            `}
                        >
                            {/* Connector Dot Left */}
                            <div className={`absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${isConnectedTo ? 'bg-indigo-500' : 'bg-gray-600'}`}></div>

                            <p className="text-sm md:text-lg font-bold">{item.text}</p>
                        </div>
                    )
                })}
            </div>

        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mt-12 flex justify-center">
        {!isSubmitted ? (
            <button 
                className={`
                    px-12 py-4 rounded-xl font-bold text-lg shadow-xl transition-all duration-300 flex items-center gap-3
                    ${isAllConnected 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 hover:shadow-indigo-500/40' 
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                    }
                `}
                disabled={!isAllConnected}
                onClick={handleSubmit}
            >
                <span>🚀</span> <span>Submit Answers</span>
            </button>
        ) : (
             <div className="flex flex-col items-center gap-4 animate-slideIn">
                <div className="text-2xl font-bold text-white mb-2">
                    Score: <span className={score === leftCol.length ? 'text-green-400' : 'text-orange-400'}>{score}/{leftCol.length}</span>
                </div>
                <button 
                    className="px-12 py-4 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 border border-white/10 transition-all"
                    onClick={handleFinish}
                >
                    Finish Quiz →
                </button>
             </div>
        )}
      </div>

    </div>
  )
}

export default MatchingQuiz