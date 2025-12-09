import React from 'react';
import { useFlashcards } from '../../context/FlashcardContext';
import AppTools from "../../AppTools/Utils";


function SavedSets() {
  const { savedSets, loadSet, deleteSet } = useFlashcards();

  // Helper function to safely format date
  const safeFormatDate = (dateString) => {
    if (AppTools && typeof AppTools.formatDate === 'function') {
      return AppTools.formatDate(dateString);
    }
    return new Date(dateString).toLocaleDateString();
  };

  if (savedSets.length === 0) {
    return (
      <div className="card text-center opacity-70">
        <h3 className="text-xl font-bold text-white mb-2">No Saved Sets</h3>
        <p className="text-white">Generate flashcards to start building your library.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-shadow">
        📚 Your Saved Collections
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedSets.map((set, index) => (
          <div key={index} className="card hover:bg-white/5 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{set.name}</h3>
                <p className="text-xs text-gray-300">
                  {safeFormatDate(set.date)}
                </p>
              </div>
              <span className="badge badge-review relative top-0 left-0 bg-indigo-500/80 text-white px-2 py-1 rounded text-xs">
                {set.cards ? set.cards.length : 0} Cards
              </span>
            </div>

            <div className="w-full bg-gray-700/50 rounded-full h-2 mb-4">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ 
                  width: `${set.stats && set.stats.total > 0 ? (set.stats.mastered / set.stats.total) * 100 : 0}%` 
                }}
              />
            </div>

            <div className="flex justify-between items-center text-sm text-gray-300 mb-4">
              <span>✓ {set.stats?.mastered || 0} Mastered</span>
              <span>⚠ {set.stats?.review || 0} Review</span>
            </div>

            <div className="flex gap-2">
              <button 
                className="btn btn-sm btn-primary flex-1"
                onClick={() => loadSet(index)}
              >
                📂 Load
              </button>
              <button 
                className="btn btn-sm btn-red"
                onClick={() => deleteSet(index)}
                aria-label="Delete set"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedSets;