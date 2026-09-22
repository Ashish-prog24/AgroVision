import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { recommendCrops } from '@/lib/recommendation-engine'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { soil, weather, farm } = body

    const crops = await prisma.crop.findMany()
    const results = recommendCrops(crops, soil, weather, farm)

    return NextResponse.json({ recommendations: results })
  } catch (error) {
    console.error('Recommendation error:', error)
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 })
  }
}
