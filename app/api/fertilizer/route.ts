import { NextResponse } from 'next/server'
import { calculateFertilizerPlan } from '@/lib/fertilizer-engine'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cropName, cropId, area = 1, areaUnit = 'acre', soil = {} } = body

    if (!cropName && !cropId) {
      return NextResponse.json({ error: 'cropName or cropId is required' }, { status: 400 })
    }

    let targetCropName = cropName
    let rule = undefined

    if (cropId) {
      const crop = await prisma.crop.findUnique({
        where: { id: cropId },
        include: { fertilizerRules: true },
      })
      if (crop) {
        targetCropName = crop.name
        if (crop.fertilizerRules && crop.fertilizerRules.length > 0) {
          rule = crop.fertilizerRules[0]
        }
      }
    }

    const plan = calculateFertilizerPlan(
      targetCropName || 'Paddy',
      Number(area),
      areaUnit,
      soil,
      rule
    )

    return NextResponse.json({ success: true, plan })
  } catch (error: any) {
    console.error('Fertilizer calculation error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to calculate fertilizer requirements' },
      { status: 500 }
    )
  }
}
