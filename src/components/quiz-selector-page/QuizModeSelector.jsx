import React, { useState } from 'react'

function QuizModeSelector({ onModeSelect, onStartQuiz }) {
  const [selectedMode, setSelectedMode] = useState('flashcard')

  const modes = [
    { 
      id: 'flashcard', 
      name: 'Flashcard', 
      icon: '🎴', 
      description: 'Traditional flip cards', 
      // Tailwind classes for the selected state
      activeClass: 'bg-indigo-600/20 border-indigo-500 shadow-indigo-500/30',
      glow: 'from-indigo-500/20 to-blue-500/20'
    },
    { 
      id: 'multiple-choice', 
      name: 'Multiple Choice', 
      icon: '📝', 
      description: 'ABCD options', 
      activeClass: 'bg-purple-600/20 border-purple-500 shadow-purple-500/30',
      glow: 'from-purple-500/20 to-pink-500/20'
    },
    { 
      id: 'fill-blank', 
      name: 'Fill in the Blank', 
      icon: '✏️', 
      description: 'Type the answer', 
      activeClass: 'bg-orange-500/20 border-orange-500 shadow-orange-500/30',
      glow: 'from-orange-500/20 to-red-500/20'
    },
    { 
      id: 'matching', 
      name: 'Matching', 
      icon: '🔗', 
      description: 'Match pairs', 
      activeClass: 'bg-green-600/20 border-green-500 shadow-green-500/30',
      glow: 'from-green-500/20 to-emerald-500/20'
    }
  ]

  const handleModeSelect = (modeId) => {
    setSelectedMode(modeId)
    // Safely call onModeSelect if it exists (it might not be passed by parent)
    onModeSelect?.(modeId)
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold text-white mb-2 font-heading">🎮 Choose Your Quiz Mode</h3>
        <p className="text-indigo-200">Select how you want to test your knowledge.</p>
      </div>
      
      {/* Grid of Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.id;
          
          return (
            <button
              key={mode.id}
              className={`
                relative p-6 rounded-2xl border text-left transition-all duration-300 group overflow-hidden
                ${isSelected 
                    ? `${mode.activeClass} scale-[1.02]` 
                    : 'bg-[#0f172a] border-white/10 hover:border-white/20 hover:bg-white/5'
                }
              `}
              onClick={() => handleModeSelect(mode.id)}
            >
              {/* Background Glow (Visible on Hover/Select) */}
              <div className={`absolute inset-0 bg-gradient-to-br ${mode.glow} opacity-0 transition-opacity duration-500 ${isSelected ? 'opacity-100' : 'group-hover:opacity-50'}`}></div>

              <div className="relative z-10 flex items-start gap-5">
                <div className={`
                    w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-lg transition-transform duration-300
                    ${isSelected ? 'bg-[#0f172a] scale-110' : 'bg-white/5 group-hover:scale-110'}
                `}>
                    {mode.icon}
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-bold text-xl mb-1 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                    {mode.name}
                  </h4>
                  <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                    {mode.description}
                  </p>
                </div>
                
                {/* Checkmark Indicator */}
                <div className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300
                    ${isSelected 
                        ? 'border-white bg-white text-indigo-900 scale-100 opacity-100' 
                        : 'border-white/10 scale-0 opacity-0'
                    }
                `}>
                    ✓
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Start Button */}
      <button
        className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-xl text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.01] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
        onClick={() => onStartQuiz(selectedMode)}
      >
        <span>🚀</span>
        <span>Start {modes.find(m => m.id === selectedMode)?.name} Quiz</span>
      </button>
    </div>
  )
}

export default QuizModeSelector