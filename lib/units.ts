// Area unit conversions
export const AREA_UNITS = {
  acre: 'Acre',
  hectare: 'Hectare',
  decimal: 'Decimal',
  sqm: 'Square Meter',
} as const

export type AreaUnit = keyof typeof AREA_UNITS

export function toAcres(value: number, unit: AreaUnit): number {
  switch (unit) {
    case 'acre': return value
    case 'hectare': return value * 2.47105
    case 'decimal': return value / 100
    case 'sqm': return value / 4046.86
    default: return value
  }
}

export function toHectares(value: number, unit: AreaUnit): number {
  return toAcres(value, unit) / 2.47105
}

export function convertArea(value: number, from: AreaUnit, to: AreaUnit): number {
  const acres = toAcres(value, from)
  switch (to) {
    case 'acre': return acres
    case 'hectare': return acres / 2.47105
    case 'decimal': return acres * 100
    case 'sqm': return acres * 4046.86
    default: return acres
  }
}

// Soil status thresholds
export function getSoilStatus(param: string, value: number): 'low' | 'medium' | 'high' {
  const thresholds: Record<string, { low: number; high: number }> = {
    nitrogen:    { low: 150,  high: 300  },
    phosphorus:  { low: 10,   high: 25   },
    potassium:   { low: 120,  high: 280  },
    organicCarbon: { low: 0.5, high: 0.75 },
    zinc:        { low: 0.6,  high: 1.2  },
    iron:        { low: 4.5,  high: 9.0  },
    boron:       { low: 0.5,  high: 1.0  },
    sulphur:     { low: 10,   high: 20   },
    manganese:   { low: 2.0,  high: 5.0  },
    copper:      { low: 0.2,  high: 0.5  },
  }
  const t = thresholds[param]
  if (!t) return 'medium'
  if (value < t.low) return 'low'
  if (value > t.high) return 'high'
  return 'medium'
}

export function getPHStatus(ph: number): string {
  if (ph < 5.5) return 'Strongly Acidic'
  if (ph < 6.5) return 'Slightly Acidic'
  if (ph < 7.5) return 'Neutral'
  if (ph < 8.5) return 'Slightly Alkaline'
  return 'Strongly Alkaline'
}

export function getECStatus(ec: number): string {
  if (ec < 0.8) return 'Normal'
  if (ec < 2.0) return 'Slightly Elevated'
  if (ec < 4.0) return 'High'
  return 'Very High (Saline)'
}
