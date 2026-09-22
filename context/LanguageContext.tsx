'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import en from '@/messages/en.json'
import hi from '@/messages/hi.json'
import orMessages from '@/messages/or.json'

export type Locale = 'en' | 'hi' | 'or'

const translations: Record<Locale, any> = {
  en,
  hi,
  or: orMessages,
}

interface LanguageContextType {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (path: string, fallback?: string) => string
  dict: any
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (path: string, fallback?: string) => fallback || path,
  dict: en,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Read from localStorage or cookie
    const saved = localStorage.getItem('agrovision_locale') as Locale
    if (saved && (saved === 'en' || saved === 'hi' || saved === 'or')) {
      setLocaleState(saved)
      return
    }

    const cookieMatch = document.cookie.match(/locale=(en|hi|or)/)
    if (cookieMatch && cookieMatch[1]) {
      setLocaleState(cookieMatch[1] as Locale)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== 'undefined') {
      localStorage.setItem('agrovision_locale', newLocale)
      document.cookie = `locale=${newLocale}; path=/; max-age=31536000`
    }
  }

  const t = (path: string, fallback?: string): string => {
    const currentDict = translations[locale] || en
    const parts = path.split('.')
    let current: any = currentDict

    for (const p of parts) {
      if (current && typeof current === 'object' && p in current) {
        current = current[p]
      } else {
        // Fallback to English if missing in target
        let enFallback: any = en
        for (const ep of parts) {
          if (enFallback && typeof enFallback === 'object' && ep in enFallback) {
            enFallback = enFallback[ep]
          } else {
            enFallback = null
            break
          }
        }
        return enFallback && typeof enFallback === 'string' ? enFallback : fallback || path
      }
    }

    return typeof current === 'string' ? current : fallback || path
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dict: translations[locale] || en }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
