import React, { useState, useEffect } from 'react'
import Utils from "../AppTools/Utils"

function MatchingQuiz({ cards, onComplete }) {
  const [leftCol, setLeftCol] = useState([]) // Definitions
  const [rightCol, setRightCol] = useState([]) // Options (Terms)
  const [selectedLeft, setSelectedLeft] = useState(null)
  const [selectedRight, setSelectedRight] = useState(null)
  const [matchedPairs, setMatchedPairs] = useState(new Set())
  const [wrongPair, setWrongPair] = useState(false)

  // Initialize Game
  useEffect(() => {
    // Take 5 random cards
    const gameCards = Utils.shuffleArray([...cards]).slice(0, 5)

    // Left Side = Questions/Definitions
    const left = gameCards.map(c => ({ id: c.id, text: c.question, type: 'q' }))
    
    // Right Side = Answers/Options (Shuffled)
    const right = Utils.shuffleArray(gameCards.map(c => ({ id: c.id, text: c.answer, type: 'a' })))

    setLeftCol(left)
    setRightCol(right)
  }, [cards])

  // Handle Match Logic
  useEffect(() => {
    if (selectedLeft && selectedRight) {
      if (selectedLeft.id === selectedRight.id) {
        // MATCH!
        setMatchedPairs(prev => new Set(prev).add(selectedLeft.id))
        setSelectedLeft(null)
        setSelectedRight(null)
      } else {
        // WRONG!
        setWrongPair(true)
        setTimeout(() => {
          setSelectedLeft(null)
          setSelectedRight(null)
          setWrongPair(false)
        }, 800)
      }
    }
  }, [selectedLeft, selectedRight])

  // Check Win Condition
  useEffect(() => {
    if (leftCol.length > 0 && matchedPairs.size === leftCol.length) {
      setTimeout(() => {
        onComplete({ score: 100, total: 100, percentage: 100 })
      }, 1000)
    }
  }, [matchedPairs, leftCol.length, onComplete])

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-white mb-2">Connect the Dots</h3>
        <p className="text-indigo-200">Match the definition on the left to the term on the right.</p>
      </div>

      {/* --- THIS IS THE CONTAINER YOU ASKED ABOUT --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        
        {/* LEFT COLUMN (Definitions) */}
        <div className="space-y-4">
            <h4 className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-2 border-b border-gray-700 pb-2">
                Definitions
            </h4>
            {leftCol.map(item => {
                const isMatched = matchedPairs.has(item.id)
                const isSelected = selectedLeft?.id === item.id
                const isError = isSelected && wrongPair

                let itemClass = `p-4 rounded-xl border cursor-pointer transition-all duration-200 min-h-[80px] flex items-center `
                
                if (isMatched) itemClass += "bg-green-500/10 border-green-500/50 text-green-200 opacity-50"
                else if (isError) itemClass += "bg-red-500/20 border-red-500 text-red-200 animate-shake"
                else if (isSelected) itemClass += "bg-indigo-600 border-indigo-400 text-white shadow-lg scale-[1.02]"
                else itemClass += "bg-white/5 border-white/10 hover:bg-white/10 text-gray-200"

                return (
                    <div key={item.id} className={itemClass} onClick={() => !isMatched && !wrongPair && setSelectedLeft(item)}>
                        {item.text}
                    </div>
                )
            })}
        </div>

        {/* RIGHT COLUMN (Options) */}
        <div className="space-y-4">
            <h4 className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-2 border-b border-gray-700 pb-2">
                Options
            </h4>
            {rightCol.map(item => {
                const isMatched = matchedPairs.has(item.id)
                const isSelected = selectedRight?.id === item.id
                const isError = isSelected && wrongPair

                let itemClass = `p-4 rounded-xl border cursor-pointer transition-all duration-200 min-h-[80px] flex items-center justify-center text-center font-bold `

                if (isMatched) itemClass += "bg-green-500/10 border-green-500/50 text-green-200 opacity-50"
                else if (isError) itemClass += "bg-red-500/20 border-red-500 text-red-200 animate-shake"
                else if (isSelected) itemClass += "bg-indigo-600 border-indigo-400 text-white shadow-lg scale-[1.02]"
                else itemClass += "bg-white/5 border-white/10 hover:bg-white/10 text-gray-200"

                return (
                    <div key={item.id} className={itemClass} onClick={() => !isMatched && !wrongPair && setSelectedRight(item)}>
                        {item.text}
                    </div>
                )
            })}
        </div>

      </div>
    </div>
  )
}

export default MatchingQuiz