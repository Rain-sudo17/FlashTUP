import React, { useState, useMemo } from 'react'

function SearchFilter({ flashcards, onFilteredCards, currentIndex, setCurrentIndex }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all') // all, mastered, review, remaining

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
    onFilteredCards(filteredCards)
    if (currentIndex >= filteredCards.length) {
      setCurrentIndex(0)
    }
  }

  const handleFilterChange = (type) => {
    setFilterType(type)
    // We rely on the useEffect in parent or immediate update logic
    // But since filteredCards is a memo, we might need to pass the result directly in a real implementation
    // For this snippet, we assume parent updates via effect or we pass explicit filtered list if logic allows.
    // Ideally, StudySection should handle the actual filtering, but based on this architecture:
    // We just trigger a callback or let the parent know filters changed. 
    // *Self-correction based on StudySection logic*: The parent uses `setFilteredCards`.
    // We need to trigger `onFilteredCards` whenever `filteredCards` changes.
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

  return (
    <div className="card mb-6">
      <h3 className="text-lg font-bold text-white mb-3">🔍 Search & Filter</h3>
      
      {/* Search Input */}
      <div className="mb-4">
        <input 
          type="text" 
          className="input-field w-full"
          placeholder="Search questions or answers..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-gray'}`}
          onClick={() => setFilterType('all')}
        >
          All ({stats.all})
        </button>
        <button 
          className={`btn btn-sm ${filterType === 'mastered' ? 'btn-green' : 'btn-gray'}`}
          onClick={() => setFilterType('mastered')}
        >
          ✓ Mastered ({stats.mastered})
        </button>
        <button 
          className={`btn btn-sm ${filterType === 'review' ? 'btn-orange' : 'btn-gray'}`}
          onClick={() => setFilterType('review')}
        >
          ⚠ Review ({stats.review})
        </button>
        <button 
          className={`btn btn-sm ${filterType === 'remaining' ? 'btn-purple' : 'btn-gray'}`}
          onClick={() => setFilterType('remaining')}
        >
          📝 Remaining ({stats.remaining})
        </button>
      </div>
    </div>
  )
}

export default SearchFilter