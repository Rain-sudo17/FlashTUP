import React, { useState, useEffect } from 'react'
import Utils from "../AppTools/Utils"

function FillBlankQuiz({ card, onAnswer }) {
  const [userInput, setUserInput] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  useEffect(() => {
    setUserInput('')
    setShowFeedback(false)
    setIsCorrect(false)
  }, [card])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (showFeedback) return

    // Fuzzy match logic
    const similarity = Utils.calculateSimilarity(userInput, card.answer)
    const exactMatch = userInput.trim().toLowerCase() === card.answer.trim().toLowerCase()
    
    // Pass if similarity > 60% OR exact match (case insensitive)
    const pass = similarity > 0.6 || exactMatch

    setIsCorrect(pass)
    setShowFeedback(true)

    setTimeout(() => {
      onAnswer(pass, userInput)
    }, 2000)
  }

  return (
    <div className="dashboard-card max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <span className="text-indigo-400 font-bold uppercase text-xs tracking-wider">Fill in the blank</span>
        <h3 className="text-2xl font-bold text-white mt-2 leading-relaxed">
          {card.question}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-400 text-sm font-semibold mb-2">
            Your Answer:
          </label>
          <input
            type="text"
            className={`modern-input text-lg py-4 ${showFeedback ? (isCorrect ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10') : ''}`}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type the answer here..."
            disabled={showFeedback}
            autoFocus
            autoComplete="off"
          />
        </div>

        {showFeedback && (
          <div className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-500/20 border-green-500/50 text-green-200' : 'bg-red-500/20 border-red-500/50 text-red-200'} animate-fadeIn`}>
            <p className="font-bold text-lg mb-1">
              {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
            </p>
            {!isCorrect && (
              <p className="text-sm opacity-80">
                Correct Answer: <span className="font-bold underline">{card.answer}</span>
              </p>
            )}
          </div>
        )}

        <button 
          type="submit" 
          className="btn-primary-glow w-full py-4 text-lg"
          disabled={!userInput.trim() || showFeedback}
        >
          {showFeedback ? 'Next Question...' : 'Submit Answer'}
        </button>
      </form>
    </div>
  )
}

export default FillBlankQuiz