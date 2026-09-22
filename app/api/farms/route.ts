import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const whereClause = userId ? { userId } : {}
    const farms = await prisma.farm.findMany({
      where: whereClause,
      include: {
        soilReports: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        recommendations: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, farms })
  } catch (error: any) {
    console.error('Farms GET error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      userId,
      name = 'My Farm',
      latitude,
      longitude,
      village,
      district,
      state,
      area = 1,
      areaUnit = 'acre',
      irrigationType = 'borewell',
      soilData,
    } = body

    // Find or create default demo user if not logged in
    let ownerId = userId
    if (!ownerId) {
      let demoUser = await prisma.user.findFirst({ where: { email: 'ramesh@example.com' } })
      if (!demoUser) {
        demoUser = await prisma.user.create({
          data: {
            name: 'Ramesh Kumar',
            email: 'ramesh@example.com',
            phone: '9876543210',
            village: village || 'Satyabhamapur',
            district: district || 'Puri',
            state: state || 'Odisha',
          },
        })
      }
      ownerId = demoUser.id
    }

    const farm = await prisma.farm.create({
      data: {
        userId: ownerId,
        name,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        village,
        district,
        state,
        area: Number(area),
        areaUnit,
        irrigationType,
      },
    })

    let soilReport = null
    if (soilData) {
      soilReport = await prisma.soilReport.create({
        data: {
          farmId: farm.id,
          ph: soilData.ph ? Number(soilData.ph) : null,
          ec: soilData.ec ? Number(soilData.ec) : null,
          organicCarbon: soilData.organicCarbon ? Number(soilData.organicCarbon) : null,
          nitrogen: soilData.nitrogen ? Number(soilData.nitrogen) : null,
          phosphorus: soilData.phosphorus ? Number(soilData.phosphorus) : null,
          potassium: soilData.potassium ? Number(soilData.potassium) : null,
          sulphur: soilData.sulphur ? Number(soilData.sulphur) : null,
          zinc: soilData.zinc ? Number(soilData.zinc) : null,
          iron: soilData.iron ? Number(soilData.iron) : null,
          boron: soilData.boron ? Number(soilData.boron) : null,
          rawExtractedData: JSON.stringify(soilData),
        },
      })
    }

    return NextResponse.json({ success: true, farm, soilReport })
  } catch (error: any) {
    console.error('Farms POST error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
