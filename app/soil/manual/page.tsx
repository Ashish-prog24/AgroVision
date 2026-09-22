'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, FileText, CheckCircle2, Scale } from 'lucide-react'
import { SoilDashboard } from '@/components/SoilDashboard'
import { SoilParams } from '@/components/SoilDashboard'

export default function ManualSoilPage() {
  const [soil, setSoil] = useState<SoilParams>({
    ph: 6.8,
    ec: 0.45,
    organicCarbon: 0.54,
    nitrogen: 240,
    phosphorus: 18.5,
    potassium: 195,
    sulphur: 12,
    zinc: 0.55,
    iron: 7.2,
    boron: 0.48,
  })

  const [farmer, setFarmer] = useState({
    name: 'Ramesh Kumar',
    village: 'Satyabhamapur',
    district: 'Puri',
    state: 'Odisha',
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Manual Soil Data Entry & Analysis
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Fill in the measured values from your Soil Health Card to generate a health diagnosis
          </p>
        </div>

        <Link
          href="/recommend"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
        >
          <span>Get Crop Advisory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Parameter Entry Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          Input Soil Test Values
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Soil pH (0 - 14)</label>
            <input
              type="number"
              step="0.1"
              value={soil.ph}
              onChange={(e) => setSoil({ ...soil, ph: parseFloat(e.target.value) || 7 })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">EC (Salinity in dS/m)</label>
            <input
              type="number"
              step="0.05"
              value={soil.ec}
              onChange={(e) => setSoil({ ...soil, ec: parseFloat(e.target.value) || 0.4 })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Organic Carbon (%)</label>
            <input
              type="number"
              step="0.05"
              value={soil.organicCarbon}
              onChange={(e) =>
                setSoil({ ...soil, organicCarbon: parseFloat(e.target.value) || 0.5 })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nitrogen N (kg/ha)</label>
            <input
              type="number"
              value={soil.nitrogen}
              onChange={(e) => setSoil({ ...soil, nitrogen: parseFloat(e.target.value) || 240 })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Phosphorus P (kg/ha)</label>
            <input
              type="number"
              value={soil.phosphorus}
              onChange={(e) => setSoil({ ...soil, phosphorus: parseFloat(e.target.value) || 18 })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Potassium K (kg/ha)</label>
            <input
              type="number"
              value={soil.potassium}
              onChange={(e) => setSoil({ ...soil, potassium: parseFloat(e.target.value) || 190 })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Sulphur S (ppm)</label>
            <input
              type="number"
              value={soil.sulphur}
              onChange={(e) => setSoil({ ...soil, sulphur: parseFloat(e.target.value) || 12 })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Zinc Zn (ppm)</label>
            <input
              type="number"
              step="0.05"
              value={soil.zinc}
              onChange={(e) => setSoil({ ...soil, zinc: parseFloat(e.target.value) || 0.55 })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Real-time Visualized Soil Health Dashboard */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Live Soil Health Diagnostics</h2>
        <SoilDashboard
          soil={soil}
          farmerName={farmer.name}
          district={farmer.district}
          state={farmer.state}
        />
      </div>
    </div>
  )
}
