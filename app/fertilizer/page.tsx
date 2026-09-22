'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Scale, Sparkles } from 'lucide-react'
import { FertilizerCalculator } from '@/components/FertilizerCalculator'
import { FertilizerPlan } from '@/lib/fertilizer-engine'

export default function FertilizerPage() {
  const [selectedCrop, setSelectedCrop] = useState('Paddy')
  const [area, setArea] = useState(2.5)
  const [unit, setUnit] = useState('acre')
  const [plan, setPlan] = useState<FertilizerPlan | null>(null)
  const [loading, setLoading] = useState(false)

  const cropsList = [
    'Paddy',
    'Wheat',
    'Maize',
    'Moong Dal',
    'Arhar (Tur Dal)',
    'Groundnut',
    'Mustard',
    'Cotton',
    'Sugarcane',
    'Tomato',
    'Potato',
    'Chilli',
  ]

  const loadPlan = async (cropName: string, farmArea: number, farmUnit: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/fertilizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName,
          area: farmArea,
          areaUnit: farmUnit,
          soil: { nitrogen: 240, phosphorus: 18.5, potassium: 195, sulphur: 12 },
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.plan) {
          setPlan(data.plan)
        }
      }
    } catch (e) {
      console.error('Error fetching fertilizer plan:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlan(selectedCrop, area, unit)
  }, [selectedCrop])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Scale className="w-7 h-7 text-emerald-600" />
            Fertilizer Dose & Bag Calculator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Compute real market commercial bags (Urea 45kg, DAP 50kg, MOP 50kg) & split timings.
          </p>
        </div>
      </div>

      {/* Select Crop Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
          Select Crop to Plan Nutrition:
        </label>
        <div className="flex flex-wrap gap-2">
          {cropsList.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCrop === c
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Fertilizer Calculator Component */}
      <FertilizerCalculator
        initialPlan={plan}
        cropName={selectedCrop}
        landArea={area}
        areaUnit={unit}
        soilData={{ ph: 6.8, nitrogen: 240, phosphorus: 18.5, potassium: 195, sulphur: 12 }}
        farmerName="Ramesh Kumar"
        village="Satyabhamapur"
        district="Puri"
        state="Odisha"
        onRecalculate={(newArea, newUnit) => {
          setArea(newArea)
          setUnit(newUnit)
          loadPlan(selectedCrop, newArea, newUnit)
        }}
      />
    </div>
  )
}
