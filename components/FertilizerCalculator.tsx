'use client'

import React, { useState } from 'react'
import {
  Package,
  Calendar,
  AlertTriangle,
  Download,
  Info,
  Layers,
  Scale,
  CheckCircle2,
} from 'lucide-react'
import { FertilizerPlan } from '@/lib/fertilizer-engine'
import { generateAdvisoryPDF } from '@/lib/pdf'

interface FertilizerCalculatorProps {
  initialPlan?: FertilizerPlan | null
  cropName: string
  landArea?: number
  areaUnit?: string
  soilData?: any
  weather?: any
  farmerName?: string
  village?: string
  district?: string
  state?: string
  onRecalculate?: (area: number, unit: string) => void
}

export function FertilizerCalculator({
  initialPlan,
  cropName,
  landArea = 1,
  areaUnit = 'acre',
  soilData = {},
  weather = {},
  farmerName = 'Ramesh Kumar',
  village = 'Satyabhamapur',
  district = 'Puri',
  state = 'Odisha',
  onRecalculate,
}: FertilizerCalculatorProps) {
  const [area, setArea] = useState<number>(landArea)
  const [unit, setUnit] = useState<string>(areaUnit)
  const [downloading, setDownloading] = useState(false)

  const plan = initialPlan

  const handleAreaChange = (newArea: number, newUnit: string) => {
    setArea(newArea)
    setUnit(newUnit)
    if (onRecalculate) {
      onRecalculate(newArea, newUnit)
    }
  }

  const handleDownloadPDF = () => {
    try {
      setDownloading(true)
      const doc = generateAdvisoryPDF({
        farmerName,
        village,
        district,
        state,
        landArea: area,
        areaUnit: unit,
        irrigationType: 'Borewell / Tube-well',
        season: 'Kharif',
        soilData: soilData || {},
        weather: {
          temperature: weather?.current?.temperature || 29,
          humidity: weather?.current?.humidity || 72,
          condition: weather?.current?.condition || 'Clear',
          rainfallForecast: 'Normal monsoon shower expected in next 3 days',
        },
        recommendedCrops: [
          { name: cropName, suitability: 'Excellent (92%)', score: 92, durationDays: 110 },
        ],
        selectedCrop: cropName,
        fertilizerPlan: plan
          ? {
              totalN: plan.totalN,
              totalP: plan.totalP,
              totalK: plan.totalK,
              products: plan.products,
              schedule: plan.schedule,
            }
          : undefined,
      })
      doc.save(`AgroVision_Fertilizer_${cropName}_${area}${unit}.pdf`)
    } catch (err) {
      console.error('Error generating PDF:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      {/* Header and Area Configuration */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Scale className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Fertilizer Advisory for <span className="text-emerald-700">{cropName}</span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Calculated as per ICAR guidelines adjusted for soil fertility levels
          </p>
        </div>

        {/* Area Controls */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
              Land Area
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={area}
              onChange={(e) => handleAreaChange(parseFloat(e.target.value) || 1, unit)}
              className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-emerald-600"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
              Unit
            </label>
            <select
              value={unit}
              onChange={(e) => handleAreaChange(area, e.target.value)}
              className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-emerald-600"
            >
              <option value="acre">Acres</option>
              <option value="hectare">Hectares</option>
              <option value="bigha">Bigha</option>
              <option value="guntha">Guntha</option>
            </select>
          </div>
        </div>
      </div>

      {plan ? (
        <>
          {/* Nutrient Requirements Totals */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Total Pure Nutrient Requirements ({area} {unit})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <div className="text-xs text-emerald-800 font-medium">Nitrogen (N)</div>
                <div className="text-2xl font-black text-emerald-950 mt-1">
                  {plan.totalN} <span className="text-xs font-normal">kg</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100">
                <div className="text-xs text-sky-800 font-medium">Phosphorus (P₂O₅)</div>
                <div className="text-2xl font-black text-sky-950 mt-1">
                  {plan.totalP} <span className="text-xs font-normal">kg</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100">
                <div className="text-xs text-amber-800 font-medium">Potassium (K₂O)</div>
                <div className="text-2xl font-black text-amber-950 mt-1">
                  {plan.totalK} <span className="text-xs font-normal">kg</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100">
                <div className="text-xs text-purple-800 font-medium">Sulphur (S)</div>
                <div className="text-2xl font-black text-purple-950 mt-1">
                  {plan.totalS} <span className="text-xs font-normal">kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Commercial Fertilizer Bags Calculation */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-emerald-600" />
              Commercial Fertilizer Products to Purchase
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {plan.products.map((prod, idx) => {
                // Bags calculation (Urea = 45kg bag, DAP/MOP = 50kg bag)
                const bagSize = prod.product === 'Urea' ? 45 : 50
                const bags = (prod.totalQuantity / bagSize).toFixed(1)

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-colors shadow-2xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{prod.product}</h4>
                        <span className="text-xs text-slate-500">
                          {prod.nutrient} supplement ({prod.quantityPerAcre} {prod.unit}/acre)
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                        {prod.unit}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-slate-500 block">Total Quantity</span>
                        <span className="text-xl font-extrabold text-slate-900">
                          {prod.totalQuantity} {prod.unit}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-emerald-700 font-semibold block">Approx Bags</span>
                        <span className="text-sm font-black text-emerald-800">
                          ~{bags} Bags ({bagSize}kg)
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Split Application Schedule */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Application Schedule (Split Dosing)
            </h3>

            <div className="space-y-3">
              {plan.schedule.map((stage, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{stage.stage}</h4>
                    </div>
                    <p className="text-xs text-slate-500 pl-7">{stage.timing}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 pl-7 sm:pl-0">
                    {stage.applications.map((app, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                      >
                        {app.qty} {app.unit} {app.product}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Guidelines source: {plan.source || 'ICAR 2024'}</span>
            </div>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Preparing PDF...' : 'Download Official Advisory PDF'}</span>
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-slate-500 text-sm">
          Select a crop to view detailed fertilizer breakdown.
        </div>
      )}
    </div>
  )
}
