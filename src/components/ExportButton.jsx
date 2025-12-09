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
      <button 
        className="btn btn-purple" 
        onClick={handleExport}
        title="Export as JSON"
      >
        📥 Export
      </button>
      <button 
        className="btn btn-purple" 
        onClick={handlePrint}
        title="Print flashcards"
      >
        🖨️ Print
      </button>
    </>
  )
}

export default ExportButton