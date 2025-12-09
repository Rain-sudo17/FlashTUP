import React, { useState, useMemo } from 'react'

function SearchFilter({ flashcards, onFilteredCards, currentIndex, setCurrentIndex }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all') 

  const filteredCards = useMemo(() => {
    let filtered = [...flashcards]

    // Apply status filter
    if (filterType === 'mastered') {
      filtered = filtered.filter(card => card.mastered)
    } else if (filterType === 'review') {
      filtered = filtered.filter(card => card.reviewLater)
    } else if (filterType === 'remaining') {
      filtered = filtered.filter(card => !card.mastered && !card.reviewLater)
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(card => 
        card.question.toLowerCase().includes(query) ||
        card.answer.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [flashcards, searchQuery, filterType])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }
  
  // Trigger parent update when filtered list changes
  React.useEffect(() => {
    onFilteredCards(filteredCards)
  }, [filteredCards, onFilteredCards])

  const stats = useMemo(() => ({
    all: flashcards.length,
    mastered: flashcards.filter(c => c.mastered).length,
    review: flashcards.filter(c => c.reviewLater).length,
    remaining: flashcards.filter(c => !c.mastered && !c.reviewLater).length
  }), [flashcards])

  const getFilterButtonClass = (type, activeColor) => {
    const isActive = filterType === type;
    const baseClass = "px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border cursor-pointer";
    
    if (isActive) {
        return `${baseClass} ${activeColor} text-white shadow-lg scale-105`;
    }
    return `${baseClass} bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20`;
  }

  return (
    <div className="w-full mb-8 animate-fadeIn">
      {/* Search Input */}
      <div className="relative group mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <input 
          type="text" 
          className="relative w-full bg-[#0f172a]/80 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500/50 focus:bg-[#0f172a] transition-all duration-300 shadow-xl"
          placeholder="🔍 Search questions or answers..." 
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button 
          className={getFilterButtonClass('all', 'bg-indigo-600 border-indigo-500 shadow-indigo-500/30')}
          onClick={() => setFilterType('all')}
        >
          All ({stats.all})
        </button>
        <button 
          className={getFilterButtonClass('mastered', 'bg-green-600 border-green-500 shadow-green-500/30')}
          onClick={() => setFilterType('mastered')}
        >
          ✓ Mastered ({stats.mastered})
        </button>
        <button 
          className={getFilterButtonClass('review', 'bg-orange-500 border-orange-400 shadow-orange-500/30')}
          onClick={() => setFilterType('review')}
        >
          ⚠ Review ({stats.review})
        </button>
        <button 
          className={getFilterButtonClass('remaining', 'bg-purple-600 border-purple-500 shadow-purple-500/30')}
          onClick={() => setFilterType('remaining')}
        >
          📝 Remaining ({stats.remaining})
        </button>
      </div>
    </div>
  )
}

export default SearchFilter