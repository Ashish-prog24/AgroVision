'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sprout, Filter, Sparkles } from 'lucide-react'
import { CropCard } from '@/components/CropCard'
import { RecommendationResult } from '@/lib/recommendation-engine'
import { FertilizerCalculator } from '@/components/FertilizerCalculator'
import { FertilizerPlan } from '@/lib/fertilizer-engine'

export default function RecommendPage() {
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([])
  const [selectedCrop, setSelectedCrop] = useState<RecommendationResult | null>(null)
  const [fertilizerPlan, setFertilizerPlan] = useState<FertilizerPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    async function loadRecs() {
      try {
        const res = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            soil: { ph: 6.8, nitrogen: 240, phosphorus: 18.5, potassium: 195 },
            weather: { temperature: 29, humidity: 72, precipitation: 2.0 },
            farm: { area: 2.5, areaUnit: 'acre', season: 'kharif', irrigationType: 'borewell' },
          }),
        })
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.recommendations) {
            setRecommendations(data.recommendations)
            if (data.recommendations.length > 0) {
              fetchFertilizer(data.recommendations[0])
            }
          }
        }
      } catch (e) {
        console.error('Error fetching recommendations:', e)
      } finally {
        setLoading(false)
      }
    }
    loadRecs()
  }, [])

  const fetchFertilizer = async (rec: RecommendationResult) => {
    setSelectedCrop(rec)
    try {
      const res = await fetch('/api/fertilizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: rec.crop.name,
          cropId: rec.crop.id,
          area: 2.5,
          areaUnit: 'acre',
          soil: { nitrogen: 240, phosphorus: 18.5, potassium: 195 },
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.plan) {
          setFertilizerPlan(data.plan)
        }
      }
    } catch (e) {
      console.error('Error fetching fertilizer:', e)
    }
  }

  const filteredCrops = recommendations.filter((r) => {
    if (filterCategory === 'all') return true
    return r.crop.category.toLowerCase() === filterCategory.toLowerCase()
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
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
            <Sprout className="w-7 h-7 text-emerald-600" />
            AI Crop Recommendations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Calibrated for Kharif season, neutral alluvial soil (pH 6.8), and borewell irrigation.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold text-slate-700">
          <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
          {['all', 'cereals', 'pulses', 'oilseeds', 'vegetables'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                filterCategory === cat
                  ? 'bg-white text-emerald-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">
            Analyzing crop suitability against ICAR agronomic database...
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Grid of Recommended Crops */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCrops.map((rec, idx) => (
              <CropCard
                key={idx}
                recommendation={rec}
                isSelected={selectedCrop?.crop.id === rec.crop.id}
                onSelect={(selected) => fetchFertilizer(selected)}
              />
            ))}
          </div>

          {/* Selected Crop Fertilizer Section */}
          {selectedCrop && (
            <div className="pt-6 border-t border-slate-200">
              <FertilizerCalculator
                initialPlan={fertilizerPlan}
                cropName={selectedCrop.crop.name}
                landArea={2.5}
                areaUnit="acre"
                soilData={{ ph: 6.8, nitrogen: 240, phosphorus: 18.5, potassium: 195 }}
                farmerName="Ramesh Kumar"
                village="Satyabhamapur"
                district="Puri"
                state="Odisha"
                onRecalculate={(area, unit) => {
                  if (selectedCrop) fetchFertilizer(selectedCrop)
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
