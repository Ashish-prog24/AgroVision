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
  farmScore?: number
  reasons: string[]
  warnings: string[]
  suitability: 'excellent' | 'good' | 'moderate' | 'poor'
  mlConfidence?: number
  mlEngine?: string
}

// 1. Precise Soil Analysis: pH, N, P, K, Organic Carbon, EC, Sulphur
function scoreSoil(crop: CropRecord, soil: SoilData): { score: number; reasons: string[]; warnings: string[] } {
  let scoreSum = 0
  let totalWeights = 0
  const reasons: string[] = []
  const warnings: string[] = []

  // A. pH Compatibility (Weight: 25)
  if (soil.ph !== undefined && !isNaN(soil.ph)) {
    totalWeights += 25
    if (soil.ph >= crop.phMin && soil.ph <= crop.phMax) {
      scoreSum += 25
      reasons.push(`Soil pH (${soil.ph.toFixed(1)}) is optimal for ${crop.name} (ideal range: ${crop.phMin}–${crop.phMax})`)
    } else if (Math.abs(soil.ph - (crop.phMin + crop.phMax) / 2) <= 0.6) {
      scoreSum += 16
      warnings.push(`Soil pH (${soil.ph.toFixed(1)}) is marginally outside ${crop.phMin}–${crop.phMax}. Apply organic compost to buffer pH.`)
    } else {
      scoreSum += 5
      warnings.push(`Soil pH (${soil.ph.toFixed(1)}) requires correction with agricultural lime (if acidic) or gypsum (if alkaline).`)
    }
  }

  // B. Nitrogen (N) Analysis (Weight: 25)
  if (soil.nitrogen !== undefined && !isNaN(soil.nitrogen)) {
    totalWeights += 25
    const nStatus = getSoilStatus('nitrogen', soil.nitrogen)
    const isLegume = crop.category === 'pulses'

    if (isLegume) {
      // Legumes fix nitrogen naturally
      scoreSum += 25
      reasons.push(`As a nitrogen-fixing legume, ${crop.name} thrives on current soil Nitrogen (${soil.nitrogen} kg/ha) while enriching root zones`)
    } else {
      if (nStatus === 'medium' || nStatus === 'high') {
        scoreSum += 25
        reasons.push(`Available Nitrogen (${soil.nitrogen} kg/ha) adequately supports robust vegetative growth`)
      } else {
        scoreSum += 12
        warnings.push(`Soil Nitrogen (${soil.nitrogen} kg/ha) is on the lower side; split basal application of Urea/DAP is recommended`)
      }
    }
  }

  // C. Phosphorus (P) Analysis (Weight: 20)
  if (soil.phosphorus !== undefined && !isNaN(soil.phosphorus)) {
    totalWeights += 20
    const pStatus = getSoilStatus('phosphorus', soil.phosphorus)
    if (pStatus === 'medium' || pStatus === 'high') {
      scoreSum += 20
      reasons.push(`Available Phosphorus (${soil.phosphorus} kg/ha) promotes strong root establishment and flowering`)
    } else {
      scoreSum += 10
      warnings.push(`Available Phosphorus (${soil.phosphorus} kg/ha) is low; ensure adequate Single Super Phosphate (SSP) or DAP at sowing`)
    }
  }

  // D. Potassium (K) Analysis (Weight: 15)
  if (soil.potassium !== undefined && !isNaN(soil.potassium)) {
    totalWeights += 15
    const kStatus = getSoilStatus('potassium', soil.potassium)
    if (kStatus === 'medium' || kStatus === 'high') {
      scoreSum += 15
      reasons.push(`Available Potassium (${soil.potassium} kg/ha) provides disease tolerance and grain/tuber density`)
    } else {
      scoreSum += 8
      warnings.push(`Soil Potassium (${soil.potassium} kg/ha) is low; apply Muriate of Potash (MOP) during land preparation`)
    }
  }

  // E. Organic Carbon & Soil Biology (Weight: 15)
  if (soil.organicCarbon !== undefined && !isNaN(soil.organicCarbon)) {
    totalWeights += 15
    const ocStatus = getSoilStatus('organicCarbon', soil.organicCarbon)
    if (ocStatus !== 'low') {
      scoreSum += 15
      reasons.push(`Soil Organic Carbon (${soil.organicCarbon}%) indicates healthy microbial activity and moisture retention`)
    } else {
      scoreSum += 8
      warnings.push(`Low Organic Carbon (${soil.organicCarbon}%); add 4–5 tonnes/acre of well-rotted FYM or vermicompost`)
    }
  }

  const finalScore = totalWeights > 0 ? Math.round((scoreSum / totalWeights) * 100) / 100 : 0.75
  return { score: finalScore, reasons, warnings }
}

