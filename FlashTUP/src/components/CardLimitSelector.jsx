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
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-400 font-medium">Cards to generate:</label>
      <div className="flex gap-2 flex-wrap">
        {limits.map((limit) => (
          <button
            key={limit.value}
            className={`limit-btn ${currentLimit === limit.value ? 'active' : ''}`}
            onClick={() => onLimitChange(limit.value)}
          >
            {limit.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CardLimitSelector