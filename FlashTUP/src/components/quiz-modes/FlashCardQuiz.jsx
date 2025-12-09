import React, { useState } from 'react';
// FIXED: This path now correctly points to the components folder
import Flashcard from "../components/Flashcard"; 

function FlashcardQuiz({ card, onAnswer }) {
  const [hasFlipped, setHasFlipped] = useState(false);

  // We wrap the onUpdate logic just to satisfy the prop requirement, 
  // though we don't save changes during a quiz.
  const handleDummyUpdate = () => {};

  return (
    <div className="flex flex-col items-center">
      <div className="card mb-6 w-full text-center">
        <h3 className="text-xl font-bold text-white mb-2">Self-Assessment</h3>
        <p className="text-gray-300 text-sm">
          Flip the card to reveal the answer, then grade yourself.
        </p>
      </div>

      {/* We listen to the internal flip state by checking if the user clicks.
          Since Flashcard handles its own flip state, we just provide the buttons 
          below it.
      */}
      <div 
        className="w-full flex justify-center mb-6"
        onClick={() => setHasFlipped(true)}
      >
        <Flashcard 
          card={card} 
          editMode={false} 
          onUpdate={handleDummyUpdate} 
          onCancelEdit={() => {}} 
        />
      </div>

      {hasFlipped && (
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg animate-slideIn">
          <button 
            className="btn btn-red py-4"
            onClick={() => onAnswer(false, 'Missed')}
          >
            ❌ I Didn't Know It
          </button>
          <button 
            className="btn btn-green py-4"
            onClick={() => onAnswer(true, 'Mastered')}
          >
            ✅ I Knew It
          </button>
        </div>
      )}
      
      {!hasFlipped && (
         <p className="text-white animate-pulse mt-4">
           (Tap the card to flip it)
         </p>
      )}
    </div>
  );
}

export default FlashcardQuiz;