// 2. Weather & Climate Matching
function scoreWeather(crop: CropRecord, weather: WeatherSnapshot): { score: number; reasons: string[]; warnings: string[] } {
  let scoreSum = 0
  const reasons: string[] = []
  const warnings: string[] = []

  // Temperature
  if (weather.temperature >= crop.tempMin && weather.temperature <= crop.tempMax) {
    scoreSum += 0.5
    reasons.push(`Ambient temperature (${weather.temperature}°C) matches optimal thermal range (${crop.tempMin}–${crop.tempMax}°C)`)
  } else if (Math.abs(weather.temperature - (crop.tempMin + crop.tempMax) / 2) <= 6) {
    scoreSum += 0.35
    warnings.push(`Current temperature (${weather.temperature}°C) is moderately near boundaries of thermal comfort (${crop.tempMin}–${crop.tempMax}°C)`)
  } else {
    scoreSum += 0.15
    warnings.push(`Temperature (${weather.temperature}°C) may induce thermal stress for this crop`)
  }

  // Estimated Monthly Rainfall / Moisture
  const rainfall = (weather.precipitation ?? 4) * 25 + 50
  if (rainfall >= crop.rainfallMin && rainfall <= crop.rainfallMax * 1.3) {
    scoreSum += 0.5
    reasons.push(`Regional moisture availability (~${Math.round(rainfall)} mm) is well aligned with crop water requirements`)
  } else if (rainfall < crop.rainfallMin) {
    scoreSum += 0.3
    warnings.push(`Precipitation is lower than crop requirement; supplementary irrigation will be essential`)
  } else {
    scoreSum += 0.35
    warnings.push(`High precipitation risk; ensure effective ridge and furrow drainage to prevent water stagnation`)
  }

  return { score: Math.round(scoreSum * 100) / 100, reasons, warnings }
}

// 3. Strict Cropping Season Suitability
function scoreSeason(crop: CropRecord, farm: FarmInput): { score: number; reasons: string[]; warnings: string[] } {
  const cropSeasons = crop.season.toLowerCase().split(',').map(s => s.trim())
  const farmSeason = (farm.season || 'kharif').toLowerCase()

  if (cropSeasons.includes(farmSeason) || cropSeasons.includes('all')) {
    const seasonLabel = farmSeason.charAt(0).toUpperCase() + farmSeason.slice(1)
    return {
      score: 1.0,
      reasons: [`Season Match: ${crop.name} is a prime ${seasonLabel} season crop for your region`],
      warnings: [],
    }
  }

  // Strictly out of season: 0 score
  return {
    score: 0.0,
    reasons: [],
    warnings: [`Out-of-Season: ${crop.name} is a ${crop.season.toUpperCase()} crop, not suitable for the ${farmSeason.toUpperCase()} season`],
  }
}

