import React, { useMemo } from 'react';
import { useFlashcards } from '../context/FlashcardContext';
// FIXED: Updated import path to AppTools
import Utils from "../AppTools/Utils";

function StatsModal({ onClose }) {
  const { savedSets } = useFlashcards();

  const stats = useMemo(() => ({
    totalSets: savedSets.length,
    totalCards: savedSets.reduce((sum, set) => sum + set.stats.total, 0),
    totalMastered: savedSets.reduce((sum, set) => sum + set.stats.mastered, 0),
    totalReview: savedSets.reduce((sum, set) => sum + set.stats.review, 0)
  }), [savedSets]);

  return (
    <div 
      className="modal active" 
      onClick={onClose}
      role="dialog"
      aria-labelledby="stats-modal-title"
      aria-modal="true"
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="stats-modal-title" className="text-2xl font-bold text-white">
            📊 Your Learning Progress
          </h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stat-card stat-card-indigo">
            <div className="stat-number">{stats.totalSets}</div>
            <div className="stat-label">Decks Created</div>
          </div>
          <div className="stat-card stat-card-purple">
            <div className="stat-number">{stats.totalCards}</div>
            <div className="stat-label">Total Cards</div>
          </div>
          <div className="stat-card stat-card-green">
            <div className="stat-number">{stats.totalMastered}</div>
            <div className="stat-label">Mastered</div>
          </div>
          <div className="stat-card stat-card-orange">
            <div className="stat-number">{stats.totalReview}</div>
            <div className="stat-label">Needs Review</div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <h3 className="text-xl font-bold text-white mb-4">Performance by Deck</h3>
        
        {savedSets.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No study data available yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-white border-collapse">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-3">Deck Name</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Progress</th>
                  <th className="p-3 text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {savedSets.map((set, idx) => {
                  const percent = Math.round((set.stats.mastered / set.stats.total) * 100) || 0;
                  return (
                    <tr key={idx} className="border-b border-white/10 hover:bg-white/5">
                      <td className="p-3 font-medium">{set.name}</td>
                      <td className="p-3 text-sm opacity-80">{Utils.formatDate(set.date)}</td>
                      <td className="p-3">
                        <div className="w-24 bg-gray-700/50 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${percent >= 80 ? 'bg-green-500' : percent >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-3 text-right font-bold">{percent}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button className="btn btn-primary" onClick={onClose}>
            Close Stats
          </button>
        </div>
      </div>
    </div>
  );
}

export default StatsModal;