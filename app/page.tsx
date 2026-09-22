'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Sprout,
  Upload,
  CloudSun,
  Scale,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Phone,
  FileText,
  MapPin,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  BookOpen,
} from 'lucide-react'
import { StepWizard } from '@/components/StepWizard'
import { useLanguage } from '@/context/LanguageContext'

export default function HomePage() {
  const { locale, t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'wizard' | 'overview'>('wizard')

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-500/15 blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{locale === 'hi' ? 'नेक्स्ट-जेनरेशन कृषि एआई तकनीक' : locale === 'or' ? 'ନୂଆ ପିଢ଼ିର କୃଷି ଏଆଇ ପ୍ରଯୁକ୍ତି' : 'Next-Generation AI Agricultural Intelligence'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-300">{locale === 'hi' ? 'भारतीय किसान संस्करण' : locale === 'or' ? 'ଭାରତୀୟ ଚାଷୀ ସଂସ୍କରଣ' : 'Indian Farmer Edition'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
            {t('hero.headline', 'Know Your Soil. Choose the Right Crop. Farm Smarter.')}
          </h1>

          <p className="text-sm sm:text-lg text-emerald-100/90 max-w-3xl mx-auto leading-relaxed font-normal">
            {t('hero.subheadline', 'Upload your Soil Health Card report or enter test values. AgroVision analyzes pH, N-P-K, detects your hyper-local microclimate, ranks top-yield crops, and calculates precise commercial fertilizer bags and split application schedules.')}
          </p>

          {/* Quick Metrics / Trust */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-emerald-200">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ICAR Package of Practices</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CloudSun className="w-4 h-4 text-amber-400" />
              <span>Live 7-Day Weather Guidance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-sky-400" />
              <span>Urea, DAP, MOP Bag Calculator</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Downloadable Farm Report PDF</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Guided Wizard Section */}
      <section className="-mt-10 relative z-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-wrap justify-between items-center gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-emerald-600" />
                  Interactive Crop & Soil Advisory Wizard
                </h2>
                <p className="text-xs text-slate-500">
                  Follow the 6 steps below to get your customized agronomic plan
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Live System Ready
                </span>
              </div>
            </div>

            {/* Render the Master Step Wizard */}
            <StepWizard />
          </div>
        </div>
      </section>

      {/* Uniqueness Section: Why AgroVision vs Generic AI */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Why AgroVision?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Why AgroVision is Specially Built for Farmers
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Generic AI chatbots (ChatGPT, etc.) only produce generic text. AgroVision provides an
            end-to-end engineered agronomic engine connected to live databases and agricultural norms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Commercial Bag Quantification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generic AI only gives textbook theoretical nitrogen in kg/ha. AgroVision computes
              the exact number of real market bags (45kg Urea, 50kg DAP, MOP) adjusted for your
              regional land unit (Acre, Bigha, Guntha).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
              <CloudSun className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Microclimate Spraying Alerts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Integrated with Open-Meteo live weather API. Warns you before applying costly
              fertilizers if heavy rain or thunderstorms are expected in the next 24-48 hours,
              preventing nutrient runoff.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Official ICAR Rules & OCR</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Specially tuned OCR models for Govt. Soil Health Cards. Grounded in ICAR guidelines so
              you never get AI hallucinations or unsafe agricultural chemicals.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works 6 Steps */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              How AgroVision Works in 6 Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              From soil testing report to a step-by-step farming schedule in under 2 minutes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Upload Soil Report',
                desc: 'Upload PDF or photo of your Soil Health Card or lab test result.',
                icon: Upload,
              },
              {
                step: '02',
                title: 'AI Vision Parameter Extraction',
                desc: 'Gemini Vision AI extracts pH, EC, OC, N-P-K, and micronutrients.',
                icon: Cpu,
              },
              {
                step: '03',
                title: 'Hyper-Local Weather & Forecast',
                desc: 'Auto-detects coordinates and fetches 7-day meteorological forecast.',
                icon: CloudSun,
              },
              {
                step: '04',
                title: 'Farm Profile Input',
                desc: 'Input your farm acreage, irrigation availability, and target season.',
                icon: MapPin,
              },
              {
                step: '05',
                title: 'Scientific Crop Recommendation',
                desc: 'Multi-criteria engine scores crops by soil compatibility and climate.',
                icon: Sprout,
              },
              {
                step: '06',
                title: 'Fertilizer Dosing & PDF Advisory',
                desc: 'Receive basal & top-dressing calendar and download printable PDF.',
                icon: FileText,
              },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 font-bold border border-emerald-100">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 uppercase">
                      Step {item.step}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Demo Showcase: Farmer Ramesh Kumar */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold">
                Farmer Success Story
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                How Ramesh Kumar Saved ₹6,400 in Fertilizer Costs
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Ramesh from Satyabhamapur, Puri (Odisha) had 2.5 acres of alluvial soil. His Soil
                Health Card showed high available potassium (195 kg/ha) but low nitrogen. AgroVision
                recommended reducing MOP and optimizing urea split dressing, resulting in healthy
                tiller count and substantial cost savings.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/soil/upload"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Try With Your Farm Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 text-xs space-y-3">
              <div className="flex justify-between items-center border-b border-white/15 pb-2">
                <span className="font-bold text-emerald-200">Farmer:</span>
                <span className="text-white font-semibold">Ramesh Kumar (Puri, Odisha)</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/15 pb-2">
                <span className="font-bold text-emerald-200">Land Area:</span>
                <span className="text-white font-semibold">2.5 Acres (Borewell)</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/15 pb-2">
                <span className="font-bold text-emerald-200">Soil Condition:</span>
                <span className="text-white font-semibold">pH 6.8 (Neutral), OC 0.54%</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/15 pb-2">
                <span className="font-bold text-emerald-200">Selected Crop:</span>
                <span className="text-white font-semibold">Paddy (Kharif) + Moong (Rabi)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-emerald-200">Yield Outcome:</span>
                <span className="text-emerald-300 font-bold">+18% Yield Improvement</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Helpline Contact Bar */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Need Help With Your Soil Report?</h4>
              <p className="text-xs text-slate-600">
                Call the Kisan Call Centre at toll-free <strong>1800-180-1551</strong> or visit your
                nearest Krishi Vigyan Kendra (KVK).
              </p>
            </div>
          </div>

          <a
            href="tel:18001801551"
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
          >
            Call 1800-180-1551
          </a>
        </div>
      </section>
    </div>
  )
}
