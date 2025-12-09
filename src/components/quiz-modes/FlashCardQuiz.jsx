import React, { useState } from 'react';
// This import remains as you provided
import Flashcard from "../../components/flashcard-page/Flashcard"; 

function FlashcardQuiz({ card, onAnswer }) {
  const [hasFlipped, setHasFlipped] = useState(false);

  // We wrap the onUpdate logic just to satisfy the prop requirement
  const handleDummyUpdate = () => {};

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      
      {/* 1. Styled Header Section */}
      <div className="text-center mb-8 animate-fadeIn">
        <h3 className="text-2xl font-bold text-white mb-2 font-heading tracking-tight">
            Self-Assessment
        </h3>
        <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-200 text-sm font-medium">
             Flip the card to reveal the answer, then grade yourself.
        </div>
      </div>

      {/* 2. Card Container */}
      <div 
        className="w-full flex justify-center mb-8 relative z-10"
        onClick={() => setHasFlipped(true)}
      >
        <Flashcard 
          card={card} 
          editMode={false} 
          onUpdate={handleDummyUpdate} 
          onCancelEdit={() => {}} 
        />
      </div>

      {/* 3. Grading Buttons (Only visible after flip) */}
      <div className="h-24 w-full flex justify-center items-start">
          {hasFlipped ? (
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-xl animate-slideIn">
              
              {/* "Didn't Know" Button - Red Theme */}
              <button 
                className="flex-1 py-4 px-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-lg hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
                onClick={() => onAnswer(false, 'Missed')}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">❌</span>
                <span>I Didn't Know It</span>
              </button>

              {/* "Knew It" Button - Green Theme */}
              <button 
                className="flex-1 py-4 px-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-lg hover:bg-green-500 hover:text-white hover:shadow-lg hover:shadow-green-500/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
                onClick={() => onAnswer(true, 'Mastered')}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">✅</span>
                <span>I Knew It</span>
              </button>

            </div>
          ) : (
            /* Pulsing Hint Text */
            <p className="text-indigo-200/50 animate-pulse font-medium tracking-widest uppercase text-sm mt-4">
               (Tap the card to flip it)
            </p>
          )}
      </div>
    </div>
  );
}

export default FlashcardQuiz;