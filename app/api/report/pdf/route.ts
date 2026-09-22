import { NextResponse } from 'next/server'
import { generateAdvisoryPDF, AdvisoryReportData } from '@/lib/pdf'

export async function POST(request: Request) {
  try {
    const data: AdvisoryReportData = await request.json()
    const doc = generateAdvisoryPDF(data)
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="AgroVision_Advisory_${(data.farmerName || 'Farmer').replace(/\s+/g, '_')}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error('PDF generation error:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate PDF' }, { status: 500 })
  }
}
