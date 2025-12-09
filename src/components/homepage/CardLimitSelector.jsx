import React from 'react'

function CardLimitSelector({ onLimitChange, currentLimit }) {
  const limits = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: -1, label: 'Max' }
  ]

  return (
    <div className="flex flex-col items-center gap-3">
      <label className="text-xs font-bold text-indigo-200 uppercase tracking-widest opacity-70">
        Cards to generate
      </label>
      
      <div className="flex gap-3 flex-wrap justify-center bg-white/5 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
        {limits.map((limit) => {
          const isActive = currentLimit === limit.value;
          
          return (
            <button
              key={limit.value}
              onClick={() => onLimitChange(limit.value)}
              className={`
                relative px-5 py-2 rounded-xl font-bold text-sm transition-all duration-300
                border shadow-sm cursor-pointer
                ${isActive 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-indigo-500/40 scale-105' 
                  : 'bg-transparent border-transparent text-gray-400 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              {limit.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CardLimitSelector