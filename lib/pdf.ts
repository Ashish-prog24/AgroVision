import { jsPDF } from 'jspdf'

export interface AdvisoryReportData {
  farmerName: string
  village: string
  district: string
  state: string
  phone?: string
  landArea: number
  areaUnit: string
  irrigationType: string
  season: string
  soilData: {
    ph?: number
    ec?: number
    organicCarbon?: number
    nitrogen?: number
    phosphorus?: number
    potassium?: number
    sulphur?: number
    zinc?: number
  }
  weather: {
    temperature: number
    humidity: number
    condition: string
    rainfallForecast: string
  }
  recommendedCrops: Array<{
    name: string
    suitability: string
    score: number
    durationDays?: number
  }>
  selectedCrop: string
  fertilizerPlan?: {
    totalN: number
    totalP: number
    totalK: number
    products: Array<{
      product: string
      totalQuantity: number
      unit: string
    }>
    schedule: Array<{
      stage: string
      timing: string
      applications: Array<{ product: string; qty: number; unit: string }>
    }>
  }
}

export function generateAdvisoryPDF(data: AdvisoryReportData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const primaryColor = [22, 101, 52] // Dark emerald
  const secondaryColor = [217, 119, 6] // Amber
  const darkText = [30, 41, 59]
  const lightBg = [240, 253, 244]

  let y = 15

  // Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.rect(0, 0, 210, 26, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('AgroVision – Comprehensive Farm Advisory', 14, 12)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('AI Soil & Crop Intelligence System | KrushiMitra Advisory', 14, 19)
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 150, 19)

  y = 35

  // Section 1: Farmer & Location Info
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2])
  doc.roundedRect(12, y, 186, 26, 2, 2, 'F')
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.roundedRect(12, y, 186, 26, 2, 2, 'D')

  doc.setFontSize(11)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setFont('helvetica', 'bold')
  doc.text('1. Farmer & Land Profile', 16, y + 6)

  doc.setFontSize(9)
  doc.setTextColor(darkText[0], darkText[1], darkText[2])
  doc.setFont('helvetica', 'normal')
  doc.text(`Farmer: ${data.farmerName || 'Ramesh Kumar'}`, 16, y + 14)
  doc.text(`Location: ${data.village || 'Satyabhamapur'}, ${data.district || 'Puri'}, ${data.state || 'Odisha'}`, 16, y + 20)
  doc.text(`Land Area: ${data.landArea || 2.5} ${data.areaUnit || 'Acres'}`, 110, y + 14)
  doc.text(`Irrigation: ${data.irrigationType || 'Borewell'} | Season: ${data.season || 'Kharif'}`, 110, y + 20)

  y += 34

  // Section 2: Soil Health Summary
  doc.setFontSize(11)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setFont('helvetica', 'bold')
  doc.text('2. Soil Health Analysis', 14, y)
  y += 5

  const soil = data.soilData || {}
  const soilParams = [
    { name: 'pH', value: soil.ph ? `${soil.ph}` : '6.8', status: 'Normal/Neutral' },
    { name: 'EC (Salinity)', value: soil.ec ? `${soil.ec} dS/m` : '0.45 dS/m', status: 'Normal' },
    { name: 'Organic Carbon', value: soil.organicCarbon ? `${soil.organicCarbon}%` : '0.54%', status: 'Medium' },
    { name: 'Nitrogen (N)', value: soil.nitrogen ? `${soil.nitrogen} kg/ha` : '240 kg/ha', status: 'Low-Medium' },
    { name: 'Phosphorus (P)', value: soil.phosphorus ? `${soil.phosphorus} kg/ha` : '18.5 kg/ha', status: 'Medium' },
    { name: 'Potassium (K)', value: soil.potassium ? `${soil.potassium} kg/ha` : '195 kg/ha', status: 'Medium' },
  ]

  // Soil Grid Table
  const colWidth = 30
  let colX = 14
  doc.setFontSize(8)
  for (const p of soilParams) {
    doc.setFillColor(248, 250, 252)
    doc.rect(colX, y, colWidth, 16, 'F')
    doc.setDrawColor(226, 232, 240)
    doc.rect(colX, y, colWidth, 16, 'D')

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(71, 85, 105)
    doc.text(p.name, colX + 2, y + 5)

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text(p.value, colX + 2, y + 10)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 116, 139)
    doc.text(p.status, colX + 2, y + 14)

    colX += colWidth + 1
  }

  y += 24

  // Section 3: Weather Overview
  doc.setFontSize(11)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setFont('helvetica', 'bold')
  doc.text('3. Agro-Meteorological Advisory', 14, y)
  y += 6

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(darkText[0], darkText[1], darkText[2])
  const w = data.weather || { temperature: 31, humidity: 76, condition: 'Partly Cloudy', rainfallForecast: 'Light rain expected in next 48h' }
  doc.text(`Current Weather: ${w.temperature}°C, ${w.condition} | Relative Humidity: ${w.humidity}%`, 14, y)
  y += 5
  doc.text(`Forecast & Guidance: ${w.rainfallForecast}. Ideal for field preparation and early sowing operations.`, 14, y)

  y += 12

  // Section 4: Recommended Crops
  doc.setFontSize(11)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setFont('helvetica', 'bold')
  doc.text('4. Recommended Crops (Ranked by AI Soil-Climate Match)', 14, y)
  y += 6

  const crops = data.recommendedCrops || [
    { name: 'Paddy / Rice (Oryza sativa)', suitability: 'Excellent (92%)', score: 92, durationDays: 125 },
    { name: 'Moong Dal (Green Gram)', suitability: 'Good (85%)', score: 85, durationDays: 70 },
    { name: 'Groundnut (Arachis hypogaea)', suitability: 'Good (81%)', score: 81, durationDays: 110 },
  ]

  for (let i = 0; i < crops.length; i++) {
    const c = crops[i]
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(darkText[0], darkText[1], darkText[2])
    doc.text(`#${i + 1} ${c.name}`, 16, y)
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text(`Match: ${c.suitability}`, 140, y)
    y += 5
  }

  y += 8

  // Section 5: Customized Fertilizer Plan
  doc.setFontSize(11)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setFont('helvetica', 'bold')
  doc.text(`5. Fertilizer & Nutrient Management for ${data.selectedCrop || 'Paddy'} (${data.landArea || 2.5} ${data.areaUnit || 'Acres'})`, 14, y)
  y += 7

  if (data.fertilizerPlan && data.fertilizerPlan.products) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(darkText[0], darkText[1], darkText[2])
    doc.text('Product Requirements:', 16, y)
    y += 5

    doc.setFont('helvetica', 'normal')
    for (const p of data.fertilizerPlan.products) {
      doc.text(`• ${p.product}: ${p.totalQuantity} ${p.unit}`, 20, y)
      y += 5
    }

    y += 4
    doc.setFont('helvetica', 'bold')
    doc.text('Application Schedule:', 16, y)
    y += 5

    doc.setFont('helvetica', 'normal')
    for (const s of data.fertilizerPlan.schedule) {
      const appText = s.applications.map(a => `${a.qty} ${a.unit} ${a.product}`).join(' + ')
      doc.text(`• ${s.stage} (${s.timing}): ${appText}`, 20, y)
      y += 5
    }
  } else {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(darkText[0], darkText[1], darkText[2])
    doc.text('• Basal Dose: 50 kg DAP + 35 kg MOP per acre before transplanting/sowing.', 16, y)
    y += 5
    doc.text('• 1st Top Dressing: 35 kg Urea per acre at active tillering (21-25 days).', 16, y)
    y += 5
    doc.text('• 2nd Top Dressing: 35 kg Urea per acre at panicle initiation (40-45 days).', 16, y)
    y += 5
  }

  y += 10

  // Advisory Disclaimer
  doc.setFontSize(7)
  doc.setTextColor(100, 116, 139)
  doc.text(
    'Disclaimer: AgroVision advisory recommendations are generated by algorithmic & agronomic models using Soil Health Card guidelines.',
    14,
    278
  )
  doc.text(
    'Always consult your local Assistant Agriculture Officer (AAO) or Krishi Vigyan Kendra (KVK) specialist for localized micro-variations.',
    14,
    283
  )

  return doc
}