// 4. Irrigation Infrastructure & Water Requirement Matching
function scoreIrrigation(crop: CropRecord, farm: FarmInput): { score: number; reasons: string[]; warnings: string[] } {
  const irrigation = (farm.irrigationType || 'rainfed').toLowerCase()
  const waterReq = crop.waterRequirement.toLowerCase()
  const reasons: string[] = []
  const warnings: string[] = []

  if (irrigation === 'rainfed') {
    if (waterReq === 'low') {
      return {
        score: 1.0,
        reasons: [`Water Match: Thrives under rainfed conditions due to natural drought hardiness and low water demand`],
        warnings: [],
      }
    } else if (waterReq === 'medium') {
      return {
        score: 0.65,
        reasons: [`Can be grown rainfed in favorable monsoon seasons`],
        warnings: [`Rainfed warning: Yield may be impacted if prolonged dry spells occur during critical flowering`],
      }
    } else {
      // High water requirement crop under rainfed
      return {
        score: 0.2,
        reasons: [],
        warnings: [`Critical Irrigation Warning: ${crop.name} has high water requirements; rainfed cultivation carries high drought risk`],
      }
    }
  }

  // Micro-irrigation (Drip / Sprinkler)
  if (irrigation === 'drip' || irrigation === 'sprinkler') {
    if (crop.category === 'vegetables' || crop.category === 'oilseeds') {
      return {
        score: 1.0,
        reasons: [`Water Match: High-value responsiveness with your ${irrigation.toUpperCase()} micro-irrigation system (+25% water-use efficiency)`],
        warnings: [],
      }
    }
    return {
      score: 0.95,
      reasons: [`Assured water availability via ${irrigation} system safeguards critical growth stages`],
      warnings: [],
    }
  }

  // Canal / Borewell
  if (irrigation === 'canal' || irrigation === 'borewell') {
    if (waterReq === 'high') {
      return {
        score: 1.0,
        reasons: [`Assured irrigation from ${irrigation} fulfills high water requirements of ${crop.name}`],
        warnings: [],
      }
    }
    return {
      score: 0.95,
      reasons: [`Reliable ${irrigation} water supply ensures steady crop development without moisture stress`],
      warnings: [],
    }
  }

  return { score: 0.7, reasons, warnings }
}

// 5. Farming System & Landholding Scale Matching
function scoreFarmScaleAndMethod(crop: CropRecord, farm: FarmInput): { score: number; reasons: string[]; warnings: string[] } {
  const areaAcres = toAcres(Number(farm.area || 1), (farm.areaUnit || 'acre').toLowerCase() as any)
  const method = (farm.farmingMethod || 'integrated').toLowerCase()
  const reasons: string[] = []
  const warnings: string[] = []
  let score = 0.85

  // Farming Method
  if (method === 'organic') {
    if (crop.category === 'pulses') {
      score += 0.15
      reasons.push(`Jaivik (Organic) Synergy: As a nitrogen-fixing pulse, ${crop.name} minimizes dependency on synthetic fertilizers`)
    } else if (crop.category === 'vegetables') {
      score += 0.1
      reasons.push(`Organic Farming: High market premium for certified organic ${crop.name} in urban markets`)
    } else {
      reasons.push(`Suitable for organic production with enriched FYM, Jeevamrit, and bio-fertilizers (Rhizobium/PSB)`)
    }
  } else if (method === 'integrated') {
    score += 0.1
    reasons.push(`Integrated System: Responds exceptionally well to balanced chemical fertilizers combined with organic manure`)
  } else {
    reasons.push(`Conventional System: Capable of achieving maximum genetic yield potential under split fertilizer management`)
  }

  // Landholding Size
  if (areaAcres <= 2.5) {
    if (crop.category === 'vegetables' || crop.category === 'pulses') {
      reasons.push(`Farm Scale Match: High net income per acre for small/marginal landholdings (${areaAcres.toFixed(1)} acres)`)
    }
  } else {
    if (crop.category === 'cereals' || crop.category === 'oilseeds') {
      reasons.push(`Farm Scale Match: Highly amenable to tractor mechanization and bulk grain marketing on ${areaAcres.toFixed(1)} acres`)
    }
  }

  return { score: Math.min(1.0, score), reasons, warnings }
}

