'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  Sprout,
  Plus,
  MapPin,
  Calendar,
  FileText,
  ArrowRight,
  Sparkles,
  Scale,
} from 'lucide-react'

export default function DashboardPage() {
  const [farms, setFarms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFarms() {
      try {
        const res = await fetch('/api/farms')
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.farms) {
            setFarms(data.farms)
          }
        }
      } catch (e) {
        console.error('Error fetching farms:', e)
      } finally {
        setLoading(false)
      }
    }
    loadFarms()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-emerald-600" />
            Farmer Dashboard & Land Records
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your registered plots, historical Soil Health Cards, and past advisories.
          </p>
        </div>

        <Link
          href="/soil/upload"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Soil Test / Advisory</span>
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Registered Plots</span>
          <div className="text-3xl font-black text-slate-900 mt-1">{farms.length || 1}</div>
          <p className="text-xs text-emerald-600 mt-1">2.5 Total Acres</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Soil Health Status</span>
          <div className="text-xl font-bold text-emerald-700 mt-2 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Normal / Neutral
          </div>
          <p className="text-xs text-slate-500 mt-1">pH 6.8 | Salinity Safe</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Recommended Crops</span>
          <div className="text-3xl font-black text-slate-900 mt-1">8</div>
          <p className="text-xs text-emerald-600 mt-1">Paddy, Moong, Groundnut</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Advisory Reports</span>
          <div className="text-3xl font-black text-slate-900 mt-1">1</div>
          <p className="text-xs text-slate-500 mt-1">PDF ready for download</p>
        </div>
      </div>

      {/* Farm Plots Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Your Agricultural Plots</h2>

        {farms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {farms.map((farm) => {
              const latestSoil = farm.soilReports?.[0]
              return (
                <div
                  key={farm.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{farm.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {farm.village || 'Satyabhamapur'}, {farm.district || 'Puri'},{' '}
                          {farm.state || 'Odisha'}
                        </span>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {farm.area} {farm.areaUnit}
                    </span>
                  </div>

                  {/* Soil Health Snapshot */}
                  {latestSoil && (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs grid grid-cols-4 gap-2 text-center">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">pH</div>
                        <div className="font-extrabold text-slate-900 mt-0.5">{latestSoil.ph}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">N (kg/ha)</div>
                        <div className="font-extrabold text-slate-900 mt-0.5">
                          {latestSoil.nitrogen || 240}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">P (kg/ha)</div>
                        <div className="font-extrabold text-slate-900 mt-0.5">
                          {latestSoil.phosphorus || 18.5}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">K (kg/ha)</div>
                        <div className="font-extrabold text-slate-900 mt-0.5">
                          {latestSoil.potassium || 195}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="text-slate-400">
                      Irrigation: <strong className="text-slate-700 capitalize">{farm.irrigationType}</strong>
                    </span>

                    <Link
                      href="/recommend"
                      className="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center gap-1"
                    >
                      <span>View Recommendations</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Demo Fallback Card */
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Main Coastal Farm (Puri Plot)</h3>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Satyabhamapur, Puri, Odisha</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                2.5 Acres
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">pH</div>
                <div className="font-extrabold text-slate-900 mt-0.5">6.8</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">N (kg/ha)</div>
                <div className="font-extrabold text-slate-900 mt-0.5">240</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">P (kg/ha)</div>
                <div className="font-extrabold text-slate-900 mt-0.5">18.5</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">K (kg/ha)</div>
                <div className="font-extrabold text-slate-900 mt-0.5">195</div>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-400">
                Irrigation: <strong className="text-slate-700">Borewell</strong>
              </span>

              <Link
                href="/recommend"
                className="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center gap-1"
              >
                <span>View Recommendations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
