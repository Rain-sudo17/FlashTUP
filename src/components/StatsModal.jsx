import React, { useMemo } from 'react';
import { useFlashcards } from '../context/FlashcardContext';
import Utils from "../AppTools/Utils";

function StatsModal({ onClose }) {
  const { savedSets, flashcards, isStudyMode, currentSetName } = useFlashcards();

  // Combine Saved Sets + Current Active Session (if it's not saved yet)
  const displaySets = useMemo(() => {
    // 1. Start with saved sets
    const sets = [...savedSets];

    // 2. Check if we have an active session that ISN'T in the saved list yet
    if (isStudyMode && flashcards.length > 0) {
       // We compare names to check if it's already saved
       const isAlreadySaved = savedSets.some(s => s.name === currentSetName);
       
       if (!isAlreadySaved) {
          // Calculate stats for the current session on the fly
          const currentStats = {
             total: flashcards.length,
             mastered: flashcards.filter(c => c.mastered).length,
             review: flashcards.filter(c => c.reviewLater).length
          };

          // Add to the top of the list as a "Draft"
          sets.unshift({
             name: currentSetName || "Current Session (Unsaved)",
             date: new Date().toISOString(),
             stats: currentStats,
             isDraft: true // Flag to style it differently
          });
       }
    }
    return sets;
  }, [savedSets, flashcards, isStudyMode, currentSetName]);

  // Calculate Totals based on the combined list
  const stats = useMemo(() => ({
    totalSets: displaySets.length,
    totalCards: displaySets.reduce((sum, set) => sum + set.stats.total, 0),
    totalMastered: displaySets.reduce((sum, set) => sum + set.stats.mastered, 0),
    totalReview: displaySets.reduce((sum, set) => sum + set.stats.review, 0)
  }), [displaySets]);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-[#0f172a] border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl relative flex flex-col animate-slideIn"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-8 border-b border-white/10 bg-white/5">
          <div>
            <h2 className="text-3xl font-bold text-white font-heading">
              📊 Your Learning Progress
            </h2>
            <p className="text-indigo-200 text-sm mt-1">Track your mastery across all decks</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white text-xl transition-colors"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
            
            {/* STAT CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">📚</div>
                    <div className="text-4xl font-extrabold text-white mb-1">{stats.totalSets}</div>
                    <div className="text-indigo-300 font-bold uppercase text-xs tracking-widest">Active Decks</div>
                </div>

                <div className="p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🃏</div>
                    <div className="text-4xl font-extrabold text-white mb-1">{stats.totalCards}</div>
                    <div className="text-purple-300 font-bold uppercase text-xs tracking-widest">Total Cards</div>
                </div>

                <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">✅</div>
                    <div className="text-4xl font-extrabold text-green-400 mb-1">{stats.totalMastered}</div>
                    <div className="text-green-300 font-bold uppercase text-xs tracking-widest">Mastered</div>
                </div>

                <div className="p-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">⏳</div>
                    <div className="text-4xl font-extrabold text-orange-400 mb-1">{stats.totalReview}</div>
                    <div className="text-orange-300 font-bold uppercase text-xs tracking-widest">Needs Review</div>
                </div>
            </div>

            {/* TABLE SECTION */}
            <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-indigo-500 pl-4">Performance by Deck</h3>
            
            {displaySets.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                    <p className="text-gray-400 text-lg">No study data available yet.</p>
                    <p className="text-gray-500 text-sm mt-2">Generate a deck to start tracking stats.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-white/10">
                    <table className="w-full text-left text-white border-collapse">
                    <thead>
                        <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                            <th className="p-4 font-bold">Deck Name</th>
                            <th className="p-4 font-bold">Date</th>
                            <th className="p-4 font-bold w-1/3">Mastery Progress</th>
                            <th className="p-4 font-bold text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {displaySets.map((set, idx) => {
                        const percent = Math.round((set.stats.mastered / set.stats.total) * 100) || 0;
                        return (
                            <tr key={idx} className={`transition-colors group ${set.isDraft ? 'bg-indigo-500/5' : 'hover:bg-white/5'}`}>
                                <td className="p-4 font-medium text-indigo-200 group-hover:text-white transition-colors">
                                    {set.name}
                                    {set.isDraft && <span className="ml-2 text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Unsaved</span>}
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {Utils.formatDate(set.date)}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    percent >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 
                                                    percent >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' : 
                                                    'bg-gray-600'
                                                }`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <span className={`font-bold px-2 py-1 rounded text-xs ${
                                        percent >= 80 ? 'bg-green-500/20 text-green-400' : 
                                        percent >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 
                                        'bg-gray-700 text-gray-400'
                                    }`}>
                                        {percent}%
                                    </span>
                                </td>
                            </tr>
                        );
                        })}
                    </tbody>
                    </table>
                </div>
            )}
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-white/10 bg-[#0f172a] flex justify-end">
          <button 
            className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/5"
            onClick={onClose}
          >
            Close Stats
          </button>
        </div>

      </div>
    </div>
  );
}

export default StatsModal;