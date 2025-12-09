import React, { useState, useMemo, useCallback } from 'react';

// FIXED: All imports now start with "../" to point to the separate folder
import MultipleChoiceQuiz from "./quiz-modes/MultipleChoiceQuiz";
import FillBlankQuiz from "./quiz-modes/FillBlankQuiz";
import MatchingQuiz from "./quiz-modes/MatchingQuiz";
import FlashcardQuiz from "./quiz-modes/FlashCardQuiz";

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

    // For matching mode, we might process differently, but generally:
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
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{mode.replace('-', ' ').toUpperCase()} QUIZ</h2>
            {mode !== 'matching' && (
              <p className="text-white opacity-90">Question {currentIndex + 1} of {flashcards.length}</p>
            )}
          </div>
          <div className="text-right text-white">
            {mode !== 'matching' && (
              <>
                <p className="text-3xl font-bold">{score}/{flashcards.length}</p>
                <p className="text-sm">Score</p>
              </>
            )}
          </div>
        </div>
        {mode !== 'matching' && (
          <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>
      
      {renderQuizMode()}
      
      <button className="btn btn-gray w-full mt-6" onClick={onExit}>
        ← Exit Quiz
      </button>
    </div>
  );
}

export default QuizMode;