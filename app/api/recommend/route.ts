import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { recommendCrops, RecommendationResult, CropRecord } from '@/lib/recommendation-engine'

interface MLPrediction {
  crop: string
  name_en: string
  name_hi: string
  name_or: string
  probability: number
  confidence_pct: number
  suitability: string
  season: string
  water_requirement: string
  reasoning: string
}

interface MLResponse {
  success: boolean
  engine: string
  top_crop: string
  confidence: number
  accuracy: number
  predictions: MLPrediction[]
}

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { soil = {}, weather = {}, farm = {} } = body

    const dbCrops = await prisma.crop.findMany()

    // 1. Attempt to get predictions from Python Random Forest ML Service
    let mlData: MLResponse | null = null
    try {
      const mlPayload = {
        N: Number(soil.nitrogen ?? 80),
        P: Number(soil.phosphorus ?? 45),
        K: Number(soil.potassium ?? 40),
        temperature: Number(weather.temperature ?? 26.0),
        humidity: Number(weather.humidity ?? 70.0),
        ph: Number(soil.ph ?? 6.5),
        // Calculate estimated annual/seasonal rainfall from precipitation or default 160mm
        rainfall: Number((weather.precipitation ?? 4) * 25 + 60),
        top_k: 6,
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 sec timeout

      const mlRes = await fetch(`${ML_SERVICE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mlPayload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (mlRes.ok) {
        mlData = (await mlRes.json()) as MLResponse
      }
    } catch {
      // ML service is offline or timed out -> gracefully fall through to built-in engine
      mlData = null
    }

    // 2. If ML service succeeded, enhance & prioritize with Random Forest model
    if (mlData && mlData.predictions && mlData.predictions.length > 0) {
      const recommendations: RecommendationResult[] = []

      for (const pred of mlData.predictions) {
        // Try to match with existing database crop
        const matchedDbCrop = dbCrops.find(
          (c) =>
            c.name.toLowerCase().includes(pred.crop.toLowerCase()) ||
            pred.crop.toLowerCase().includes(c.name.toLowerCase()) ||
            c.id.toLowerCase().includes(pred.crop.toLowerCase())
        )

        const cropRecord: CropRecord = matchedDbCrop || {
          id: pred.crop,
          name: pred.name_en,
          nameHi: pred.name_hi,
          nameOr: pred.name_or,
          category: pred.season.toLowerCase().includes('kharif') ? 'cereals' : 'pulses',
          season: pred.season.toLowerCase().includes('kharif') ? 'kharif' : 'rabi',
          phMin: 5.5,
          phMax: 7.5,
          tempMin: 18,
          tempMax: 35,
          rainfallMin: 50,
          rainfallMax: 250,
          irrigationNeeded: pred.water_requirement.toLowerCase() !== 'low',
          waterRequirement: pred.water_requirement.toLowerCase(),
          scientificName: null,
          duration: 110,
          description: pred.reasoning,
          descriptionHi: pred.name_hi,
          descriptionOr: pred.name_or,
        }

        const score = Math.min(0.99, Math.max(0.4, pred.probability))

        let suitability: 'excellent' | 'good' | 'moderate' | 'poor' = 'moderate'
        if (score >= 0.7) suitability = 'excellent'
        else if (score >= 0.4) suitability = 'good'

        recommendations.push({
          crop: cropRecord,
          score: Math.round(score * 100) / 100,
          soilScore: Math.round(Math.min(1.0, score * 1.05) * 100) / 100,
          weatherScore: Math.round(score * 100) / 100,
          seasonScore: 0.9,
          irrigationScore: 0.9,
          reasons: [
            `Random Forest ML Model confidence: ${pred.confidence_pct}%`,
            pred.reasoning,
          ],
          warnings:
            pred.water_requirement === 'High' && farm.irrigationType === 'rainfed'
              ? ['High water requirement; ensure adequate monsoon moisture or supplementary irrigation.']
              : [],
          suitability,
        })
      }

      return NextResponse.json({
        success: true,
        recommendations,
        engine: 'Random Forest ML (ICAR Agronomic Dataset)',
        mlActive: true,
        accuracy: mlData.accuracy,
      })
    }

    // 3. Fallback to built-in agronomic heuristic recommendation engine
    const heuristicResults = recommendCrops(dbCrops, soil, weather, farm)
    return NextResponse.json({
      success: true,
      recommendations: heuristicResults,
      engine: 'Built-in Agronomic Expert Engine',
      mlActive: false,
    })
  } catch (error) {
    console.error('Recommendation API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}
