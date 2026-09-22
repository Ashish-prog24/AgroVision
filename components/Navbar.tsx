'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Sprout, Phone, Globe, Menu, X, Shield, BarChart3, CloudSun, FileText } from 'lucide-react'
import { useLanguage, Locale } from '@/context/LanguageContext'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { locale, setLocale, t } = useLanguage()

  const languages: { id: Locale; label: string; native: string }[] = [
    { id: 'en', label: 'English', native: 'English' },
    { id: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { id: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      {/* Top Banner for Farmers */}
      <div className="bg-emerald-800 text-white text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-700 text-emerald-100 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {locale === 'hi' ? 'सरकारी मृदा स्वास्थ्य पहल' : locale === 'or' ? 'ସରକାରୀ ମାଟି ସ୍ୱାସ୍ଥ୍ୟ ଯୋଜନା' : 'Govt. Soil Health Initiative'}
            </span>
            <span className="hidden sm:inline text-emerald-100">
              {locale === 'hi'
                ? 'भारतीय किसानों के लिए एआई आधारित मृदा एवं फसल परामर्श मंच'
                : locale === 'or'
                ? 'ଭାରତୀୟ ଚାଷୀଙ୍କ ପାଇଁ ଏଆଇ ମାଟି ଓ ଫସଲ ପରାମର୍ଶ ମଞ୍ଚ'
                : 'AI Soil & Crop Decision Support Platform for Indian Farmers'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:18001801551"
              className="flex items-center gap-1 text-emerald-200 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {locale === 'hi' ? 'किसान कॉल सेंटर:' : locale === 'or' ? 'କିଷାନ କଲ ସେଣ୍ଟର:' : 'Kisan Call Centre:'}{' '}
                <strong>1800-180-1551</strong> ({locale === 'hi' ? 'टोल फ्री' : locale === 'or' ? 'ଟୋଲ ଫ୍ରି' : 'Toll Free'})
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-emerald-950">AgroVision</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium -mt-0.5">
                {locale === 'hi' ? 'कृषिमित्र सलाहकार' : locale === 'or' ? 'କୃଷିମିତ୍ର ପରାମର୍ଶ' : 'कृषिमित्र / KrushiMitra Advisory'}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              {t('nav.home', 'Home')}
            </Link>
            <Link
              href="/soil/upload"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              {t('nav.soilUpload', 'Soil Advisory')}
            </Link>
            <Link
              href="/recommend"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
            >
              <Sprout className="w-4 h-4 text-emerald-600" />
              {t('nav.advice', 'Crop Advice')}
            </Link>
            <Link
              href="/fertilizer"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              {t('fertilizer.title', 'Fertilizer Calculator')}
            </Link>
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              {t('nav.dashboard', 'Dashboard')}
            </Link>
            <Link
              href="/admin"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              {t('nav.admin', 'Admin')}
            </Link>
          </nav>

          {/* Right Actions: Interactive Language Switcher & Start CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Prominent Multi-Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-0.5" />
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLocale(lang.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    locale === lang.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title={lang.label}
                >
                  {lang.native}
                </button>
              ))}
            </div>

            {/* Quick Start Button */}
            <Link
              href="/soil/upload"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition-all hover:shadow-md"
            >
              {t('hero.uploadBtn', 'Upload Report')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-emerald-50"
          >
            {t('nav.home', 'Home')}
          </Link>
          <Link
            href="/soil/upload"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-emerald-50"
          >
            {t('nav.soilUpload', 'Upload Soil Report')}
          </Link>
          <Link
            href="/recommend"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-emerald-50"
          >
            {t('nav.advice', 'Crop Advisory')}
          </Link>
          <Link
            href="/fertilizer"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-emerald-50"
          >
            {t('fertilizer.title', 'Fertilizer Calculator')}
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-emerald-50"
          >
            {t('nav.dashboard', 'Farmer Dashboard')}
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-500 hover:bg-slate-50"
          >
            {t('nav.admin', 'Admin Panel')}
          </Link>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">
              {locale === 'hi' ? 'भाषा चुनें:' : locale === 'or' ? 'ଭାଷା ବାଛନ୍ତୁ:' : 'Select Language:'}
            </span>
            <div className="flex gap-1.5">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setLocale(lang.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    locale === lang.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {lang.native}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
