import React from 'react'
import { StepWizard } from '@/components/StepWizard'

export const metadata = {
  title: 'Upload Soil Health Card | AgroVision AI',
  description: 'Upload your soil test report for AI OCR extraction and instant soil health analysis.',
}

export default function SoilUploadPage() {
  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Soil Health Card Analysis & Crop Advisory
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Upload your official soil testing report (PDF or photo) or test with sample data.
        </p>
      </div>

      <StepWizard />
    </div>
  )
}
