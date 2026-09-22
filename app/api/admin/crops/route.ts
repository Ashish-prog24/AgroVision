import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const crops = await prisma.crop.findMany({
      include: {
        fertilizerRules: true,
      },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json({ success: true, crops })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const crop = await prisma.crop.create({
      data: {
        name: body.name,
        nameHi: body.nameHi,
        nameOr: body.nameOr,
        scientificName: body.scientificName,
        category: body.category || 'cereals',
        season: body.season || 'kharif',
        regions: body.regions || 'all',
        phMin: Number(body.phMin || 6.0),
        phMax: Number(body.phMax || 7.5),
        tempMin: Number(body.tempMin || 20),
        tempMax: Number(body.tempMax || 35),
        rainfallMin: Number(body.rainfallMin || 500),
        rainfallMax: Number(body.rainfallMax || 1500),
        irrigationNeeded: Boolean(body.irrigationNeeded),
        duration: Number(body.duration || 120),
        waterRequirement: body.waterRequirement || 'medium',
        description: body.description,
      },
    })
    return NextResponse.json({ success: true, crop })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
