'use client'

import React from 'react'

interface NutrientBarProps {
  name: string
  symbol: string
  value: number
  unit: string
  lowThreshold: number
  highThreshold: number
  description: string
}

export function NutrientBar({
  name,
  symbol,
  value,
  unit,
  lowThreshold,
  highThreshold,
  description,
}: NutrientBarProps) {
  let status: 'Low' | 'Medium' | 'High' = 'Medium'
  let color = 'bg-amber-500'
  let textColor = 'text-amber-700'
  let badgeBg = 'bg-amber-50 text-amber-700 border-amber-200'

  if (value < lowThreshold) {
    status = 'Low'
    color = 'bg-rose-500'
    textColor = 'text-rose-700'
    badgeBg = 'bg-rose-50 text-rose-700 border-rose-200'
  } else if (value > highThreshold) {
    status = 'High'
    color = 'bg-emerald-600'
    textColor = 'text-emerald-700'
    badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }

  // Calculate percentage fill relative to 1.5x high threshold
  const maxScale = highThreshold * 1.6
  const percent = Math.min(Math.round((value / maxScale) * 100), 100)

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-100">
            {symbol}
          </span>
          <div>
            <div className="text-sm font-semibold text-slate-800">{name}</div>
            <div className="text-[11px] text-slate-500">{description}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-base font-bold text-slate-900">
            {value} <span className="text-xs font-normal text-slate-500">{unit}</span>
          </div>
          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border ${badgeBg}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Progress Bar with markers */}
      <div className="relative pt-1">
        <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-slate-100">
          <div
            style={{ width: `${percent}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${color}`}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
          <span>0</span>
          <span>Low (&lt;{lowThreshold})</span>
          <span>Optimal ({lowThreshold}-{highThreshold})</span>
          <span>High (&gt;{highThreshold})</span>
        </div>
      </div>
    </div>
  )
}