// 6. Crop Preference Strict Filtering
function checkPreference(crop: CropRecord, farm: FarmInput): boolean {
  if (!farm.preference || farm.preference === 'any') return true
  const pref = farm.preference.toLowerCase()
  const cat = crop.category.toLowerCase()

  if (pref === 'cereals' && cat === 'cereals') return true
  if (pref === 'pulses' && cat === 'pulses') return true
  if (pref === 'oilseeds' && cat === 'oilseeds') return true
  if (pref === 'vegetables' && (cat === 'vegetables' || cat === 'spices')) return true

  return false
}

// Master Recommendation Engine
export function recommendCrops(
  crops: CropRecord[],
  soil: SoilData,
  weather: WeatherSnapshot,
  farm: FarmInput
): RecommendationResult[] {
  const results: RecommendationResult[] = []

  // Ensure farm preferences & season are strictly respected
  const filteredCrops = crops.filter(crop => checkPreference(crop, farm))
  const pool = filteredCrops.length >= 1 ? filteredCrops : crops

  for (const crop of pool) {
    const seasonResult = scoreSeason(crop, farm)
    
    // Strict Agronomic Rule: If a crop is out of season, do not recommend it!
    if (seasonResult.score === 0) {
      continue
    }

    const soilResult = scoreSoil(crop, soil)
    const weatherResult = scoreWeather(crop, weather)
    const irrigationResult = scoreIrrigation(crop, farm)
    const farmScaleResult = scoreFarmScaleAndMethod(crop, farm)

    // Weighted multi-factor precision score
    // Season (30%) + Soil (25%) + Irrigation (20%) + Climate (15%) + Farm Scale (10%)
    const totalScore =
      seasonResult.score * 0.30 +
      soilResult.score * 0.25 +
      irrigationResult.score * 0.20 +
      weatherResult.score * 0.15 +
      farmScaleResult.score * 0.10

    // Deduplicate and assemble prioritized reasons & warnings
    const reasons = [
      ...seasonResult.reasons,
      ...irrigationResult.reasons,
      ...soilResult.reasons,
      ...weatherResult.reasons,
      ...farmScaleResult.reasons,
    ]

    const warnings = [
      ...irrigationResult.warnings,
      ...soilResult.warnings,
      ...weatherResult.warnings,
      ...seasonResult.warnings,
    ]

    let suitability: RecommendationResult['suitability'] = 'poor'
    if (totalScore >= 0.78) suitability = 'excellent'
    else if (totalScore >= 0.62) suitability = 'good'
    else if (totalScore >= 0.45) suitability = 'moderate'

    results.push({
      crop,
      score: Math.round(totalScore * 100) / 100,
      soilScore: Math.round(soilResult.score * 100) / 100,
      weatherScore: Math.round(weatherResult.score * 100) / 100,
      seasonScore: Math.round(seasonResult.score * 100) / 100,
      irrigationScore: Math.round(irrigationResult.score * 100) / 100,
      farmScore: Math.round(farmScaleResult.score * 100) / 100,
      reasons,
      warnings,
      suitability,
    })
  }

  // If pool was too small due to strict season, fallback with warning
  if (results.length === 0) {
    for (const crop of pool) {
      const soilResult = scoreSoil(crop, soil)
      const weatherResult = scoreWeather(crop, weather)
      const irrigationResult = scoreIrrigation(crop, farm)
      results.push({
        crop,
        score: 0.50,
        soilScore: soilResult.score,
        weatherScore: weatherResult.score,
        seasonScore: 0.3,
        irrigationScore: irrigationResult.score,
        reasons: ['Alternate consideration for diversified rotation', ...soilResult.reasons],
        warnings: ['Notice: Check local micro-climate feasibility before planting out of main season.'],
        suitability: 'moderate',
      })
    }
  }

  return results
    .filter(r => r.score >= 0.40)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
}
