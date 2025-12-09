import React, { useState, useEffect, useMemo } from 'react'
import Utils from "../../AppTools/Utils"

function MultipleChoiceQuiz({ card, allCards, onAnswer }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [options, setOptions] = useState([])

  // --- GENERATE OPTIONS (Smart Distractors) ---
  useEffect(() => {
    // 1. Analyze the correct answer to determine "type"
    const correctLen = card.answer.length;
    // We consider it "short" if it's likely a term or keyword (< 50 chars)
    const isShortAnswer = correctLen < 50; 

    // 2. Filter potential wrong answers to match the "vibe"
    let potentialDistractors = allCards.filter(c => {
        // Exclude self
        if (c.id === card.id) return false;

        // Smart Filtering:
        // If correct answer is a short term, ONLY show other short terms as options.
        // If correct answer is a long definition, ONLY show other long definitions.
        if (isShortAnswer) {
            return c.answer.length < 60; // Keep it somewhat similar
        } else {
            return c.answer.length >= 40; // Don't show 1-word answers for a definition question
        }
    });

    // 3. Fallback: If we filtered too aggressively and ran out of cards, 
    // broaden the search to avoid crashing or having empty options.
    if (potentialDistractors.length < 3) {
         potentialDistractors = allCards.filter(c => c.id !== card.id);
    }

    // 4. Shuffle and pick 3 distinct wrong answers
    const distinctWrongAnswers = new Set()
    const shuffledOthers = Utils.shuffleArray([...potentialDistractors])
    
    for (const c of shuffledOthers) {
      if (distinctWrongAnswers.size >= 3) break;
      
      // Ensure the wrong answer isn't identical to the correct answer (text-wise)
      const cleanWrong = c.answer.trim().toLowerCase();
      const cleanCorrect = card.answer.trim().toLowerCase();
      
      if (cleanWrong !== cleanCorrect) {
        distinctWrongAnswers.add(c.answer)
      }
    }

    // 5. Combine with correct answer
    const choiceList = [
      { text: card.answer, isCorrect: true },
      ...Array.from(distinctWrongAnswers).map(ans => ({ text: ans, isCorrect: false }))
    ]

    // 6. Shuffle the final options
    setOptions(Utils.shuffleArray(choiceList))
    
    // Reset state for new card
    setSelectedOption(null)
    setIsCorrect(null)
  }, [card, allCards])

  const handleSelect = (option) => {
    if (selectedOption) return // Prevent changing answer
    
    setSelectedOption(option)
    const correct = option.isCorrect
    setIsCorrect(correct)

    // Wait 1.5s before moving to next question
    setTimeout(() => {
      onAnswer(correct, option.text)
    }, 1500)
  }

  return (
    <div className="w-full max-w-3xl mx-auto animate-fadeIn">
      
      {/* Question Card */}
      <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold uppercase text-xs tracking-wider mb-4 relative z-10">
            Multiple Choice
        </span>
        
        <h3 className="text-2xl md:text-3xl font-bold text-white leading-relaxed font-heading relative z-10">
          {card.question}
        </h3>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-4">
        {options.map((option, index) => {
          let optionClass = "bg-[#0f172a] border-white/10 hover:bg-white/5 hover:border-white/30 text-gray-300"
          
          if (selectedOption) {
            if (option.isCorrect) {
               optionClass = "bg-green-500/10 border-green-500 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
            } else if (selectedOption === option && !option.isCorrect) {
               optionClass = "bg-red-500/10 border-red-500 text-red-100 opacity-80"
            } else {
               optionClass = "bg-[#0f172a] border-white/5 text-gray-600 opacity-50"
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              disabled={selectedOption !== null}
              className={`
                relative w-full p-6 rounded-2xl border-2 text-left transition-all duration-300 group
                flex items-center gap-4
                ${optionClass}
                ${!selectedOption ? 'hover:scale-[1.01] hover:shadow-lg' : ''}
              `}
            >
              <div className={`
                w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-sm border transition-colors
                ${selectedOption && option.isCorrect 
                    ? 'bg-green-500 text-white border-green-500' 
                    : selectedOption === option && !option.isCorrect 
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-white/5 border-white/10 text-gray-400 group-hover:border-white/30 group-hover:text-white'
                }
              `}>
                {String.fromCharCode(65 + index)}
              </div>

              <span className="text-lg font-medium flex-1">{option.text}</span>

              {selectedOption && option.isCorrect && (
                  <span className="text-2xl animate-bounce">✅</span>
              )}
              {selectedOption === option && !option.isCorrect && (
                  <span className="text-2xl animate-shake">❌</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MultipleChoiceQuiz