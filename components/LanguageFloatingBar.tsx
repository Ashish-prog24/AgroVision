'use client'

import React from 'react'
import { Globe } from 'lucide-react'
import { useLanguage, Locale } from '@/context/LanguageContext'

export function LanguageFloatingBar() {
  const { locale, setLocale } = useLanguage()

  const langs: { id: Locale; label: string; sub: string }[] = [
    { id: 'en', label: 'English', sub: 'EN' },
    { id: 'hi', label: 'हिन्दी', sub: 'Hindi' },
    { id: 'or', label: 'ଓଡ଼ିଆ', sub: 'Odia' },
  ]

  return (
    <aside
      aria-label="Language selection"
      className="fixed bottom-4 right-4 z-40 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-emerald-200 shadow-lg shadow-emerald-950/10 flex items-center gap-2"
    >
      <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold pl-1 pr-1.5 border-r border-slate-200">
        <Globe className="w-4 h-4 text-emerald-600" />
        <span className="hidden sm:inline">भाषा / Language:</span>
      </div>

      <div className="flex items-center gap-1" role="group" aria-label="Available languages">
        {langs.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setLocale(l.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              locale === l.id
                ? 'bg-emerald-600 text-white shadow-xs scale-105'
                : 'text-slate-700 hover:bg-slate-100 hover:text-emerald-800'
            }`}
          >
            <span>{l.label}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
