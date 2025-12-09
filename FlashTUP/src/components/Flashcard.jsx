import React, { useState, useEffect } from 'react'
import ImageUploader from './ImageUploader'

function Flashcard({ card, editMode = false, onUpdate, onCancelEdit }) {
  const [isFlipped, setIsFlipped] = useState(false)
  
  // State for content
  const [editedQuestion, setEditedQuestion] = useState('')
  const [editedAnswer, setEditedAnswer] = useState('')
  
  // State for images
  const [questionImage, setQuestionImage] = useState(null)
  const [answerImage, setAnswerImage] = useState(null)

  // Reset state when card changes
  useEffect(() => {
    setIsFlipped(false)
    if (card) {
      setEditedQuestion(card.question)
      setEditedAnswer(card.answer)
      setQuestionImage(card.questionImage || null)
      setAnswerImage(card.answerImage || null)
    }
  }, [card])

  if (!card) return <div className="flashcard">No card selected</div>

  const handleSave = () => {
    onUpdate({ 
      question: editedQuestion, 
      answer: editedAnswer,
      questionImage,
      answerImage
    })
    onCancelEdit()
  }

  // --- EDIT MODE VIEW ---
  if (editMode) {
    return (
      <div className="flashcard w-full max-w-2xl bg-white/10 backdrop-blur-md">
        <div className="w-full space-y-4">
          {/* Question Edit */}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-300">Question</label>
            <textarea
              className="input-field w-full min-h-[100px]"
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
            />
            <ImageUploader 
              onImageAdded={(img) => setQuestionImage(img)} 
              cardIndex="question" 
            />
            {questionImage && (
              <img src={questionImage} alt="Question" className="mt-2 h-20 rounded" />
            )}
          </div>

          {/* Answer Edit */}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-300">Answer</label>
            <textarea
              className="input-field w-full min-h-[150px]"
              value={editedAnswer}
              onChange={(e) => setEditedAnswer(e.target.value)}
            />
            <ImageUploader 
              onImageAdded={(img) => setAnswerImage(img)} 
              cardIndex="answer" 
            />
            {answerImage && (
              <img src={answerImage} alt="Answer" className="mt-2 h-20 rounded" />
            )}
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <button className="btn btn-red" onClick={onCancelEdit}>Cancel</button>
            <button className="btn btn-green" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </div>
    )
  }

  // --- STANDARD VIEW ---
  return (
    <div 
      className={`flip-card w-full max-w-2xl h-[450px] cursor-pointer ${isFlipped ? 'flipped' : ''}`}
      onClick={(e) => {
        // Prevent flipping if clicking a button inside (future proofing)
        if(e.target.tagName !== 'BUTTON') setIsFlipped(!isFlipped)
      }}
    >
      <div className="flip-card-inner">
        {/* Front */}
        <div className="flip-card-front">
          <div className="flashcard flex flex-col justify-center items-center p-6">
            <span className="absolute top-4 left-4 text-sm text-gray-400 uppercase tracking-widest">Question</span>
            
            {card.questionImage && (
              <img src={card.questionImage} alt="Visual Aid" className="max-h-32 mb-4 rounded shadow-md object-contain" />
            )}
            
            <h2 className="text-2xl font-bold text-center leading-relaxed overflow-y-auto max-h-[200px]">
              {card.question}
            </h2>
            
            <p className="absolute bottom-4 text-sm text-gray-400 animate-pulse">
              Tap to flip ↻
            </p>
          </div>
        </div>

        {/* Back */}
        <div className="flip-card-back">
          <div className="flashcard flex flex-col justify-center items-center p-6">
            <span className="absolute top-4 left-4 text-sm text-gray-400 uppercase tracking-widest">Answer</span>
            
            {card.answerImage && (
              <img src={card.answerImage} alt="Visual Aid" className="max-h-32 mb-4 rounded shadow-md object-contain" />
            )}

            <div className="text-lg text-center leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[250px] w-full">
              {card.answer}
            </div>
            
            {card.source && (
              <span className="absolute bottom-4 right-4 text-xs bg-black/20 px-2 py-1 rounded">
                Source: {card.source}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Flashcard