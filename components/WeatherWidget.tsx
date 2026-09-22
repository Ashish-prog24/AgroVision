'use client'

import React from 'react'
import {
  Sun,
  CloudSun,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  Calendar,
  RefreshCw,
} from 'lucide-react'
import { WeatherData } from '@/lib/weather'

interface WeatherWidgetProps {
  weather: WeatherData
  locationName?: string
  alerts?: string[]
  loading?: boolean
}

export function WeatherWidget({
  weather,
  locationName = 'Farm Location',
  alerts = [],
  loading = false,
}: WeatherWidgetProps) {
  const { current, daily } = weather

  const getWeatherIcon = (code: number, size = 'w-6 h-6') => {
    if (code >= 95) return <CloudLightning className={`${size} text-amber-500`} />
    if (code >= 51 || code >= 80) return <CloudRain className={`${size} text-sky-500`} />
    if (code === 1 || code === 2 || code === 3) return <CloudSun className={`${size} text-amber-500`} />
    if (code === 0) return <Sun className={`${size} text-amber-500`} />
    return <CloudSun className={`${size} text-slate-500`} />
  }

  const formatDayName = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { weekday: 'short' })
  }

  return (
    <div className="space-y-4">
      {/* Weather Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium shadow-xs"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Agricultural Advisory Alert: </span>
                {alert}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Weather Card */}
      <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden transition-all">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-emerald-500/20 blur-xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-emerald-200 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <span>Live Agro-Meteorological Data</span>
                {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />}
              </span>
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                {locationName}
              </h3>
            </div>
            <div className="bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{loading ? 'Updating...' : 'Live Satellite / Radar'}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/15">
                {getWeatherIcon(current.weatherCode, 'w-10 h-10')}
              </div>
              <div>
                <div className="text-4xl font-extrabold tracking-tight">
                  {Math.round(current.temperature)}°C
                </div>
                <div className="text-sm font-medium text-emerald-100">{current.condition}</div>
                <div className="text-xs text-emerald-200">Feels like {Math.round(current.feelsLike)}°C</div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white/10 backdrop-blur-xs px-3 py-2 rounded-xl border border-white/10">
                <div className="flex items-center gap-1 text-[11px] text-emerald-200">
                  <Droplets className="w-3.5 h-3.5" /> Humidity
                </div>
                <div className="text-sm font-bold mt-0.5">{current.humidity}%</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs px-3 py-2 rounded-xl border border-white/10">
                <div className="flex items-center gap-1 text-[11px] text-emerald-200">
                  <Wind className="w-3.5 h-3.5" /> Wind Speed
                </div>
                <div className="text-sm font-bold mt-0.5">{current.windSpeed} km/h</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs px-3 py-2 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1 text-[11px] text-emerald-200">
                  <CloudRain className="w-3.5 h-3.5" /> Rain Volume
                </div>
                <div className="text-sm font-bold mt-0.5">{current.precipitation} mm</div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast Strip */}
          <div className="mt-6 pt-5 border-t border-white/15">
            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-emerald-200">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> 7-Day Forecast & Field Operations
              </span>
              <span className="text-[11px] text-emerald-300">Open-Meteo High Resolution</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {daily && daily.slice(0, 7).map((d, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl text-center flex flex-col items-center justify-between border border-white/10 hover:bg-white/15 transition-colors"
                >
                  <span className="text-[11px] font-semibold text-emerald-100">
                    {i === 0 ? 'Today' : formatDayName(d.date)}
                  </span>
                  <div className="my-1.5">{getWeatherIcon(d.weatherCode, 'w-5 h-5')}</div>
                  <div className="text-xs font-bold">{Math.round(d.tempMax)}°</div>
                  <div className="text-[10px] text-emerald-200">{Math.round(d.tempMin)}°</div>
                  {d.precipitationProbability > 0 && (
                    <div className="text-[9px] text-sky-200 font-semibold mt-1">
                      {d.precipitationProbability}% 💧
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
