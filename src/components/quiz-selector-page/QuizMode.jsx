import React, { useState, useMemo, useCallback } from 'react';
import MultipleChoiceQuiz from "../quiz-modes/MultipleChoiceQuiz";
import FillBlankQuiz from "../quiz-modes/FillBlankQuiz";
import MatchingQuiz from "../quiz-modes/MatchingQuiz";
import FlashcardQuiz from "../quiz-modes/FlashCardQuiz";

function QuizMode({ flashcards, mode, onExit, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const currentCard = useMemo(() => flashcards[currentIndex], [flashcards, currentIndex]);
  const progress = useMemo(() => ((currentIndex + 1) / flashcards.length) * 100, [currentIndex, flashcards.length]);

  const handleAnswer = useCallback((isCorrect, userAnswer) => {
    setAnswers(prev => [...prev, { 
      card: currentCard, 
      userAnswer, 
      isCorrect, 
      timestamp: new Date().toISOString() 
    }]);

    if (isCorrect) setScore(prev => prev + 1);

    if (mode === 'matching') {
        // Matching quiz handles its own completion internally
        return;
    }

    // Move to next card
    if (currentIndex < flashcards.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 1000);
    } else {
      setTimeout(() => {
        onComplete({
          score: isCorrect ? score + 1 : score,
          total: flashcards.length,
          percentage: Math.round(((isCorrect ? score + 1 : score) / flashcards.length) * 100),
          answers
        });
      }, 1000);
    }
  }, [currentCard, currentIndex, flashcards.length, score, answers, onComplete, mode]);

  const renderQuizMode = () => {
    switch (mode) {
      case 'multiple-choice':
        return <MultipleChoiceQuiz card={currentCard} allCards={flashcards} onAnswer={handleAnswer} />;
      case 'fill-blank':
        return <FillBlankQuiz card={currentCard} onAnswer={handleAnswer} />;
      case 'matching':
        return <MatchingQuiz cards={flashcards} onComplete={onComplete} />;
      case 'flashcard':
      default:
        return <FlashcardQuiz card={currentCard} onAnswer={handleAnswer} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-8 px-6 pb-20 animate-fadeIn">
      
      {/* HEADER CARD */}
      <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 mb-10 shadow-2xl relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🎮</span>
                <h2 className="text-3xl font-bold text-white font-heading tracking-tight">{mode.replace('-', ' ').toUpperCase()} QUIZ</h2>
            </div>
            {mode !== 'matching' && (
              <p className="text-indigo-200 font-medium">Question <span className="text-white font-bold">{currentIndex + 1}</span> of {flashcards.length}</p>
            )}
          </div>

          <div className="text-right">
            {mode !== 'matching' && (
              <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-sm">
                <p className="text-4xl font-extrabold text-white leading-none">{score}<span className="text-lg text-gray-500 font-normal">/{flashcards.length}</span></p>
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mt-1">Current Score</p>
              </div>
            )}
          </div>
        </div>

        {/* PROGRESS BAR */}
        {mode !== 'matching' && (
          <div className="relative w-full h-4 bg-gray-800 rounded-full overflow-hidden border border-white/5 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-500 ease-out relative" 
                style={{ width: `${progress}%` }}
              >
                  <div className="absolute top-0 right-0 w-1 h-full bg-white/50"></div>
              </div>
          </div>
        )}
      </div>
      
      {/* GAME AREA */}
      <div className="min-h-[400px]">
         {renderQuizMode()}
      </div>
      
      {/* EXIT BUTTON */}
      <button 
        className="w-full mt-12 py-4 rounded-xl bg-white/5 text-gray-400 font-bold hover:bg-white/10 hover:text-white transition-colors border border-white/5 flex items-center justify-center gap-2 group" 
        onClick={onExit}
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span>Exit Quiz</span>
      </button>
    </div>
  );
}

export default QuizMode;