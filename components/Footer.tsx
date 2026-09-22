import React from 'react'
import Link from 'next/link'
import { Sprout, Phone, Heart, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">AgroVision</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering Indian farmers through AI-driven soil health analysis, hyper-local weather
              intelligence, crop selection guidance, and precise fertilizer schedules.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Aligned with ICAR & Soil Health Card norms</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/soil/upload" className="hover:text-emerald-400 transition-colors">
                  Upload Soil Health Card
                </Link>
              </li>
              <li>
                <Link href="/soil/manual" className="hover:text-emerald-400 transition-colors">
                  Manual Soil Data Entry
                </Link>
              </li>
              <li>
                <Link href="/recommend" className="hover:text-emerald-400 transition-colors">
                  AI Crop Recommendations
                </Link>
              </li>
              <li>
                <Link href="/fertilizer" className="hover:text-emerald-400 transition-colors">
                  Fertilizer Dose Calculator
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Farmer Farm Records
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Govt Schemes & Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Govt. Agricultural Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://soilhealth.dac.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  Soil Health Card Portal <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  PM-KISAN Samman Nidhi <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://icar.org.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  ICAR Research Guidelines <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://agricoop.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  Ministry of Agriculture & Farmers Welfare <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Farmer Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Farmer Helpline
            </h4>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                <Phone className="w-4 h-4" />
                <span>1800-180-1551</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Toll-free Kisan Call Centre (6:00 AM to 10:00 PM) available in 22 regional languages.
              </p>
              <div className="pt-2 border-t border-slate-700 text-slate-400 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Local KVK: Contact District Office</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Disclaimer */}
        <div className="pt-8 border-t border-slate-800 text-[11px] text-slate-400 space-y-3">
          <p className="leading-relaxed bg-slate-800/40 p-3 rounded-lg border border-slate-800 text-slate-400">
            <strong>Advisory Disclaimer:</strong> AgroVision provides algorithmic decision-support
            guidance derived from official Soil Health Card parameters, regional meteorological forecasts,
            and ICAR package of practices. Fertilizer doses and crop choices should be cross-verified
            with your local Krishi Vigyan Kendra (KVK) or Assistant Agriculture Officer (AAO) for field-specific calibration.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2">
            <p>© {new Date().getFullYear()} AgroVision AI. Built with care for Indian Agriculture.</p>
            <p className="flex items-center gap-1 text-slate-400">
              Made for Indian Farmers with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
