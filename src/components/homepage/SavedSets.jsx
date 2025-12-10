import React from 'react';
import { useFlashcards } from '../../context/FlashcardContext';
import AppTools from "../../AppTools/Utils";

function SavedSets() {
  const { savedSets, loadSet, deleteSet } = useFlashcards();

  // Helper to safely format date
  const safeFormatDate = (dateString) => {
    if (AppTools && typeof AppTools.formatDate === 'function') {
      return AppTools.formatDate(dateString);
    }
    return new Date(dateString).toLocaleDateString();
  };

  if (savedSets.length === 0) {
    return (
      <div className="mt-8 p-12 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5 opacity-70">
        <div className="text-5xl mb-4 opacity-50">📂</div>
        <h3 className="text-xl font-bold text-white mb-2">No Saved Sets Yet</h3>
        <p className="text-indigo-200">Generate a deck above to start building your library.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 animate-fadeIn">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">📚</span>
        <h2 className="text-3xl font-bold text-white font-heading">
           Your Collection
        </h2>
        <span className="bg-white/10 text-white text-xs font-bold px-2 py-1 rounded-full border border-white/10">
            {savedSets.length}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedSets.map((set, index) => {
            const percent = set.stats && set.stats.total > 0 
                ? Math.round((set.stats.mastered / set.stats.total) * 100) 
                : 0;

            return (
            <div 
                key={index} 
                className="group relative bg-[#0f172a] border border-white/10 rounded-3xl p-6 hover:bg-white/5 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between"
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform">
                        📝
                    </div>
                    <span className="bg-white/5 border border-white/10 text-gray-400 text-xs font-bold px-3 py-1 rounded-full">
                        {set.cards ? set.cards.length : 0} Cards
                    </span>
                </div>

                {/* Title & Date */}
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 group-hover:text-indigo-300 transition-colors">
                        {set.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                        Created: {safeFormatDate(set.date)}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                        <span>Mastery</span>
                        <span className={percent === 100 ? 'text-green-400' : 'text-white'}>{percent}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden border border-white/5">
                        <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                                percent >= 80 ? 'bg-green-500' : 
                                percent >= 50 ? 'bg-yellow-500' : 
                                'bg-indigo-500'
                            }`}
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/5">
                    <button 
                        className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20"
                        onClick={() => loadSet(index)}
                    >
                        Open Deck
                    </button>
                    <button 
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-white/5 transition-colors"
                        onClick={() => deleteSet(index)}
                        title="Delete Deck"
                    >
                        🗑
                    </button>
                </div>
            </div>
            );
        })}
      </div>
    </div>
  );
}

export default SavedSets;