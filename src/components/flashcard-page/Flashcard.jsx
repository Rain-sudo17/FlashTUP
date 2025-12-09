import React, { useState, useEffect } from 'react'
import ImageUploader from '../ImageUploader'

function Flashcard({ card, editMode = false, onUpdate, onCancelEdit }) {
  const [isFlipped, setIsFlipped] = useState(false)
  
  // State for content
  const [editedQuestion, setEditedQuestion] = useState('')
  const [editedAnswer, setEditedAnswer] = useState('')
  const [questionImage, setQuestionImage] = useState(null)
  const [answerImage, setAnswerImage] = useState(null)

  useEffect(() => {
    setIsFlipped(false)
    if (card) {
      setEditedQuestion(card.question)
      setEditedAnswer(card.answer)
      setQuestionImage(card.questionImage || null)
      setAnswerImage(card.answerImage || null)
    }
  }, [card])

  if (!card) return <div className="text-white text-center">No card selected</div>

  const handleSave = () => {
    onUpdate({ 
      question: editedQuestion, 
      answer: editedAnswer,
      questionImage,
      answerImage
    })
    onCancelEdit()
  }

  // --- EDIT MODE ---
  if (editMode) {
    return (
      <div className="w-full max-w-3xl bg-[#0f172a] border border-white/10 rounded-3xl p-6 shadow-2xl relative z-20">
        <h3 className="text-xl font-bold text-white mb-4">Edit Card</h3>
        <div className="space-y-6">
          {/* Question Edit */}
          <div>
            <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Question Side</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-indigo-500/50 outline-none min-h-[100px]"
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
            />
            <div className="mt-2">
                <ImageUploader onImageAdded={setQuestionImage} cardIndex="question" />
            </div>
          </div>

          {/* Answer Edit */}
          <div>
            <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Answer Side</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-purple-500/50 outline-none min-h-[100px]"
              value={editedAnswer}
              onChange={(e) => setEditedAnswer(e.target.value)}
            />
            <div className="mt-2">
                <ImageUploader onImageAdded={setAnswerImage} cardIndex="answer" />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
            <button className="px-6 py-2 rounded-xl text-gray-300 hover:bg-white/5 transition" onClick={onCancelEdit}>Cancel</button>
            <button className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </div>
    )
  }

  // --- 3D FLIP CARD VIEW ---
  return (
    <div 
      className="relative w-full max-w-3xl h-[500px] cursor-pointer group perspective-1000"
      onClick={(e) => {
        if(e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') setIsFlipped(!isFlipped)
      }}
      style={{ perspective: '1000px' }} // Tailwind sometimes needs explicit px for perspective
    >
      <div 
        className="relative w-full h-full transition-all duration-500"
        style={{ 
            transformStyle: 'preserve-3d', 
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* --- FRONT (QUESTION) --- */}
        <div 
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center justify-center p-8 md:p-12 text-center backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-transparent opacity-50"></div>
            <span className="absolute top-6 left-6 text-xs font-bold text-indigo-300 uppercase tracking-[0.2em]">Question</span>
            
            {card.questionImage && (
              <div className="mb-6 rounded-xl overflow-hidden shadow-lg border border-white/5 max-h-40">
                  <img src={card.questionImage} alt="Visual Aid" className="h-full w-full object-cover" />
              </div>
            )}
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight font-heading drop-shadow-md overflow-y-auto custom-scrollbar">
              {card.question}
            </h2>
            
            <div className="absolute bottom-6 flex items-center gap-2 text-gray-400 text-sm animate-pulse">
                <span>Tap to flip</span>
                <span className="text-xl">↻</span>
            </div>
        </div>

        {/* --- BACK (ANSWER) --- */}
        <div 
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-3xl border border-white/10 shadow-2xl shadow-indigo-500/10 flex flex-col items-center justify-center p-8 md:p-12 text-center backface-hidden"
            style={{ 
                backfaceVisibility: 'hidden', 
                transform: 'rotateY(180deg)' 
            }}
        >
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-purple-500 to-transparent opacity-50"></div>
            <span className="absolute top-6 left-6 text-xs font-bold text-purple-300 uppercase tracking-[0.2em]">Answer</span>
            
            {card.answerImage && (
              <div className="mb-6 rounded-xl overflow-hidden shadow-lg border border-white/5 max-h-40">
                  <img src={card.answerImage} alt="Visual Aid" className="h-full w-full object-cover" />
              </div>
            )}

            <div className="text-xl md:text-2xl text-indigo-100 font-medium leading-relaxed whitespace-pre-wrap overflow-y-auto w-full custom-scrollbar max-h-full">
              {card.answer}
            </div>
            
            {card.source && (
              <div className="absolute bottom-6 right-6 text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                Source: {card.source}
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default Flashcard