import React, { useState } from 'react'

function QuizModeSelector({ onModeSelect, onStartQuiz }) {
  const [selectedMode, setSelectedMode] = useState('flashcard')

  const modes = [
    { id: 'flashcard', name: 'Flashcard', icon: '🎴', description: 'Traditional flip cards', color: 'btn-primary' },
    { id: 'multiple-choice', name: 'Multiple Choice', icon: '📝', description: 'ABCD options', color: 'btn-green' },
    { id: 'fill-blank', name: 'Fill in the Blank', icon: '✏️', description: 'Type the answer', color: 'btn-yellow' },
    { id: 'matching', name: 'Matching', icon: '🔗', description: 'Match pairs', color: 'btn-purple' }
  ]

  const handleModeSelect = (modeId) => {
    setSelectedMode(modeId)
    onModeSelect(modeId)
  }

  return (
    <div className="card mb-6">
      <h3 className="text-xl font-bold text-white mb-4">🎮 Choose Your Quiz Mode</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {modes.map((mode) => (
          <button
            key={mode.id}
            className={`btn text-left p-4 transition-all hover:scale-105 ${selectedMode === mode.id ? mode.color : 'btn-gray'}`}
            onClick={() => handleModeSelect(mode.id)}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{mode.icon}</span>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1">{mode.name}</h4>
                <p className="text-sm opacity-90">{mode.description}</p>
              </div>
              {selectedMode === mode.id && <span className="text-2xl">✓</span>}
            </div>
          </button>
        ))}
      </div>

      <button
        className="btn btn-gradient w-full"
        onClick={() => onStartQuiz(selectedMode)}
      >
        🚀 Start {modes.find(m => m.id === selectedMode)?.name} Quiz
      </button>
    </div>
  )
}

export default QuizModeSelector