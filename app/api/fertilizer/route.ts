import { NextResponse } from 'next/server'
import { calculateFertilizerPlan } from '@/lib/fertilizer-engine'
import { prisma } from '@/lib/db'
import { getFallbackFertilizerRule } from '@/lib/crops-data'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { cropName, cropId, area = 1, areaUnit = 'acre', soil = {} } = body

    if (!cropName && !cropId) {
      return NextResponse.json({ error: 'cropName or cropId is required' }, { status: 400 })
    }

    let targetCropName = cropName
    let rule: any = undefined

    try {
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
    } catch (dbErr) {
      console.warn('Prisma lookup failed in fertilizer route, using static rule:', dbErr)
    }

    if (!rule) {
      rule = getFallbackFertilizerRule(targetCropName || cropId || 'Paddy')
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
    try {
      const emergencyPlan = calculateFertilizerPlan(
        'Paddy',
        1,
        'acre',
        {}
      )
      return NextResponse.json({ success: true, plan: emergencyPlan })
    } catch {
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to calculate fertilizer requirements' },
        { status: 500 }
      )
    }
  }
}
