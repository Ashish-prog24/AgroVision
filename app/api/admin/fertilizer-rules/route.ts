import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const rules = await prisma.fertilizerRule.findMany({
      include: {
        crop: {
          select: { name: true, category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ success: true, rules })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const rule = await prisma.fertilizerRule.create({
      data: {
        cropId: body.cropId,
        region: body.region || 'all',
        soilNStatus: body.soilNStatus || 'medium',
        soilPStatus: body.soilPStatus || 'medium',
        soilKStatus: body.soilKStatus || 'medium',
        targetYield: body.targetYield ? Number(body.targetYield) : null,
        nitrogenPerAcre: Number(body.nitrogenPerAcre),
        phosphorusPerAcre: Number(body.phosphorusPerAcre),
        potassiumPerAcre: Number(body.potassiumPerAcre),
        sulphurPerAcre: Number(body.sulphurPerAcre || 0),
        applicationStage: body.applicationStage || 'Basal + Top Dressing',
        source: body.source || 'ICAR Guidelines',
        version: body.version || '2024',
        notes: body.notes,
      },
    })
    return NextResponse.json({ success: true, rule })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
