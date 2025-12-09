import React from 'react'
import { useFlashcards } from '../context/FlashcardContext'
import { useToast } from '../context/ToastContext'

function ExportButton() {
  const { flashcards, currentSetName } = useFlashcards()
  const { success, error } = useToast()

  const handleExport = () => {
    if (flashcards.length === 0) {
      error('No flashcards to export')
      return
    }

    try {
      const data = {
        name: currentSetName,
        date: new Date().toISOString(),
        cards: flashcards,
        stats: {
          total: flashcards.length,
          mastered: flashcards.filter(c => c.mastered).length,
          review: flashcards.filter(c => c.reviewLater).length
        }
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      
      link.href = url
      link.download = `${currentSetName.replace(/\s+/g, '-')}-${Date.now()}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      success('Flashcards exported successfully!')
    } catch (err) {
      console.error('Export error:', err)
      error('Failed to export flashcards')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      {/* EXPORT BUTTON - Indigo Glass Theme */}
      <button 
        className="px-4 py-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-xl hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-all text-sm font-bold flex items-center gap-2"
        onClick={handleExport}
        title="Export as JSON"
      >
        <span>📥</span>
        <span>Export</span>
      </button>

      {/* PRINT BUTTON - Cyan/Sky Glass Theme */}
      <button 
        className="px-4 py-2 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-xl hover:bg-cyan-600 hover:text-white hover:shadow-lg hover:shadow-cyan-500/20 transition-all text-sm font-bold flex items-center gap-2"
        onClick={handlePrint}
        title="Print flashcards"
      >
        <span>🖨️</span>
        <span>Print</span>
      </button>
    </>
  )
}

export default ExportButton