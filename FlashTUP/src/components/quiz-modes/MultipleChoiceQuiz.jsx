import React, { useState, useMemo, useEffect } from 'react'
import Utils from "../AppTools/Utils" // Ensure this path is correct

function MultipleChoiceQuiz({ card, allCards, onAnswer }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [showResult, setShowResult] = useState(false)

  // Safety Check
  if (!card || !allCards || allCards.length === 0) {
    return <div className="text-center text-white p-10">Loading Question...</div>
  }

  const options = useMemo(() => {
    const correctAnswer = card.answer
    
    // Get wrong answers (filter out current card)
    const otherCards = allCards.filter(c => c.id !== card.id)
    
    // Shuffle and pick 3 wrong answers
    const wrongAnswers = Utils.shuffleArray(otherCards)
      .slice(0, 3)
      .map(c => c.answer) // Map to just the answer string
      
    // Combine and shuffle
    const allOptions = Utils.shuffleArray([correctAnswer, ...wrongAnswers])
    
    return allOptions.map((option, index) => ({
      id: index,
      text: option,
      isCorrect: option === correctAnswer
    }))
  }, [card, allCards])

  // Reset state on new card
  useEffect(() => {
    setSelectedOption(null)
    setShowResult(false)
  }, [card])

  const handleOptionSelect = (option) => {
    if (showResult) return
    setSelectedOption(option)
    setShowResult(true)
    
    // Delay before moving to next question
    setTimeout(() => {
      onAnswer(option.isCorrect, option.text)
    }, 1500)
  }

  return (
    <div className="dashboard-card max-w-3xl mx-auto p-8">
      <div className="mb-8 border-b border-white/10 pb-6">
        <span className="text-indigo-400 font-bold uppercase text-xs tracking-wider">Multiple Choice</span>
        <h3 className="text-2xl font-bold text-white mt-2 leading-relaxed">{card.question}</h3>
      </div>

      <div className="grid gap-4">
        {options.map((option) => {
          const isSelected = selectedOption?.id === option.id
          
          let btnClass = "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 "
          
          if (showResult) {
            if (option.isCorrect) {
              btnClass += "bg-green-500/20 border-green-500 text-green-100" // Correct style
            } else if (isSelected && !option.isCorrect) {
              btnClass += "bg-red-500/20 border-red-500 text-red-100" // Wrong style
            } else {
              btnClass += "bg-white/5 border-transparent opacity-50" // Unselected
            }
          } else {
            // Normal State
            btnClass += isSelected 
              ? "bg-indigo-600 border-indigo-500 text-white" 
              : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-200"
          }

          return (
            <button
              key={option.id}
              className={btnClass}
              onClick={() => handleOptionSelect(option)}
              disabled={showResult}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${showResult && option.isCorrect ? 'border-green-400 bg-green-400 text-black' : 'border-white/20'}`}>
                {String.fromCharCode(65 + option.id)}
              </div>
              <span className="flex-1">{option.text}</span>
              {showResult && option.isCorrect && <span>✅</span>}
              {showResult && isSelected && !option.isCorrect && <span>❌</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MultipleChoiceQuiz