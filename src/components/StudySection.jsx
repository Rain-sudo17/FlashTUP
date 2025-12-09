import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useFlashcards } from '../context/FlashcardContext'
import { useToast } from '../context/ToastContext'
import Flashcard from './Flashcard'
import SearchFilter from './SearchFilter'
import SpacedRepetitionPanel from './SpacedRepetitionPanel'
import QuizModeSelector from './QuizModeSelector'
import QuizMode from './QuizMode'
import ExportButton from './ExportButton'
import KeyboardHelp from './KeyboardHelp'
import useKeyboardNavigation from '../hooks/useKeyboardNavigation'
import AppTools from "../AppTools/Utils";
import SpacedRepetition from "../AppTools/SpacedRepetition";

function StudySection() {
  const {
    flashcards,
    currentSetName,
    updateCard,
    updateAllCards,
    isStudyMode,
    saveCurrentSet,
    resetStudy
  } = useFlashcards()

  // Initialize with data immediately
  const [filteredCards, setFilteredCards] = useState(flashcards || [])
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // UI States
  const [editMode, setEditMode] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [useSpacedRepetition, setUseSpacedRepetition] = useState(false)
  const [viewMode, setViewMode] = useState('study') 
  const [selectedQuizMode, setSelectedQuizMode] = useState(null)
  const [quizResults, setQuizResults] = useState(null)

  // Sync data
  useEffect(() => {
    if (flashcards && flashcards.length > 0) {
      setFilteredCards(flashcards)
      if (currentIndex >= flashcards.length) setCurrentIndex(0)
    }
  }, [flashcards])

  const displayCards = useMemo(() => {
    if (!filteredCards || filteredCards.length === 0) return []
    if (useSpacedRepetition) return SpacedRepetition.sortByPriority(filteredCards)
    return filteredCards
  }, [filteredCards, useSpacedRepetition])

  const currentCard = displayCards[currentIndex]

  // Stats Logic
  const stats = useMemo(() => {
    if (!flashcards) return { total: 0, mastered: 0, review: 0, percentComplete: 0 }
    const total = flashcards.length
    const mastered = flashcards.filter(c => c.mastered).length
    const review = flashcards.filter(c => c.reviewLater).length
    const reviewed = mastered + review
    return {
      total,
      mastered,
      review,
      remaining: total - reviewed,
      reviewed,
      percentComplete: total > 0 ? Math.round((reviewed / total) * 100) : 0
    }
  }, [flashcards])

  const nextCard = useCallback(() => {
    if (currentIndex < displayCards.length - 1) setCurrentIndex(p => p + 1)
  }, [currentIndex, displayCards.length])

  const previousCard = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(p => p - 1)
  }, [currentIndex])

  const markAsMastered = useCallback(() => {
    if (!currentCard) return
    const index = flashcards.findIndex(c => c.question === currentCard.question)
    updateCard(index, { mastered: true, reviewLater: false })
    setShowConfetti(true)
    setTimeout(() => {
        setShowConfetti(false)
        if (currentIndex < displayCards.length - 1) nextCard()
    }, 600)
  }, [currentCard, flashcards, currentIndex, displayCards.length])

  const markForReview = useCallback(() => {
    if (!currentCard) return
    const index = flashcards.findIndex(c => c.question === currentCard.question)
    updateCard(index, { reviewLater: true, mastered: false })
    setTimeout(() => {
        if (currentIndex < displayCards.length - 1) nextCard()
    }, 300)
  }, [currentCard, flashcards, currentIndex, displayCards.length])

  const unmarkCard = useCallback(() => {
     if (!currentCard) return
    const index = flashcards.findIndex(c => c.question === currentCard.question)
    updateCard(index, { mastered: false, reviewLater: false })
  }, [currentCard, flashcards])

  const toggleEditMode = useCallback(() => setEditMode(prev => !prev), [])
  const handleSave = useCallback(() => saveCurrentSet(), [saveCurrentSet])
  
  const handleBack = useCallback(() => {
    if (flashcards.some(c => c.mastered || c.reviewLater)) {
      if (window.confirm('Save progress before exiting?')) saveCurrentSet()
    }
    resetStudy()
  }, [flashcards, saveCurrentSet, resetStudy])

  useKeyboardNavigation({
    onLeft: previousCard,
    onRight: nextCard,
    onM: markAsMastered,
    onR: markForReview,
    enabled: !editMode && viewMode === 'study'
  })

  // Completion Check
  useEffect(() => {
    if (stats.total > 0 && stats.remaining === 0 && viewMode === 'study' && !showCompletion) {
      setShowCompletion(true)
    }
  }, [stats.remaining, stats.total, viewMode])

  if (!isStudyMode) return null
  if (!flashcards || flashcards.length === 0) return <div className="text-center pt-20">Loading Deck...</div>
  
  if (!currentCard) {
     return (
        <div className="max-w-4xl mx-auto pt-10">
            <SearchFilter flashcards={flashcards} onFilteredCards={setFilteredCards} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
            <div className="dashboard-card text-center p-12 mt-6">
                <h3 className="text-xl font-bold text-white">No Matches Found</h3>
                <button className="btn-primary-glow mt-4" onClick={() => setFilteredCards(flashcards)}>Reset Filters</button>
            </div>
        </div>
     )
  }

  // Quiz Views
  if (viewMode === 'quiz') return <QuizMode flashcards={flashcards} mode={selectedQuizMode} onExit={() => setViewMode('study')} onComplete={(res) => { setQuizResults(res); setViewMode('quiz-results'); }} />
  if (viewMode === 'quiz-results') return ( <div className="dashboard-card max-w-xl mx-auto mt-10 text-center"><h2 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h2><p className="text-2xl text-indigo-300 mb-8">{quizResults?.percentage}% Score</p><button className="btn-primary-glow" onClick={() => setViewMode('study')}>Back to Study</button></div> )
  if (viewMode === 'quiz-select') return ( <div className="max-w-4xl mx-auto mt-10"><QuizModeSelector onStartQuiz={(mode) => { setSelectedQuizMode(mode); setViewMode('quiz'); }} /><button className="btn-gray w-full mt-4" onClick={() => setViewMode('study')}>Cancel</button></div> )

  return (
    <div className="max-w-7xl mx-auto pb-20 pt-6 px-4">
      
      {/* === HEADER BAR (Fixed Layout) === */}
      <div className="dashboard-card mb-8 p-6">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-8">
          
          {/* LEFT: Info */}
          <div className="flex items-center gap-6 w-full xl:w-auto">
             <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">📚</div>
             <div>
                <h2 className="text-2xl font-bold text-white font-heading">{currentSetName}</h2>
                {/* FIXED: Text is to the right of the logo now */}
                <p className="text-lg text-indigo-200 mt-1">
                  Card <span className="text-white font-bold">{currentIndex + 1}</span> of {displayCards.length}
                </p>
             </div>
          </div>
          
          {/* CENTER: Progress Bar */}
          <div className="flex-1 w-full xl:max-w-md">
              <div className="h-4 bg-gray-700/50 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" style={{ width: `${stats.percentComplete}%` }}></div>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mt-2 font-medium">
                  {/* FIXED: Spacing in text */}
                  <span>{stats.mastered} Mastered</span>
                  <span>{stats.remaining} To Go</span>
              </div>
          </div>

          {/* RIGHT: Controls (Spaced Out) */}
          <div className="flex flex-wrap justify-center gap-4 w-full xl:w-auto">
              <ExportButton />
              <KeyboardHelp />
              <button className="btn-purple" onClick={() => setViewMode('quiz-select')}>🎮 Quiz</button>
              <button className="btn-gray" onClick={() => setUseSpacedRepetition(!useSpacedRepetition)}>
                  {useSpacedRepetition ? '🧠 SR ON' : '🧠 SR OFF'}
              </button>
              <button className="btn-gray bg-red-500/10 hover:bg-red-500/20 text-red-200 border-red-500/20" onClick={handleBack}>
                 ✕ Exit
              </button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <SearchFilter flashcards={flashcards} onFilteredCards={setFilteredCards} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
      </div>

      {useSpacedRepetition && (
        <div className="dashboard-card mb-6 text-white text-sm p-4 text-center">
             <span className="font-bold text-indigo-300">Spaced Repetition Active: </span>
             <span>Reviewing based on priority</span>
        </div>
      )}

      {/* FLASHCARD AREA */}
      <div className="relative flex items-center justify-center mb-10">
         {showConfetti && <ConfettiEffect />}
         <div className="w-full max-w-4xl">
            <Flashcard 
                card={currentCard}
                editMode={editMode}
                onUpdate={(u) => { updateCard(flashcards.findIndex(c=>c.question===currentCard.question), u); setEditMode(false); }}
                onCancelEdit={() => setEditMode(false)}
            />
         </div>
      </div>

      {/* BOTTOM NAVIGATION CONTROLS */}
      {!useSpacedRepetition && (
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">
         
         <div className="md:col-span-3">
            <button className="btn-gray w-full h-16 text-xl" onClick={previousCard} disabled={currentIndex === 0}>
                ← Prev
            </button>
         </div>
         
         <div className="md:col-span-6 grid grid-cols-2 gap-4">
            {currentCard.mastered || currentCard.reviewLater ? (
                <button className="col-span-2 btn-gray w-full h-16" onClick={unmarkCard}>↩ Undo Status</button>
            ) : (
                <>
                    <button className="btn-orange w-full h-16 flex flex-col items-center justify-center leading-none" onClick={markForReview}>
                        <span className="text-xl mb-1">🤔</span>
                        <span className="text-xs font-bold uppercase">Hard</span>
                    </button>
                    <button className="btn-green w-full h-16 flex flex-col items-center justify-center leading-none" onClick={markAsMastered}>
                        <span className="text-xl mb-1">✅</span>
                        <span className="text-xs font-bold uppercase">Easy</span>
                    </button>
                </>
            )}
         </div>

         <div className="md:col-span-3">
             <button className="btn-primary-glow w-full h-16 text-xl" onClick={nextCard} disabled={currentIndex === displayCards.length - 1}>
                Next →
            </button>
         </div>
      </div>
      )}

      {showCompletion && (
         <CompletionModal stats={stats} onClose={() => setShowCompletion(false)} onRestart={() => { setShowCompletion(false); setCurrentIndex(0); }} onTakeQuiz={() => setViewMode('quiz-select')} />
      )}
    </div>
  )
}

const ConfettiEffect = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
    {[...Array(20)].map((_, i) => (
      <div key={i} className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, animationDuration: '1s' }}></div>
    ))}
  </div>
)

const CompletionModal = ({ stats, onClose, onRestart, onTakeQuiz }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
     <div className="dashboard-card max-w-lg w-full text-center p-10 animate-slideIn">
        <div className="text-7xl mb-6">🎉</div>
        <h2 className="text-4xl font-bold text-white mb-2">Set Completed!</h2>
        <p className="text-xl text-indigo-200 mb-10">You've reviewed all {stats.total} cards.</p>
        <div className="space-y-4">
            <button className="btn-primary-glow w-full py-4 text-lg" onClick={onRestart}>Review Again</button>
            <button className="btn-purple w-full py-4 text-lg" onClick={onTakeQuiz}>Take a Quiz</button>
            <button className="btn-gray w-full py-4 text-lg" onClick={onClose}>Back to Menu</button>
        </div>
     </div>
  </div>
)

export default StudySection