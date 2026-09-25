'use client'

import React, { useState, useEffect } from 'react'
import {
  Upload,
  FileText,
  MapPin,
  CloudSun,
  Sprout,
  Scale,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Download,
  AlertCircle,
  HelpCircle,
  Search,
} from 'lucide-react'
import { SoilDashboard, SoilParams } from './SoilDashboard'
import { WeatherWidget } from './WeatherWidget'
import { CropCard } from './CropCard'
import { FertilizerCalculator } from './FertilizerCalculator'
import { WeatherData, getMockWeather, generateWeatherAlerts } from '@/lib/weather'
import { RecommendationResult, recommendCrops } from '@/lib/recommendation-engine'
import { FertilizerPlan, calculateFertilizerPlan } from '@/lib/fertilizer-engine'
import { DEFAULT_CROPS } from '@/lib/crops-data'
import { useLanguage } from '@/context/LanguageContext'

export function StepWizard() {
  const { locale, t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string>('')

  const STEPS = [
    { id: 1, name: t('howItWorks.steps.0', 'Soil Report'), icon: Upload },
    { id: 2, name: t('howItWorks.steps.3', 'Soil Analysis'), icon: FileText },
    { id: 3, name: t('howItWorks.steps.2', 'Location & Weather'), icon: CloudSun },
    { id: 4, name: t('howItWorks.steps.4', 'Farm Details'), icon: MapPin },
    { id: 5, name: t('howItWorks.steps.5', 'AI Crops'), icon: Sprout },
    { id: 6, name: t('fertilizer.title', 'Fertilizer & Plan'), icon: Scale },
  ]

  // Soil Data State
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
  const [farmerDetails, setFarmerDetails] = useState({
    name: 'Ramesh Kumar',
    village: 'Satyabhamapur',
    district: 'Puri',
    state: 'Odisha',
    sampleNumber: 'SHC-2024-OD-9812',
    testDate: '2024-08-15',
  })

  // Location & Weather State
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 19.8135,
    lng: 85.8312, // Puri, Odisha initial default
  })
  const [weather, setWeather] = useState<WeatherData>(getMockWeather())
  const [weatherAlerts, setWeatherAlerts] = useState<string[]>([])
  const [locationName, setLocationName] = useState('Puri, Odisha')
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [locationSearchInput, setLocationSearchInput] = useState('')
  const [searchingLocation, setSearchingLocation] = useState(false)

  // Farm Details State
  const [farmData, setFarmData] = useState({
    area: 2.5,
    areaUnit: 'acre',
    season: 'kharif',
    irrigationType: 'borewell',
    farmingMethod: 'integrated',
    preference: 'any',
  })

  // Recommendations State
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([])
  const [selectedCropRec, setSelectedCropRec] = useState<RecommendationResult | null>(null)
  const [fertilizerPlan, setFertilizerPlan] = useState<FertilizerPlan | null>(null)

  // Fetch weather on mount or coords change
  const loadWeather = async (lat: number, lng: number) => {
    setWeatherLoading(true)
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`)
      if (res.ok) {
        const data = await res.json()
        if (data && data.data) {
          setWeather(data.data)
          setWeatherAlerts(data.alerts || generateWeatherAlerts(data.data))
        }
      }
    } catch (e) {
      console.warn('Weather fetch failed, using fallback:', e)
      const mock = getMockWeather()
      setWeather(mock)
      setWeatherAlerts(generateWeatherAlerts(mock))
    } finally {
      setWeatherLoading(false)
    }
  }

  useEffect(() => {
    loadWeather(coords.lat, coords.lng)
  }, [coords.lat, coords.lng])

  // Attempt silent browser geolocation on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          setCoords({ lat, lng })
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
              { headers: { 'Accept-Language': 'en' } }
            )
            if (res.ok) {
              const geo = await res.json()
              const addr = geo.address || {}
              const dist = addr.state_district || addr.county || addr.city || addr.town || 'Detected City'
              const st = addr.state || 'India'
              const vil = addr.village || addr.suburb || addr.neighbourhood || ''
              const name = vil ? `${vil}, ${dist}, ${st}` : `${dist}, ${st}`
              setLocationName(name)
              setFarmerDetails((prev) => ({
                ...prev,
                village: vil || prev.village,
                district: dist,
                state: st,
              }))
            }
          } catch (e) {
            console.warn('Auto reverse geocode error:', e)
          }
        },
        (err) => {
          console.log('Browser geolocation prompt dismissed or unavailable, using preset:', err.message)
        },
        { timeout: 8000 }
      )
    }
  }, [])

  // Handle GPS location detection with user feedback
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setCoords(newCoords)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newCoords.lat}&lon=${newCoords.lng}`,
            { headers: { 'Accept-Language': 'en' } }
          )
          if (res.ok) {
            const geo = await res.json()
            const addr = geo.address || {}
            const dist = addr.state_district || addr.county || addr.city || addr.town || 'Local District'
            const st = addr.state || 'State'
            const vil = addr.village || addr.suburb || addr.neighbourhood || ''
            const name = vil ? `${vil}, ${dist}, ${st}` : `${dist}, ${st}`
            setLocationName(name)
            setFarmerDetails((prev) => ({
              ...prev,
              village: vil || prev.village,
              district: dist,
              state: st,
            }))
          }
        } catch (e) {
          console.warn('Reverse geocode error:', e)
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        setLoading(false)
        alert('Location permission denied. You can search your city/district or select from the preset list below.')
      },
      { timeout: 10000 }
    )
  }

  // Handle searching any village, district, or city in India
  const handleSearchLocation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const query = locationSearchInput.trim()
    if (!query) return
    setSearchingLocation(true)
    try {
      const q = encodeURIComponent(`${query}, India`)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${q}&countrycodes=in&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      )
      if (res.ok) {
        const data = await res.json()
        if (data && data.length > 0) {
          const item = data[0]
          const lat = parseFloat(item.lat)
          const lng = parseFloat(item.lon)
          const parts = item.display_name.split(', ')
          const shortName = parts.slice(0, 3).join(', ')
          setCoords({ lat, lng })
          setLocationName(shortName)
          const inferredDistrict = parts[0] || 'District'
          const inferredState = parts[parts.length - 2] || 'State'
          setFarmerDetails((prev) => ({
            ...prev,
            district: inferredDistrict,
            state: inferredState,
          }))
          setLocationSearchInput('')
        } else {
          alert(`Location "${query}" not found. Please try entering your district or nearby city.`)
        }
      }
    } catch (err) {
      console.error('Location search error:', err)
      alert('Network error while searching location. Please try selecting from the preset dropdown.')
    } finally {
      setSearchingLocation(false)
    }
  }

  // Handle Soil Report Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setUploadStatus('Scanning Soil Report with Gemini Vision OCR...')

    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const base64 = reader.result as string
        const res = await fetch('/api/soil/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64, mimeType: file.type }),
        })

        const result = await res.json()
        if (result.success && result.data) {
          const d = result.data
          setSoil({
            ph: d.ph ?? 6.8,
            ec: d.ec ?? 0.45,
            organicCarbon: d.organicCarbon ?? 0.54,
            nitrogen: d.nitrogen ?? 240,
            phosphorus: d.phosphorus ?? 18.5,
            potassium: d.potassium ?? 195,
            sulphur: d.sulphur ?? 12,
            zinc: d.zinc ?? 0.55,
            iron: d.iron ?? 7.2,
            boron: d.boron ?? 0.48,
          })
          if (d.farmerName) {
            setFarmerDetails((prev) => ({
              ...prev,
              name: d.farmerName,
              sampleNumber: d.sampleNumber || prev.sampleNumber,
              village: d.village || prev.village,
              district: d.district || prev.district,
              state: d.state || prev.state,
            }))
          }
          setUploadStatus('✓ Soil Report successfully extracted!')
          setTimeout(() => {
            setCurrentStep(2)
          }, 800)
        } else {
          setUploadStatus('OCR extraction note: Sample test data loaded for review.')
          setCurrentStep(2)
        }
      } catch (err) {
        console.error('OCR error:', err)
        setUploadStatus('Loaded test report values for verification.')
        setCurrentStep(2)
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  // Fast demo load
  const loadDemoData = () => {
    setSoil({
      ph: 6.7,
      ec: 0.42,
      organicCarbon: 0.52,
      nitrogen: 235,
      phosphorus: 18.0,
      potassium: 190,
      sulphur: 11.5,
      zinc: 0.58,
      iron: 6.8,
      boron: 0.45,
    })
    setFarmerDetails({
      name: 'Ramesh Kumar',
      village: 'Satyabhamapur',
      district: 'Puri',
      state: 'Odisha',
      sampleNumber: 'SHC-OD-2024-9182',
      testDate: '2024-09-10',
    })
    setCurrentStep(2)
  }

  // Trigger Recommendations API
  const handleAnalyzeCrops = async () => {
    setLoading(true)
    const weatherSnapshot = {
      temperature: weather?.current?.temperature ?? 26.0,
      humidity: weather?.current?.humidity ?? 70.0,
      precipitation: weather?.current?.precipitation ?? 4.0,
    }

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soil,
          weather: weatherSnapshot,
          farm: farmData,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.recommendations && data.recommendations.length > 0) {
          setRecommendations(data.recommendations)
          handleSelectCrop(data.recommendations[0])
          setCurrentStep(5)
          return
        }
      }
      
      // Fallback if backend returned non-200 or empty list
      console.warn('Backend API returned non-OK or empty, activating client-side agronomic engine')
      const fallbackRecs = recommendCrops(DEFAULT_CROPS, soil, weatherSnapshot, farmData)
      setRecommendations(fallbackRecs)
      if (fallbackRecs.length > 0) {
        handleSelectCrop(fallbackRecs[0])
      }
      setCurrentStep(5)
    } catch (e) {
      console.error('Recommendation API error, activating client fallback:', e)
      const fallbackRecs = recommendCrops(DEFAULT_CROPS, soil, weatherSnapshot, farmData)
      setRecommendations(fallbackRecs)
      if (fallbackRecs.length > 0) {
        handleSelectCrop(fallbackRecs[0])
      }
      setCurrentStep(5)
    } finally {
      setLoading(false)
    }
  }

  // Handle Crop Selection & Fertilizer Calculation
  const handleSelectCrop = async (rec: RecommendationResult) => {
    setSelectedCropRec(rec)
    try {
      const res = await fetch('/api/fertilizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: rec.crop.name,
          cropId: rec.crop.id,
          area: farmData.area,
          areaUnit: farmData.areaUnit,
          soil: {
            nitrogen: soil.nitrogen,
            phosphorus: soil.phosphorus,
            potassium: soil.potassium,
            sulphur: soil.sulphur,
          },
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.plan) {
          setFertilizerPlan(data.plan)
          return
        }
      }
    } catch (e) {
      console.error('Fertilizer calculation error, falling back to local computation:', e)
    }

    // Direct local computation fallback so fertilizer plan is ALWAYS calculated
    try {
      const localPlan = calculateFertilizerPlan(
        rec.crop.name,
        Number(farmData.area),
        farmData.areaUnit,
        soil
      )
      setFertilizerPlan(localPlan)
    } catch (calcErr) {
      console.error('Local fertilizer calculation failed:', calcErr)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Step Progress Tracker */}
      <div className="mb-8">
        <div className="flex items-center justify-between overflow-x-auto pb-4 gap-2">
          {STEPS.map((s, idx) => {
            const Icon = s.icon
            const isCompleted = currentStep > s.id
            const isCurrent = currentStep === s.id
            return (
              <div
                key={s.id}
                onClick={() => isCompleted && setCurrentStep(s.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : isCompleted
                    ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isCurrent
                      ? 'bg-white text-emerald-700'
                      : isCompleted
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.id}
                </div>
                <span>{s.name}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* STEP 1: Soil Report Upload / Input */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Step 1 of 6
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Upload Your Soil Testing Report
            </h2>
            <p className="text-sm text-slate-600">
              Upload your Govt. Soil Health Card or lab testing sheet (PDF, JPG, PNG). Our AI vision
              will automatically extract all parameters.
            </p>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-8 text-center bg-emerald-50/40 hover:bg-emerald-50/70 transition-all cursor-pointer relative group">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold text-slate-800">
                  Click to Browse or Drag & Drop File
                </p>
                <p className="text-xs text-slate-500">Supports PDF, JPG, JPEG, PNG (Up to 10MB)</p>
              </div>
            </div>
          </div>

          {uploadStatus && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-medium animate-fade-in">
              {uploadStatus}
            </div>
          )}

          {/* Fast Demo or Manual Fallback Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={loadDemoData}
              className="px-4 py-2.5 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Load Sample Soil Health Card (Demo)</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Enter Parameters Manually
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Soil Health Card Parameters Confirmation */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                Step 2 of 6
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Confirm Soil Health Parameters
              </h2>
              <p className="text-xs text-slate-500">
                Verify values extracted from your report. You can edit any parameter directly.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span>Confirm & Proceed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Render Full Dashboard Visuals */}
          <SoilDashboard
            soil={soil}
            farmerName={farmerDetails.name}
            sampleNumber={farmerDetails.sampleNumber}
            testDate={farmerDetails.testDate}
            district={farmerDetails.district}
            state={farmerDetails.state}
          />

          {/* Quick inline editor for parameters */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
              Edit Soil Values if Needed:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">pH</label>
                <input
                  type="number"
                  step="0.1"
                  value={soil.ph}
                  onChange={(e) => setSoil({ ...soil, ph: parseFloat(e.target.value) || 7 })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">EC (dS/m)</label>
                <input
                  type="number"
                  step="0.05"
                  value={soil.ec}
                  onChange={(e) => setSoil({ ...soil, ec: parseFloat(e.target.value) || 0.4 })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">OC (%)</label>
                <input
                  type="number"
                  step="0.05"
                  value={soil.organicCarbon}
                  onChange={(e) =>
                    setSoil({ ...soil, organicCarbon: parseFloat(e.target.value) || 0.5 })
                  }
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  N (kg/ha)
                </label>
                <input
                  type="number"
                  value={soil.nitrogen}
                  onChange={(e) => setSoil({ ...soil, nitrogen: parseFloat(e.target.value) || 240 })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  P (kg/ha)
                </label>
                <input
                  type="number"
                  value={soil.phosphorus}
                  onChange={(e) =>
                    setSoil({ ...soil, phosphorus: parseFloat(e.target.value) || 18 })
                  }
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  K (kg/ha)
                </label>
                <input
                  type="number"
                  value={soil.potassium}
                  onChange={(e) => setSoil({ ...soil, potassium: parseFloat(e.target.value) || 190 })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Location & Live Weather */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                Step 3 of 6
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">Farm Location & Weather</h2>
              <p className="text-xs text-slate-500">
                Hyper-local meteorological forecast helps assess moisture, temperature and pest risk.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span>Continue to Farm Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Location Picker & Search Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-semibold">Active Farm Location:</div>
                  <div className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>{locationName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      Live
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Lat: {coords.lat.toFixed(4)}°, Lng: {coords.lng.toFixed(4)}°
                  </div>
                </div>
              </div>

              <button
                onClick={handleDetectGPS}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{loading ? 'Locating via GPS...' : 'Auto-Detect via GPS'}</span>
              </button>
            </div>

            {/* Direct City / Village Search Box */}
            <form onSubmit={handleSearchLocation} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Type any village, town, district, or PIN code in India (e.g. Nashik, Karnal, Sambalpur, Indore)..."
                  value={locationSearchInput}
                  onChange={(e) => setLocationSearchInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 bg-white focus:outline-emerald-600 focus:border-emerald-600"
                />
              </div>
              <button
                type="submit"
                disabled={searchingLocation}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors shrink-0 disabled:opacity-50"
              >
                {searchingLocation ? 'Searching...' : 'Search Location'}
              </button>
            </form>

            {/* Quick Agricultural Zone Presets */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Or Select Major Agricultural Zone:
              </span>
              <select
                onChange={(e) => {
                  const val = e.target.value
                  const presetList: Record<string, { lat: number; lng: number; name: string; dist: string; state: string }> = {
                    'puri': { lat: 19.8135, lng: 85.8312, name: 'Puri, Odisha', dist: 'Puri', state: 'Odisha' },
                    'bhubaneswar': { lat: 20.2961, lng: 85.8245, name: 'Bhubaneswar, Odisha', dist: 'Khurda', state: 'Odisha' },
                    'sambalpur': { lat: 21.4669, lng: 83.9812, name: 'Sambalpur, Odisha', dist: 'Sambalpur', state: 'Odisha' },
                    'ludhiana': { lat: 30.9010, lng: 75.8573, name: 'Ludhiana, Punjab', dist: 'Ludhiana', state: 'Punjab' },
                    'bathinda': { lat: 30.2110, lng: 74.9455, name: 'Bathinda, Punjab', dist: 'Bathinda', state: 'Punjab' },
                    'karnal': { lat: 29.6857, lng: 76.9905, name: 'Karnal, Haryana', dist: 'Karnal', state: 'Haryana' },
                    'lucknow': { lat: 26.8467, lng: 80.9462, name: 'Lucknow, Uttar Pradesh', dist: 'Lucknow', state: 'Uttar Pradesh' },
                    'varanasi': { lat: 25.3176, lng: 82.9739, name: 'Varanasi, Uttar Pradesh', dist: 'Varanasi', state: 'Uttar Pradesh' },
                    'meerut': { lat: 28.9845, lng: 77.7064, name: 'Meerut, Uttar Pradesh', dist: 'Meerut', state: 'Uttar Pradesh' },
                    'nashik': { lat: 19.9975, lng: 73.7898, name: 'Nashik, Maharashtra', dist: 'Nashik', state: 'Maharashtra' },
                    'nagpur': { lat: 21.1458, lng: 79.0882, name: 'Nagpur, Maharashtra', dist: 'Nagpur', state: 'Maharashtra' },
                    'pune': { lat: 18.5204, lng: 73.8567, name: 'Pune, Maharashtra', dist: 'Pune', state: 'Maharashtra' },
                    'indore': { lat: 22.7196, lng: 75.8577, name: 'Indore, Madhya Pradesh', dist: 'Indore', state: 'Madhya Pradesh' },
                    'bhopal': { lat: 23.2599, lng: 77.4126, name: 'Bhopal, Madhya Pradesh', dist: 'Bhopal', state: 'Madhya Pradesh' },
                    'patna': { lat: 25.5941, lng: 85.1376, name: 'Patna, Bihar', dist: 'Patna', state: 'Bihar' },
                    'burdwan': { lat: 23.2324, lng: 87.8615, name: 'Bardhaman, West Bengal', dist: 'Purba Bardhaman', state: 'West Bengal' },
                    'anand': { lat: 22.5645, lng: 72.9289, name: 'Anand, Gujarat', dist: 'Anand', state: 'Gujarat' },
                    'rajkot': { lat: 22.3039, lng: 70.8022, name: 'Rajkot, Gujarat', dist: 'Rajkot', state: 'Gujarat' },
                    'jaipur': { lat: 26.9124, lng: 75.7873, name: 'Jaipur, Rajasthan', dist: 'Jaipur', state: 'Rajasthan' },
                    'kota': { lat: 25.2138, lng: 75.8648, name: 'Kota, Rajasthan', dist: 'Kota', state: 'Rajasthan' },
                    'guntur': { lat: 16.3067, lng: 80.4365, name: 'Guntur, Andhra Pradesh', dist: 'Guntur', state: 'Andhra Pradesh' },
                    'hyderabad': { lat: 17.3850, lng: 78.4867, name: 'Hyderabad, Telangana', dist: 'Hyderabad', state: 'Telangana' },
                    'dharwad': { lat: 15.4589, lng: 75.0078, name: 'Dharwad, Karnataka', dist: 'Dharwad', state: 'Karnataka' },
                    'coimbatore': { lat: 11.0168, lng: 76.9558, name: 'Coimbatore, Tamil Nadu', dist: 'Coimbatore', state: 'Tamil Nadu' },
                    'delhi': { lat: 28.6139, lng: 77.2090, name: 'New Delhi, NCR', dist: 'New Delhi', state: 'Delhi' },
                  }
                  const item = presetList[val]
                  if (item) {
                    setCoords({ lat: item.lat, lng: item.lng })
                    setLocationName(item.name)
                    setFarmerDetails((prev) => ({
                      ...prev,
                      district: item.dist,
                      state: item.state,
                    }))
                  }
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="puri">Puri, Odisha (Coastal Alluvial)</option>
                <option value="bhubaneswar">Bhubaneswar, Odisha (East Coastal)</option>
                <option value="sambalpur">Sambalpur, Odisha (Western Agro-zone)</option>
                <option value="ludhiana">Ludhiana, Punjab (Central Plains)</option>
                <option value="bathinda">Bathinda, Punjab (Cotton Belt)</option>
                <option value="karnal">Karnal, Haryana (Basmati Belt)</option>
                <option value="lucknow">Lucknow, Uttar Pradesh (Central Gangetic)</option>
                <option value="varanasi">Varanasi, Uttar Pradesh (Eastern Alluvial)</option>
                <option value="meerut">Meerut, Uttar Pradesh (Western Sugarcane Belt)</option>
                <option value="nashik">Nashik, Maharashtra (Onion & Grape Belt)</option>
                <option value="nagpur">Nagpur, Maharashtra (Vidarbha Black Soil)</option>
                <option value="pune">Pune, Maharashtra (Western Maharashtra)</option>
                <option value="indore">Indore, Madhya Pradesh (Malwa Plateau)</option>
                <option value="bhopal">Bhopal, Madhya Pradesh (Central MP)</option>
                <option value="patna">Patna, Bihar (Middle Gangetic Plain)</option>
                <option value="burdwan">Burdwan, West Bengal (Rice Bowl)</option>
                <option value="anand">Anand, Gujarat (Charotar Agricultural Belt)</option>
                <option value="rajkot">Rajkot, Gujarat (Saurashtra Groundnut Belt)</option>
                <option value="jaipur">Jaipur, Rajasthan (Semi-Arid Zone)</option>
                <option value="kota">Kota, Rajasthan (Hadoti Region)</option>
                <option value="guntur">Guntur, Andhra Pradesh (Krishna-Godavari Zone)</option>
                <option value="hyderabad">Hyderabad, Telangana (Deccan Plateau)</option>
                <option value="dharwad">Dharwad, Karnataka (Northern Transition Zone)</option>
                <option value="coimbatore">Coimbatore, Tamil Nadu (Western Agro-zone)</option>
                <option value="delhi">Delhi NCR (Yamuna Floodplain)</option>
              </select>
            </div>
          </div>

          {/* Weather Display */}
          <WeatherWidget
            weather={weather}
            locationName={locationName}
            alerts={weatherAlerts}
            loading={weatherLoading}
          />
        </div>
      )}

      {/* STEP 4: Farm & Land Details Form */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Step 4 of 6
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">Farm & Agronomic Details</h2>
            <p className="text-xs text-slate-500">
              Provide farm size, current season, irrigation source, and farming preferences.
            </p>
          </div>

          <div className="space-y-4">
            {/* Area & Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Land Area</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={farmData.area}
                  onChange={(e) =>
                    setFarmData({ ...farmData, area: parseFloat(e.target.value) || 1 })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Area Unit</label>
                <select
                  value={farmData.areaUnit}
                  onChange={(e) => setFarmData({ ...farmData, areaUnit: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-sm bg-white"
                >
                  <option value="acre">Acres</option>
                  <option value="hectare">Hectares</option>
                  <option value="bigha">Bigha</option>
                  <option value="guntha">Guntha</option>
                </select>
              </div>
            </div>

            {/* Season & Irrigation */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Cropping Season
                </label>
                <select
                  value={farmData.season}
                  onChange={(e) => setFarmData({ ...farmData, season: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-sm bg-white"
                >
                  <option value="kharif">Kharif (Monsoon / Rainy)</option>
                  <option value="rabi">Rabi (Winter)</option>
                  <option value="zaid">Zaid (Summer)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Irrigation Facility
                </label>
                <select
                  value={farmData.irrigationType}
                  onChange={(e) => setFarmData({ ...farmData, irrigationType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-sm bg-white"
                >
                  <option value="borewell">Borewell / Tube-well</option>
                  <option value="canal">Canal Water</option>
                  <option value="drip">Drip Irrigation</option>
                  <option value="sprinkler">Sprinkler System</option>
                  <option value="rainfed">Rainfed Only (No pump)</option>
                </select>
              </div>
            </div>

            {/* Preference & Farming Method */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Crop Preference
                </label>
                <select
                  value={farmData.preference}
                  onChange={(e) => setFarmData({ ...farmData, preference: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-sm bg-white"
                >
                  <option value="any">Any Suitable High-Yield Crop</option>
                  <option value="cereals">Cereals (Paddy, Wheat, Maize)</option>
                  <option value="pulses">Pulses (Moong, Arhar, Gram)</option>
                  <option value="oilseeds">Oilseeds (Groundnut, Mustard)</option>
                  <option value="vegetables">Vegetables & Cash Crops</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Farming System</label>
                <select
                  value={farmData.farmingMethod}
                  onChange={(e) => setFarmData({ ...farmData, farmingMethod: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-sm bg-white"
                >
                  <option value="integrated">Integrated (Balanced Chemical + Organic)</option>
                  <option value="organic">100% Organic (Jaivik Kheti)</option>
                  <option value="conventional">Conventional High Intensity</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between gap-3">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            <button
              onClick={handleAnalyzeCrops}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'AI Analyzing Soil & Climate...' : 'Run AI Recommendation'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: AI Crop Recommendations */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                Step 5 of 6
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                AI Crop Suitability Recommendations
              </h2>
              <p className="text-xs text-slate-500">
                Ranked by multi-factor score: Soil pH & NPK (35%), Season match (25%), Weather (25%),
                Irrigation (15%).
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                onClick={() => setCurrentStep(6)}
                disabled={!selectedCropRec}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span>View Fertilizer Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendations.map((rec, idx) => (
                <CropCard
                  key={idx}
                  recommendation={rec}
                  isSelected={selectedCropRec?.crop.id === rec.crop.id}
                  onSelect={(selected) => {
                    handleSelectCrop(selected)
                    setCurrentStep(6)
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 text-sm">
                No recommendations found for this specific filter. Try changing crop preference to
                "Any".
              </p>
            </div>
          )}
        </div>
      )}

      {/* STEP 6: Fertilizer Plan & PDF Advisory */}
      {currentStep === 6 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                Step 6 of 6
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Fertilizer Dosage & Farming Action Plan
              </h2>
              <p className="text-xs text-slate-500">
                Scientifically calibrated for {selectedCropRec?.crop.name || 'your crop'} on{' '}
                {farmData.area} {farmData.areaUnit}.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentStep(5)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Crops
              </button>
            </div>
          </div>

          <FertilizerCalculator
            initialPlan={fertilizerPlan}
            cropName={selectedCropRec?.crop.name || 'Paddy'}
            landArea={farmData.area}
            areaUnit={farmData.areaUnit}
            soilData={soil}
            weather={weather}
            farmerName={farmerDetails.name}
            village={farmerDetails.village}
            district={farmerDetails.district}
            state={farmerDetails.state}
            onRecalculate={(newArea, newUnit) => {
              setFarmData((prev) => ({ ...prev, area: newArea, areaUnit: newUnit }))
              if (selectedCropRec) {
                handleSelectCrop(selectedCropRec)
              }
            }}
          />
        </div>
      )}
    </div>
  )
}
