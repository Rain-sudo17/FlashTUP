import React, { useState, useRef, useEffect } from 'react'

function KeyboardHelp() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const shortcuts = [
    { key: '←', action: 'Previous card' },
    { key: '→', action: 'Next card' },
    { key: 'Space', action: 'Flip card' },
    { key: 'M', action: 'Mark Mastered' },
    { key: 'R', action: 'Mark Review' },
    { key: '?', action: 'Toggle Help' },
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* TRIGGER BUTTON - Matches Export/Print style */}
      <button 
        className={`
            px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-300 border
            ${isOpen 
                ? 'bg-white/20 text-white border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
            }
        `}
        onClick={() => setIsOpen(!isOpen)}
        title="Keyboard shortcuts"
      >
        <span>⌨️</span>
        <span className="hidden xl:inline">Shortcuts</span>
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-4 w-72 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 animate-slideIn origin-top-right overflow-hidden">
           
           {/* Header */}
           <div className="bg-white/5 px-5 py-3 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">Keyboard Controls</h3>
              <span className="text-xs text-gray-500">Press key</span>
           </div>

           {/* List */}
           <div className="p-2">
              {shortcuts.map((shortcut, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center p-3 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <span className="text-indigo-200 text-sm font-medium group-hover:text-white transition-colors">
                    {shortcut.action}
                  </span>
                  
                  {/* Styled Key - Looks like a physical key */}
                  <kbd className="min-w-[32px] h-8 px-2 flex items-center justify-center bg-[#1e293b] text-white font-mono text-xs font-bold rounded-lg border-b-2 border-r-2 border-black/50 shadow-sm group-hover:translate-y-[1px] group-hover:border-b-0 group-hover:shadow-none transition-all">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  )
}

export default KeyboardHelp