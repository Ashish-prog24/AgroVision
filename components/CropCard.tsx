'use client'

import React from 'react'
import { CheckCircle2, AlertCircle, Droplet, Clock, ArrowRight, Sparkles } from 'lucide-react'
import { RecommendationResult } from '@/lib/recommendation-engine'
import { useLanguage } from '@/context/LanguageContext'

interface CropCardProps {
  recommendation: RecommendationResult
  isSelected?: boolean
  onSelect: (rec: RecommendationResult) => void
}

export function CropCard({ recommendation, isSelected, onSelect }: CropCardProps) {
  const { locale, t } = useLanguage()
  const { crop, score, suitability, reasons, warnings } = recommendation

  const matchPercent = Math.round(score * 100)

  let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200'
  if (suitability === 'good') badgeColor = 'bg-teal-100 text-teal-800 border-teal-200'
  if (suitability === 'moderate') badgeColor = 'bg-amber-100 text-amber-800 border-amber-200'

  // Primary display name based on active language
  const primaryName =
    locale === 'hi' && crop.nameHi
      ? crop.nameHi
      : locale === 'or' && crop.nameOr
      ? crop.nameOr
      : crop.name

  const secondaryName =
    primaryName !== crop.name ? crop.name : (locale === 'hi' ? crop.nameHi : crop.nameOr)

  return (
    <div
      className={`rounded-2xl p-5 border transition-all duration-300 relative flex flex-col justify-between ${
        isSelected
          ? 'bg-emerald-50/60 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
          : 'bg-white border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300'
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-start gap-2">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-lg font-bold text-slate-900">{primaryName}</h3>
              {secondaryName && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {secondaryName}
                </span>
              )}
            </div>
            {crop.scientificName && (
              <p className="text-[11px] italic text-slate-500 mt-0.5">{crop.scientificName}</p>
            )}
          </div>

          <div className="text-right shrink-0">
            <span
              className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${badgeColor}`}
            >
              <Sparkles className="w-3 h-3" />
              {matchPercent}% {locale === 'hi' ? 'अनुकूल' : locale === 'or' ? 'ଉପଯୁକ୍ତ' : 'Match'}
            </span>
          </div>
        </div>

        {/* Quick Attributes */}
        <div className="grid grid-cols-3 gap-2 my-4 py-2.5 px-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">
                {t('recommend.duration', 'Duration')}
              </div>
              <div className="font-semibold">
                {crop.duration || 110} {locale === 'hi' ? 'दिन' : locale === 'or' ? 'ଦିନ' : 'Days'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">
                {t('recommend.waterReq', 'Water')}
              </div>
              <div className="font-semibold capitalize">{crop.waterRequirement || 'Medium'}</div>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">
              {t('recommend.season', 'Season')}
            </div>
            <div className="font-semibold capitalize">{crop.season}</div>
          </div>
        </div>

        {/* Reasoning Points */}
        <div className="space-y-1.5 mb-4">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            {t('recommend.why', 'Why this crop?')}
          </p>
          <ul className="space-y-1 text-xs text-slate-600">
            {reasons.slice(0, 3).map((r, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Warnings if any */}
        {warnings && warnings.length > 0 && (
          <div className="mb-4 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70 text-[11px] text-amber-900 space-y-1">
            {warnings.slice(0, 2).map((w, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <AlertCircle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Select Button */}
      <button
        type="button"
        onClick={() => onSelect(recommendation)}
        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
          isSelected
            ? 'bg-emerald-700 text-white shadow-sm'
            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white'
        }`}
      >
        <span>
          {isSelected
            ? locale === 'hi'
              ? '✓ उर्वरक योजना के लिए चयनित'
              : locale === 'or'
              ? '✓ ସାର ଯୋଜନା ପାଇଁ ମନୋନୀତ'
              : '✓ Selected for Fertilizer Planning'
            : t('recommend.viewFertilizer', 'Calculate Fertilizer Plan')}
        </span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
