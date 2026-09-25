'use client'

import React from 'react'
import { SoilGauge } from './SoilGauge'
import { NutrientBar } from './NutrientBar'
import { ShieldAlert, Sparkles, CheckCircle, Info } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export interface SoilParams {
  ph?: number
  ec?: number
  organicCarbon?: number
  nitrogen?: number
  phosphorus?: number
  potassium?: number
  sulphur?: number
  zinc?: number
  iron?: number
  boron?: number
  manganese?: number
  copper?: number
}

interface SoilDashboardProps {
  soil: SoilParams
  farmerName?: string
  sampleNumber?: string
  testDate?: string
  district?: string
  state?: string
}

export function SoilDashboard({
  soil,
  farmerName,
  sampleNumber,
  testDate,
  district,
  state,
}: SoilDashboardProps) {
  const { locale, t } = useLanguage()
  const ph = soil.ph ?? 6.8
  const ec = soil.ec ?? 0.45
  const oc = soil.organicCarbon ?? 0.54
  const n = soil.nitrogen ?? 240
  const p = soil.phosphorus ?? 18.5
  const k = soil.potassium ?? 195
  const s = soil.sulphur ?? 12
  const zn = soil.zinc ?? 0.55
  const fe = soil.iron ?? 7.2

  return (
    <div className="space-y-6">
      {/* Report Header Banner if available */}
      {(farmerName || sampleNumber) && (
        <div className="bg-emerald-900 text-white p-4 rounded-2xl flex flex-wrap justify-between items-center gap-3 shadow-sm">
          <div>
            <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block">
              Soil Health Card Summary
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2 flex-wrap">
              <span>{farmerName ? farmerName : 'Farmer (Report Analyzed)'}</span>
              {(district || state) && (
                <span className="text-emerald-300 font-normal text-sm">
                  ({[district, state].filter(Boolean).join(', ')})
                </span>
              )}
            </h3>
          </div>

          <div className="flex items-center gap-4 text-xs text-emerald-200">
            {sampleNumber && (
              <div>
                <span className="text-emerald-400 block text-[10px]">Card / Sample No.</span>
                <span className="font-semibold text-white">{sampleNumber}</span>
              </div>
            )}
            {testDate && (
              <div>
                <span className="text-emerald-400 block text-[10px]">Test Date</span>
                <span className="font-semibold text-white">{testDate}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Primary Section: pH Gauge & Core Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <SoilGauge ph={ph} />
        </div>

        {/* EC & Organic Carbon & Soil Fertility Index */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* EC Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Electrical Conductivity (EC)</h4>
                  <p className="text-xs text-slate-500">Measures soil salinity</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  {ec < 1.0 ? 'Non-Saline (Safe)' : 'Saline Warning'}
                </span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-3">
                {ec} <span className="text-sm font-normal text-slate-500">dS/m</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
              {ec < 1.0
                ? 'Soil has low salt concentration. Suitable for all crops.'
                : 'Elevated salts may restrict sensitive crop root development.'}
            </p>
          </div>

          {/* Organic Carbon Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Organic Carbon (OC)</h4>
                  <p className="text-xs text-slate-500">Indicates microbial life & humus</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    oc < 0.5
                      ? 'bg-rose-100 text-rose-800'
                      : oc < 0.75
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {oc < 0.5 ? 'Low' : oc < 0.75 ? 'Medium' : 'High'}
                </span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-3">
                {oc}%
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
              {oc < 0.5
                ? 'Apply 2-3 tonnes/acre Farmyard Manure (FYM) or vermicompost to rejuvenate soil.'
                : 'Adequate organic matter. Supports high fertilizer response.'}
            </p>
          </div>

          {/* Overall Health Card */}
          <div className="sm:col-span-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-emerald-950 text-sm">AgroVision Soil Health Assessment</h5>
              <p className="text-xs text-emerald-800">
                Your soil is loamy/clay-loam with moderate fertility. Adding organic compost and
                balanced NPK fertilization will maximize grain and vegetable yields.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Nutrients: Nitrogen, Phosphorus, Potassium (N-P-K) */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
          {locale === 'hi' ? 'प्राथमिक पोषक तत्व (N - P - K)' : locale === 'or' ? 'ମୁଖ୍ୟ ପୋଷକ ତତ୍ତ୍ୱ (N - P - K)' : 'Primary Nutrients (N - P - K)'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NutrientBar
            name={t('soil.nitrogen', 'Available Nitrogen')}
            symbol="N"
            value={n}
            unit="kg/ha"
            lowThreshold={280}
            highThreshold={560}
            description={locale === 'hi' ? 'पौधे की वानस्पतिक वृद्धि और हरियाली को नियंत्रित करता है' : locale === 'or' ? 'ଗଛର ବୃଦ୍ଧି ଓ ସବୁଜିମା ନିୟନ୍ତ୍ରଣ କରେ' : 'Controls plant vegetative growth & greenery'}
          />
          <NutrientBar
            name={t('soil.phosphorus', 'Available Phosphorus')}
            symbol="P"
            value={p}
            unit="kg/ha"
            lowThreshold={10}
            highThreshold={25}
            description={locale === 'hi' ? 'मजबूत जड़ विकास और अंकुरण के लिए आवश्यक' : locale === 'or' ? 'ମୂଳ ବିକାଶ ପାଇଁ ଅତ୍ୟାବଶ୍ୟକ' : 'Crucial for strong root growth & early vigor'}
          />
          <NutrientBar
            name={t('soil.potassium', 'Available Potassium')}
            symbol="K"
            value={k}
            unit="kg/ha"
            lowThreshold={110}
            highThreshold={280}
            description={locale === 'hi' ? 'रोग प्रतिरोधक क्षमता और दाने की चमक बढ़ाता है' : locale === 'or' ? 'ରୋଗ ପ୍ରତିରୋଧକ ଶକ୍ତି ବଢ଼ାଏ' : 'Builds disease resistance & grain quality'}
          />
        </div>
      </div>

      {/* Secondary & Micronutrients */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
          {locale === 'hi' ? 'सूक्ष्म पोषक तत्व (S, Zn, Fe)' : locale === 'or' ? 'ଅଣୁ ପୋଷକ ତତ୍ତ୍ୱ (S, Zn, Fe)' : 'Secondary & Micronutrients (S, Zn, Fe)'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NutrientBar
            name={t('soil.sulphur', 'Available Sulphur')}
            symbol="S"
            value={s}
            unit="ppm"
            lowThreshold={10}
            highThreshold={20}
            description={locale === 'hi' ? 'तिलहन और दलहन फसलों के लिए आवश्यक' : locale === 'or' ? 'ତୈଳବୀଜ ଓ ଡାଲି ଫସଲ ପାଇଁ ଜରୁରୀ' : 'Oilseed & pulse synthesis'}
          />
          <NutrientBar
            name={t('soil.zinc', 'Available Zinc')}
            symbol="Zn"
            value={zn}
            unit="ppm"
            lowThreshold={0.6}
            highThreshold={1.2}
            description={locale === 'hi' ? 'धान में खैरा रोग से बचाव करता है' : locale === 'or' ? 'ଧାନରେ ଖୈରା ରୋଗ ରୋକେ' : 'Prevents Khaira disease in paddy'}
          />
          <NutrientBar
            name="Available Iron"
            symbol="Fe"
            value={fe}
            unit="ppm"
            lowThreshold={4.5}
            highThreshold={10}
            description="Chlorophyll synthesis"
          />
        </div>
      </div>
    </div>
  )
}
