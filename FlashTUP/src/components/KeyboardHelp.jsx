import React, { useState } from 'react'

function KeyboardHelp() {
  const [isOpen, setIsOpen] = useState(false)

  const shortcuts = [
    { key: '←', action: 'Previous card', category: 'Navigation' },
    { key: '→', action: 'Next card', category: 'Navigation' },
    { key: 'Space', action: 'Flip card', category: 'Navigation' },
    { key: 'M', action: 'Mark as mastered', category: 'Actions' },
    { key: 'R', action: 'Mark for review', category: 'Actions' },
    { key: '?', action: 'Show this help', category: 'Help' },
  ]

  return (
    <>
      <button 
        className="btn btn-sm btn-gray"
        onClick={() => setIsOpen(true)}
        title="Keyboard shortcuts"
      >
        ⌨️ Shortcuts
      </button>

      {isOpen && (
        <div 
          className="modal active" 
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="modal-content max-w-md" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                ⌨️ Keyboard Shortcuts
              </h2>
              <button
                className="text-white hover:text-gray-300 text-3xl leading-none"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center p-3 bg-white bg-opacity-10 rounded-lg"
                >
                  <span className="text-white">{shortcut.action}</span>
                  <kbd className="bg-gray-700 px-3 py-1 rounded text-white font-mono border border-gray-500">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default KeyboardHelp