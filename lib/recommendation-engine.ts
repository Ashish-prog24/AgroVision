import { getSoilStatus, toAcres } from './units'

export interface SoilData {
  ph?: number
  ec?: number
  organicCarbon?: number
  nitrogen?: number
  phosphorus?: number
  potassium?: number
  sulphur?: number
  zinc?: number
  iron?: number
}

export interface WeatherSnapshot {
  temperature: number
  humidity: number
  precipitation: number
  rainProbability?: number
}

export interface FarmInput {
  area: number
  areaUnit: string
  irrigationType: string  // rainfed | borewell | canal | drip | sprinkler
  season: string          // kharif | rabi | zaid
  previousCrop?: string
  preference?: string     // cereals | pulses | oilseeds | vegetables | any
  farmingMethod?: string  // organic | conventional | integrated
  state?: string
}

export interface CropRecord {
  id: string
  name: string
  nameHi?: string | null
  nameOr?: string | null
  category: string
  season: string
  phMin: number
  phMax: number
  tempMin: number
  tempMax: number
  rainfallMin: number
  rainfallMax: number
  irrigationNeeded: boolean
  waterRequirement: string
  scientificName?: string | null
  duration?: number | null
  description?: string | null
  descriptionHi?: string | null
  descriptionOr?: string | null
}

export interface RecommendationResult {
  crop: CropRecord
  score: number
  soilScore: number
  weatherScore: number
  seasonScore: number
  irrigationScore: number
  reasons: string[]
  warnings: string[]
  suitability: 'excellent' | 'good' | 'moderate' | 'poor'
}

function scoreSoil(crop: CropRecord, soil: SoilData): { score: number; reasons: string[]; warnings: string[] } {
  let score = 0
  const reasons: string[] = []
  const warnings: string[] = []
  let factors = 0

  if (soil.ph !== undefined) {
    factors++
    if (soil.ph >= crop.phMin && soil.ph <= crop.phMax) {
      score += 1
      reasons.push(`Soil pH ${soil.ph.toFixed(1)} is within the suitable range (${crop.phMin}–${crop.phMax})`)
    } else if (Math.abs(soil.ph - (crop.phMin + crop.phMax) / 2) < 0.5) {
      score += 0.6
      warnings.push(`Soil pH ${soil.ph.toFixed(1)} is slightly outside the ideal range. Soil amendment may help.`)
    } else {
      score += 0.2
      warnings.push(`Soil pH ${soil.ph.toFixed(1)} is outside the suitable range for this crop.`)
    }
  }

  if (soil.nitrogen !== undefined) {
    factors++
    const status = getSoilStatus('nitrogen', soil.nitrogen)
    if (status === 'medium' || status === 'high') { score += 1; reasons.push('Nitrogen availability is adequate') }
    else { score += 0.5; warnings.push('Low nitrogen — fertilizer application recommended') }
  }

  if (soil.organicCarbon !== undefined) {
    factors++
    const status = getSoilStatus('organicCarbon', soil.organicCarbon)
    if (status !== 'low') { score += 1; reasons.push('Organic carbon content is adequate') }
    else { score += 0.6; warnings.push('Low organic carbon — consider adding compost or FYM') }
  }

  return { score: factors > 0 ? score / factors : 0.5, reasons, warnings }
}

function scoreWeather(crop: CropRecord, weather: WeatherSnapshot): { score: number; reasons: string[]; warnings: string[] } {
  let score = 0
  const reasons: string[] = []
  const warnings: string[] = []

  if (weather.temperature >= crop.tempMin && weather.temperature <= crop.tempMax) {
    score += 1
    reasons.push(`Temperature ${weather.temperature}°C is suitable (${crop.tempMin}–${crop.tempMax}°C)`)
  } else if (weather.temperature < crop.tempMin) {
    score += 0.3
    warnings.push(`Temperature may be too low for this crop`)
  } else {
    score += 0.4
    warnings.push(`High temperature may cause heat stress`)
  }

  const rainfall = weather.precipitation * 30 // approximate monthly
  if (rainfall >= crop.rainfallMin && rainfall <= crop.rainfallMax) {
    score += 1
    reasons.push('Rainfall pattern is compatible with crop water needs')
  } else if (rainfall < crop.rainfallMin) {
    score += 0.5
    warnings.push('Lower than ideal rainfall — irrigation may be required')
  } else {
    score += 0.6
    warnings.push('Higher rainfall — ensure good drainage to avoid waterlogging')
  }

  return { score: score / 2, reasons, warnings }
}

function scoreSeason(crop: CropRecord, farm: FarmInput): { score: number; reasons: string[] } {
  const cropSeasons = crop.season.toLowerCase().split(',').map(s => s.trim())
  const farmSeason = farm.season.toLowerCase()
  if (cropSeasons.includes(farmSeason) || cropSeasons.includes('all')) {
    return { score: 1, reasons: [`This crop is well suited to the ${farm.season} season`] }
  }
  if (cropSeasons.some(s => ['kharif', 'rabi'].includes(s))) {
    return { score: 0.4, reasons: [] }
  }
  return { score: 0.2, reasons: [] }
}

function scoreIrrigation(crop: CropRecord, farm: FarmInput): { score: number; reasons: string[] } {
  const hasIrrigation = farm.irrigationType !== 'rainfed'
  if (crop.irrigationNeeded && hasIrrigation) {
    return { score: 1, reasons: [`Irrigation available — suitable for ${crop.name}'s water requirements`] }
  }
  if (!crop.irrigationNeeded) {
    return { score: 1, reasons: ['This crop can thrive on rainfall alone'] }
  }
  if (crop.waterRequirement === 'low') {
    return { score: 0.8, reasons: ['Crop has low water requirements, manageable with rainfall'] }
  }
  return { score: 0.4, reasons: [] }
}

function checkPreference(crop: CropRecord, farm: FarmInput): boolean {
  if (!farm.preference || farm.preference === 'any') return true
  return crop.category.toLowerCase() === farm.preference.toLowerCase()
}

export function recommendCrops(
  crops: CropRecord[],
  soil: SoilData,
  weather: WeatherSnapshot,
  farm: FarmInput
): RecommendationResult[] {
  const results: RecommendationResult[] = []

  for (const crop of crops) {
    if (!checkPreference(crop, farm)) continue

    const soilResult = scoreSoil(crop, soil)
    const weatherResult = scoreWeather(crop, weather)
    const seasonResult = scoreSeason(crop, farm)
    const irrigationResult = scoreIrrigation(crop, farm)

    const totalScore =
      soilResult.score * 0.35 +
      weatherResult.score * 0.25 +
      seasonResult.score * 0.25 +
      irrigationResult.score * 0.15

    const reasons = [
      ...soilResult.reasons,
      ...weatherResult.reasons,
      ...seasonResult.reasons,
      ...irrigationResult.reasons,
    ]
    const warnings = [...soilResult.warnings, ...weatherResult.warnings]

    let suitability: RecommendationResult['suitability'] = 'poor'
    if (totalScore >= 0.8) suitability = 'excellent'
    else if (totalScore >= 0.65) suitability = 'good'
    else if (totalScore >= 0.5) suitability = 'moderate'

    results.push({
      crop,
      score: totalScore,
      soilScore: soilResult.score,
      weatherScore: weatherResult.score,
      seasonScore: seasonResult.score,
      irrigationScore: irrigationResult.score,
      reasons,
      warnings,
      suitability,
    })
  }

  return results
    .filter(r => r.score >= 0.35)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
}
