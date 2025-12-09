import React, { useState, useMemo } from 'react'
import SpacedRepetition from "../AppTools/SpacedRepetition";
import { useToast } from '../context/ToastContext'

function SpacedRepetitionPanel({ card, onUpdateCard, onNextCard }) {
  const [showPanel, setShowPanel] = useState(false)
  const { success } = useToast()

  const difficulty = useMemo(() => SpacedRepetition.getDifficulty(card), [card])
  const nextReview = useMemo(() => SpacedRepetition.formatNextReview(card), [card])

  const handleQualityRating = (quality) => {
    const updatedCard = SpacedRepetition.calculateNextReview(card, quality)
    onUpdateCard(updatedCard)
    
    const labels = ['Failed ❌', 'Very Hard 😰', 'Hard 😅', 'Okay 👌', 'Good 👍', 'Perfect 🎉']
    success(`${labels[quality]} - Next: ${SpacedRepetition.formatNextReview(updatedCard)}`)
    
    setTimeout(() => onNextCard(), 1000)
  }

  const difficultyIcons = { easy: '😊', medium: '😐', hard: '😓' }

  return (
    <div className="card mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-white">🧠 Spaced Repetition</h3>
        <button className="text-sm text-gray-300 underline" onClick={() => setShowPanel(!showPanel)}>
          {showPanel ? 'Hide' : 'Show'} Details
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-white">
        <div>
          <span className="opacity-70">Difficulty: </span>
          <span>{difficultyIcons[difficulty]} {difficulty}</span>
        </div>
        <div>
          <span className="opacity-70">Next Review: </span>
          <span>{nextReview}</span>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {[0, 1, 2, 3, 4, 5].map(q => (
           <button 
             key={q}
             className="btn btn-sm btn-gray flex flex-col items-center py-2"
             onClick={() => handleQualityRating(q)}
           >
             <span className="text-lg font-bold">{q}</span>
             <span className="text-xs">
                {['Fail', 'Hard', 'Hard', 'Ok', 'Good', 'Perf'][q]}
             </span>
           </button>
        ))}
      </div>

      {showPanel && (
        <div className="mt-4 p-3 bg-white bg-opacity-10 rounded text-sm text-white">
           <p>Ease Factor: {(card.easeFactor || 2.5).toFixed(2)}</p>
           <p>Interval: {card.interval || 0} days</p>
           <p>Repetitions: {card.repetitions || 0}</p>
        </div>
      )}
    </div>
  )
}

export default SpacedRepetitionPanel