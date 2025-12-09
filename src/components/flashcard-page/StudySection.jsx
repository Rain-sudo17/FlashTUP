import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useFlashcards } from '../../context/FlashcardContext'
import Flashcard from './Flashcard'
import SearchFilter from './SearchFilter'
import QuizModeSelector from '../quiz-selector-page/QuizModeSelector'
import QuizMode from '../quiz-selector-page/QuizMode'
import ExportButton from '../ExportButton'
import KeyboardHelp from '../KeyboardHelp'
import useKeyboardNavigation from '../../hooks/useKeyboardNavigation'
import SpacedRepetition from "../../AppTools/SpacedRepetition";

function StudySection() {
  const {
    flashcards,
    currentSetName,
    updateCard,
    isStudyMode,
    saveCurrentSet,
    resetStudy
  } = useFlashcards()

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
      total, mastered, review, remaining: total - reviewed,
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
  if (!flashcards || flashcards.length === 0) return <div className="text-center pt-20 text-white">Loading Deck...</div>
  
  if (!currentCard) {
      return (
         <div className="max-w-4xl mx-auto pt-40 px-6">
            <SearchFilter flashcards={flashcards} onFilteredCards={setFilteredCards} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center mt-6">
                <h3 className="text-2xl font-bold text-white mb-2">No Matches Found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters or search terms.</p>
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20" onClick={() => setFilteredCards(flashcards)}>Reset Filters</button>
            </div>
         </div>
      )
  }

  // Quiz Views
  if (viewMode === 'quiz') return <QuizMode flashcards={flashcards} mode={selectedQuizMode} onExit={() => setViewMode('study')} onComplete={(res) => { setQuizResults(res); setViewMode('quiz-results'); }} />
  if (viewMode === 'quiz-results') return ( <div className="max-w-xl mx-auto mt-40 text-center"><h2 className="text-4xl font-bold text-white mb-4">Quiz Complete!</h2><p className="text-3xl text-indigo-300 mb-8 font-bold">{quizResults?.percentage}% Score</p><button className="px-8 py-3 bg-indigo-600 rounded-xl text-white font-bold" onClick={() => setViewMode('study')}>Back to Study</button></div> )
  if (viewMode === 'quiz-select') return ( <div className="max-w-4xl mx-auto mt-40"><QuizModeSelector onStartQuiz={(mode) => { setSelectedQuizMode(mode); setViewMode('quiz'); }} /><button className="w-full mt-4 py-3 text-gray-400 hover:text-white" onClick={() => setViewMode('study')}>Cancel</button></div> )

  return (
    <div className="w-full max-w-7xl mx-auto pb-20 pt-32 px-6">
      
      {/* === TOP BAR (Unified Glass Panel) === */}
      <div className="bg-[#0f172a]/80 backdrop-blur-md border border-white/10 rounded-3xl p-4 mb-8 flex flex-col xl:flex-row items-center justify-between gap-6 shadow-2xl relative z-30">
        
        {/* LEFT: Set Info */}
        <div className="flex items-center gap-4 w-full xl:w-auto">
             <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20">📚</div>
             <div>
                <h2 className="text-xl font-bold text-white font-heading truncate max-w-[200px]">{currentSetName}</h2>
                <div className="flex items-center gap-2 text-sm text-indigo-200">
                    <span className="bg-white/10 px-2 py-0.5 rounded text-white font-bold">{currentIndex + 1} / {displayCards.length}</span>
                    <span>Cards</span>
                </div>
             </div>
        </div>
        
        {/* CENTER: Stats & Progress */}
        <div className="flex-1 w-full xl:max-w-2xl px-4">
             <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
                 <span>Progress</span>
                 <span>{stats.percentComplete}% Complete</span>
             </div>
             <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-white/5 relative">
                 <div className="absolute inset-0 bg-indigo-900/30"></div>
                 <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 transition-all duration-700 ease-out" style={{ width: `${stats.percentComplete}%` }}></div>
             </div>
             <div className="flex justify-between mt-2 text-xs font-medium">
                 <span className="text-green-400">{stats.mastered} Mastered</span>
                 <span className="text-orange-400">{stats.review} Review</span>
                 <span className="text-gray-500">{stats.remaining} Left</span>
             </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 w-full xl:w-auto justify-center">
            <ExportButton />
            <KeyboardHelp />
            <div className="h-8 w-px bg-white/10 mx-2"></div>
            <button className="px-4 py-2 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-xl hover:bg-purple-600 hover:text-white transition-all text-sm font-bold" onClick={() => setViewMode('quiz-select')}>
                🎮 Quiz
            </button>
            <button className="px-4 py-2 bg-red-500/10 text-red-300 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all text-sm font-bold" onClick={handleBack}>
                Exit
            </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
          <SearchFilter flashcards={flashcards} onFilteredCards={setFilteredCards} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />

          {useSpacedRepetition && (
            <div className="mb-6 bg-purple-500/10 border border-purple-500/20 text-purple-200 text-sm p-3 rounded-xl text-center animate-fadeIn">
                  🧠 Spaced Repetition Active: Reviewing based on priority
            </div>
          )}

          {/* FLASHCARD AREA */}
          <div className="relative flex flex-col items-center justify-center mb-8">
             {showConfetti && <ConfettiEffect />}
             
             {/* The Card Component */}
             <Flashcard 
                card={currentCard}
                editMode={editMode}
                onUpdate={(u) => { updateCard(flashcards.findIndex(c=>c.question===currentCard.question), u); setEditMode(false); }}
                onCancelEdit={() => setEditMode(false)}
             />

             {/* Edit Button (Floating) */}
             <button 
                onClick={() => setEditMode(true)}
                className="mt-6 text-gray-500 hover:text-white text-sm flex items-center gap-2 transition-colors"
             >
                <span>✏️ Edit this card</span>
             </button>
          </div>

          {/* BOTTOM CONTROLS (Big Glass Buttons) */}
          {!useSpacedRepetition && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {/* Previous */}
             <button 
                className="col-span-1 h-16 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                onClick={previousCard} disabled={currentIndex === 0}
             >
                <span>←</span> <span className="hidden md:inline">Prev</span>
             </button>

             {/* Status Buttons */}
             {currentCard.mastered || currentCard.reviewLater ? (
                 <button className="col-span-2 h-16 rounded-2xl bg-gray-700/50 border border-gray-600 text-gray-300 font-bold hover:bg-gray-700 transition-all" onClick={unmarkCard}>
                    ↩ Undo Status
                 </button>
             ) : (
                 <>
                    <button 
                        className="col-span-1 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold hover:bg-orange-500 hover:text-white hover:shadow-lg hover:shadow-orange-500/20 transition-all flex flex-col items-center justify-center leading-tight group" 
                        onClick={markForReview}
                    >
                        <span className="text-xl group-hover:scale-110 transition-transform">🤔</span>
                        <span className="text-xs uppercase tracking-wider mt-1">Hard</span>
                    </button>
                    <button 
                        className="col-span-1 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 font-bold hover:bg-green-500 hover:text-white hover:shadow-lg hover:shadow-green-500/20 transition-all flex flex-col items-center justify-center leading-tight group" 
                        onClick={markAsMastered}
                    >
                        <span className="text-xl group-hover:scale-110 transition-transform">✅</span>
                        <span className="text-xs uppercase tracking-wider mt-1">Easy</span>
                    </button>
                 </>
             )}

             {/* Next */}
             <button 
                className="col-span-1 h-16 rounded-2xl bg-indigo-600 border border-indigo-500 text-white font-bold hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                onClick={nextCard} disabled={currentIndex === displayCards.length - 1}
             >
                <span className="hidden md:inline">Next</span> <span>→</span>
             </button>
          </div>
          )}

          {showCompletion && (
             <CompletionModal stats={stats} onClose={() => setShowCompletion(false)} onRestart={() => { setShowCompletion(false); setCurrentIndex(0); }} onTakeQuiz={() => setViewMode('quiz-select')} />
          )}
      </div>
    </div>
  )
}

const ConfettiEffect = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
    {[...Array(20)].map((_, i) => (
      <div key={i} className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, animationDuration: '0.8s' }}></div>
    ))}
  </div>
)

const CompletionModal = ({ stats, onClose, onRestart, onTakeQuiz }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-fadeIn">
     <div className="bg-[#0f172a] border border-white/10 max-w-lg w-full text-center p-10 rounded-3xl shadow-2xl relative">
        <div className="text-7xl mb-6 animate-bounce">🎉</div>
        <h2 className="text-4xl font-bold text-white mb-2 font-heading">Set Completed!</h2>
        <p className="text-lg text-indigo-200 mb-8">You've reviewed all {stats.total} cards.</p>
        <div className="space-y-3">
            <button className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition" onClick={onRestart}>Review Again</button>
            <button className="w-full py-4 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold text-lg hover:bg-purple-600 hover:text-white transition" onClick={onTakeQuiz}>Take a Quiz</button>
            <button className="w-full py-4 rounded-xl bg-white/5 text-gray-400 font-bold hover:bg-white/10 transition" onClick={onClose}>Back to Menu</button>
        </div>
     </div>
  </div>
)

export default StudySection