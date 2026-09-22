'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, Sprout, Scale, Plus, ArrowLeft, CheckCircle2, Search } from 'lucide-react'

export default function AdminPage() {
  const [crops, setCrops] = useState<any[]>([])
  const [rules, setRules] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'crops' | 'fertilizers'>('crops')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [cRes, rRes] = await Promise.all([
          fetch('/api/admin/crops'),
          fetch('/api/admin/fertilizer-rules'),
        ])
        if (cRes.ok) {
          const cData = await cRes.json()
          if (cData.success) setCrops(cData.crops)
        }
        if (rRes.ok) {
          const rData = await rRes.json()
          if (rData.success) setRules(rData.rules)
        }
      } catch (e) {
        console.error('Admin fetch error:', e)
      } finally {
        setLoading(false)
      }
    }
    loadAdminData()
  }, [])

  const filteredCrops = crops.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.season.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Shield className="w-7 h-7 text-slate-800" />
            Agronomic Database Administration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage ICAR crop physiological requirements and nutrient recommendation rules.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl text-xs font-bold text-slate-700">
          <button
            onClick={() => setActiveTab('crops')}
            className={`px-4 py-1.5 rounded-lg transition-colors ${
              activeTab === 'crops'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Crops Database ({crops.length})
          </button>
          <button
            onClick={() => setActiveTab('fertilizers')}
            className={`px-4 py-1.5 rounded-lg transition-colors ${
              activeTab === 'fertilizers'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fertilizer Rules ({rules.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crop name, season, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 bg-white"
          />
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Source: ICAR State Agricultural Universities (SAUs)
        </span>
      </div>

      {/* Tab: Crops Table */}
      {activeTab === 'crops' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Crop Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Season</th>
                  <th className="p-3.5">pH Range</th>
                  <th className="p-3.5">Temp Range</th>
                  <th className="p-3.5">Duration</th>
                  <th className="p-3.5">Water Req</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredCrops.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70">
                    <td className="p-3.5 font-bold text-slate-900">
                      <div>{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {c.nameHi} {c.nameOr && `| ${c.nameOr}`}
                      </div>
                    </td>
                    <td className="p-3.5 capitalize">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {c.category}
                      </span>
                    </td>
                    <td className="p-3.5 capitalize">{c.season}</td>
                    <td className="p-3.5">
                      {c.phMin} – {c.phMax}
                    </td>
                    <td className="p-3.5">
                      {c.tempMin}°C – {c.tempMax}°C
                    </td>
                    <td className="p-3.5">{c.duration} Days</td>
                    <td className="p-3.5 capitalize">{c.waterRequirement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Fertilizer Rules Table */}
      {activeTab === 'fertilizers' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Crop</th>
                  <th className="p-3.5">N (kg/acre)</th>
                  <th className="p-3.5">P (kg/acre)</th>
                  <th className="p-3.5">K (kg/acre)</th>
                  <th className="p-3.5">S (kg/acre)</th>
                  <th className="p-3.5">Application Split</th>
                  <th className="p-3.5">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {rules.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70">
                    <td className="p-3.5 font-bold text-slate-900">{r.crop?.name || 'Crop'}</td>
                    <td className="p-3.5 font-bold text-emerald-700">{r.nitrogenPerAcre}</td>
                    <td className="p-3.5 font-bold text-sky-700">{r.phosphorusPerAcre}</td>
                    <td className="p-3.5 font-bold text-amber-700">{r.potassiumPerAcre}</td>
                    <td className="p-3.5">{r.sulphurPerAcre}</td>
                    <td className="p-3.5 text-slate-600">{r.applicationStage}</td>
                    <td className="p-3.5 text-slate-400 text-[11px]">{r.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
