import React, { useState, useEffect } from 'react'
import Utils from "../../AppTools/Utils"

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

  // Determine input border color based on state
  const getInputBorder = () => {
    if (!showFeedback) return 'border-white/10 focus:border-indigo-500/50';
    return isCorrect 
      ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] bg-green-500/5' 
      : 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] bg-red-500/5';
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-[#0f172a] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden animate-fadeIn">
      
      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      {/* Question Section */}
      <div className="relative z-10 mb-8">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold uppercase text-xs tracking-wider mb-4">
            Fill in the blank
        </span>
        <h3 className="text-2xl md:text-3xl font-bold text-white leading-relaxed font-heading">
          {card.question}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        <div>
          <label className="block text-indigo-200 text-sm font-bold uppercase tracking-wider mb-3 ml-1">
            Your Answer
          </label>
          <div className="relative group">
            <input
              type="text"
              className={`
                w-full bg-[#0f172a]/50 backdrop-blur-sm text-white text-xl py-5 px-6 rounded-2xl outline-none transition-all duration-300 border-2
                ${getInputBorder()}
              `}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type the answer here..."
              disabled={showFeedback}
              autoFocus
              autoComplete="off"
            />
            {/* Subtle inner glow for default state */}
            {!showFeedback && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity"></div>
            )}
          </div>
        </div>

        {/* Feedback Section */}
        {showFeedback && (
          <div className={`
            p-6 rounded-2xl border flex items-center gap-4 animate-slideIn
            ${isCorrect 
                ? 'bg-green-500/10 border-green-500/20 text-green-300' 
                : 'bg-red-500/10 border-red-500/20 text-red-300'
            }
          `}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {isCorrect ? '🎉' : '❌'}
            </div>
            <div>
                <p className="font-bold text-xl mb-1">
                {isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                {!isCorrect && (
                <p className="text-sm opacity-90 text-white/80">
                    The correct answer was: <span className="font-bold text-white underline decoration-red-500/50 underline-offset-4">{card.answer}</span>
                </p>
                )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="submit" 
          className={`
            w-full py-5 rounded-2xl text-xl font-bold shadow-xl transition-all duration-300 flex items-center justify-center gap-2
            ${!userInput.trim() || showFeedback 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-[1.01] hover:shadow-indigo-500/20 border border-white/10'
            }
          `}
          disabled={!userInput.trim() || showFeedback}
        >
          {showFeedback ? (
            <span>Processing Next...</span>
          ) : (
            <>
                <span>Submit Answer</span>
                <span>↵</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default FillBlankQuiz