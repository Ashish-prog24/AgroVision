import { getSoilStatus, toAcres } from './units'

export interface FertilizerRule {
  id: string
  cropId: string
  nitrogenPerAcre: number
  phosphorusPerAcre: number
  potassiumPerAcre: number
  sulphurPerAcre: number
  applicationStage: string
  source: string
  version: string
  notes?: string | null
}

export interface SoilNutrients {
  nitrogen?: number
  phosphorus?: number
  potassium?: number
  sulphur?: number
}

export interface FertilizerProduct {
  name: string
  nutrient: string
  composition: number // % of primary nutrient
  unit: string
}

export const FERTILIZER_PRODUCTS: FertilizerProduct[] = [
  { name: 'Urea',          nutrient: 'N',  composition: 46, unit: 'kg' },
  { name: 'DAP',           nutrient: 'P',  composition: 46, unit: 'kg' },
  { name: 'MOP',           nutrient: 'K',  composition: 60, unit: 'kg' },
  { name: 'SSP',           nutrient: 'P',  composition: 16, unit: 'kg' },
  { name: 'Ammonium Sulphate', nutrient: 'S', composition: 24, unit: 'kg' },
  { name: 'FYM/Compost',   nutrient: 'organic', composition: 1, unit: 'tonnes' },
]

export interface FertilizerPlan {
  cropName: string
  areaAcres: number
  totalN: number
  totalP: number
  totalK: number
  totalS: number
  products: FertilizerApplication[]
  schedule: ApplicationSchedule[]
  source: string
  disclaimer: string
}

export interface FertilizerApplication {
  product: string
  quantityPerAcre: number
  totalQuantity: number
  unit: string
  nutrient: string
}

export interface ApplicationSchedule {
  stage: string
  timing: string
  applications: { product: string; qty: number; unit: string }[]
}

function adjustForSoilStatus(basePerAcre: number, soilStatus: 'low' | 'medium' | 'high'): number {
  if (soilStatus === 'high') return basePerAcre * 0.5
  if (soilStatus === 'low') return basePerAcre * 1.3
  return basePerAcre
}

export function calculateFertilizer(
  cropName: string,
  rules: FertilizerRule[],
  soil: SoilNutrients,
  area: number,
  areaUnit: string,
): FertilizerPlan {
  const acres = toAcres(area, areaUnit as 'acre' | 'hectare' | 'decimal' | 'sqm')

  // Sum up all rule stages
  let baseN = 0, baseP = 0, baseK = 0, baseS = 0
  let source = 'ICAR Package of Practices 2024'
  let stageMap: Record<string, { n: number; p: number; k: number }> = {}

  const activeRules = rules && rules.length > 0 ? rules : [
    {
      id: 'default',
      cropId: 'default',
      nitrogenPerAcre: 45,
      phosphorusPerAcre: 20,
      potassiumPerAcre: 20,
      sulphurPerAcre: 8,
      applicationStage: 'Basal + Top Dressing',
      source: 'ICAR Package of Practices',
      version: '2024',
    }
  ]

  for (const rule of activeRules) {
    baseN += rule.nitrogenPerAcre
    baseP += rule.phosphorusPerAcre
    baseK += rule.potassiumPerAcre
    baseS += rule.sulphurPerAcre || 0
    source = rule.source || source
    stageMap[rule.applicationStage] = {
      n: rule.nitrogenPerAcre,
      p: rule.phosphorusPerAcre,
      k: rule.potassiumPerAcre,
    }
  }

  // Adjust based on soil test
  const nStatus = soil.nitrogen ? getSoilStatus('nitrogen', soil.nitrogen) : 'medium'
  const pStatus = soil.phosphorus ? getSoilStatus('phosphorus', soil.phosphorus) : 'medium'
  const kStatus = soil.potassium ? getSoilStatus('potassium', soil.potassium) : 'medium'

  const adjN = adjustForSoilStatus(baseN, nStatus)
  const adjP = adjustForSoilStatus(baseP, pStatus)
  const adjK = adjustForSoilStatus(baseK, kStatus)
  const adjS = baseS

  // Convert nutrients to products (per acre then total)
  const ureaPerAcre = (adjN / 0.46)
  const dapPerAcre = (adjP / 0.46)
  const mopPerAcre = (adjK / 0.60)
  const sulphurPerAcre = (adjS / 0.24)

  const products: FertilizerApplication[] = [
    { product: 'Urea (46% N)', quantityPerAcre: Math.round(ureaPerAcre), totalQuantity: Math.round(ureaPerAcre * acres), unit: 'kg', nutrient: 'Nitrogen' },
    { product: 'DAP (46% P₂O₅)', quantityPerAcre: Math.round(dapPerAcre), totalQuantity: Math.round(dapPerAcre * acres), unit: 'kg', nutrient: 'Phosphorus' },
    { product: 'MOP (60% K₂O)', quantityPerAcre: Math.round(mopPerAcre), totalQuantity: Math.round(mopPerAcre * acres), unit: 'kg', nutrient: 'Potassium' },
  ]
  if (adjS > 0) {
    products.push({ product: 'Ammonium Sulphate', quantityPerAcre: Math.round(sulphurPerAcre), totalQuantity: Math.round(sulphurPerAcre * acres), unit: 'kg', nutrient: 'Sulphur' })
  }

  // Build application schedule
  const schedule: ApplicationSchedule[] = []

  // Basal (at sowing)
  const basalN = Math.round(ureaPerAcre * 0.33 * acres)
  const basalP = Math.round(dapPerAcre * acres)
  const basalK = Math.round(mopPerAcre * acres)
  schedule.push({
    stage: 'Basal Application',
    timing: 'At the time of sowing / transplanting',
    applications: [
      { product: 'DAP', qty: basalP, unit: 'kg' },
      { product: 'MOP', qty: basalK, unit: 'kg' },
      { product: 'Urea', qty: basalN, unit: 'kg' },
    ].filter(a => a.qty > 0),
  })

  // First top dressing
  const td1N = Math.round(ureaPerAcre * 0.33 * acres)
  schedule.push({
    stage: 'First Top Dressing',
    timing: '20–25 days after sowing',
    applications: [{ product: 'Urea', qty: td1N, unit: 'kg' }],
  })

  // Second top dressing
  const td2N = Math.round(ureaPerAcre * 0.34 * acres)
  schedule.push({
    stage: 'Second Top Dressing',
    timing: '40–45 days after sowing (at flowering initiation)',
    applications: [{ product: 'Urea', qty: td2N, unit: 'kg' }],
  })

  return {
    cropName,
    areaAcres: acres,
    totalN: Math.round(adjN * acres),
    totalP: Math.round(adjP * acres),
    totalK: Math.round(adjK * acres),
    totalS: Math.round(adjS * acres),
    products,
    schedule,
    source,
    disclaimer: 'These are approximate recommendations based on soil test values and configured agronomic guidelines. Verify with local agricultural extension officer before large-scale application.',
  }
}

export function calculateFertilizerPlan(
  cropName: string,
  area: number,
  areaUnit: string,
  soil: SoilNutrients = {},
  rule?: FertilizerRule | FertilizerRule[]
): FertilizerPlan {
  const rulesArray = rule ? (Array.isArray(rule) ? rule : [rule]) : []
  return calculateFertilizer(cropName, rulesArray, soil, area, areaUnit)
}
