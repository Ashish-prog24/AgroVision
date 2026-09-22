'use client'

import React from 'react'

interface SoilGaugeProps {
  ph: number
}

export function SoilGauge({ ph = 6.8 }: SoilGaugeProps) {
  // Clamping pH between 4 and 10 for display
  const clampedPh = Math.min(Math.max(ph, 4), 10)
  // 4 maps to -90 deg, 10 maps to +90 deg -> 180 deg range over 6 units
  const angle = ((clampedPh - 4) / 6) * 180 - 90

  let statusText = 'Optimal / Neutral'
  let statusTextHi = 'उदासीन / सामान्य (उत्तम)'
  let statusColor = 'text-emerald-700'
  let bgBadge = 'bg-emerald-100'
  let recommendation = 'Soil pH is well-balanced for most crops. Nutrient availability is optimal.'

  if (ph < 6.0) {
    statusText = 'Acidic Soil'
    statusTextHi = 'अम्लीय मिट्टी (Acidic)'
    statusColor = 'text-amber-700'
    bgBadge = 'bg-amber-100'
    recommendation = 'Consider applying agricultural lime (Chuna) or dolomite to raise soil pH.'
  } else if (ph > 7.8) {
    statusText = 'Alkaline / Saline Soil'
    statusTextHi = 'क्षारीय मिट्टी (Alkaline)'
    statusColor = 'text-blue-700'
    bgBadge = 'bg-blue-100'
    recommendation = 'Consider applying gypsum (200–500 kg/acre) and organic compost to lower alkalinity.'
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
      <div className="flex items-center justify-between w-full mb-2">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Soil pH Health Meter
        </h3>
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${bgBadge} ${statusColor}`}>
          pH {ph.toFixed(1)}
        </span>
      </div>

      {/* SVG Semicircle Gauge */}
      <div className="relative w-64 h-36 mt-2 flex items-center justify-center">
        <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="phGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" /> {/* Acidic Red */}
              <stop offset="35%" stopColor="#f59e0b" /> {/* Mild Acid Amber */}
              <stop offset="50%" stopColor="#10b981" /> {/* Neutral Emerald */}
              <stop offset="65%" stopColor="#06b6d4" /> {/* Mild Alk Cyan */}
              <stop offset="100%" stopColor="#6366f1" /> {/* Alk Purple/Blue */}
            </linearGradient>
          </defs>

          {/* Semicircle Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#phGradient)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Tick markers */}
          <text x="20" y="118" fontSize="9" fill="#64748b" textAnchor="middle">4.0</text>
          <text x="65" y="55" fontSize="9" fill="#64748b" textAnchor="middle">5.5</text>
          <text x="100" y="38" fontSize="9" fill="#10b981" fontWeight="bold" textAnchor="middle">7.0</text>
          <text x="135" y="55" fontSize="9" fill="#64748b" textAnchor="middle">8.5</text>
          <text x="180" y="118" fontSize="9" fill="#64748b" textAnchor="middle">10.0</text>

          {/* Needle */}
          <g transform={`rotate(${angle} 100 100)`} className="transition-transform duration-700 ease-out">
            <line x1="100" y1="100" x2="100" y2="30" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
            <polygon points="100,24 96,34 104,34" fill="#0f172a" />
            <circle cx="100" cy="100" r="7" fill="#0f172a" />
            <circle cx="100" cy="100" r="3" fill="#ffffff" />
          </g>
        </svg>

        {/* Center reading */}
        <div className="absolute bottom-0 text-center">
          <div className="text-3xl font-black tracking-tight text-slate-900">{ph.toFixed(1)}</div>
          <div className={`text-xs font-semibold ${statusColor}`}>{statusText}</div>
        </div>
      </div>

      <p className="text-xs text-slate-600 mt-4 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100 w-full text-left">
        <strong>Agronomic Advice:</strong> {recommendation}
      </p>
    </div>
  )
}
