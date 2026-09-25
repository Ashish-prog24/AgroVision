import { NextResponse } from 'next/server'
import { extractSoilReport } from '@/lib/ocr'

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''

    let base64Data = ''
    let mimeType = 'image/jpeg'
    let fileName = ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }

      mimeType = file.type || 'image/jpeg'
      fileName = file.name || ''
      const bytes = await file.arrayBuffer()
      base64Data = Buffer.from(bytes).toString('base64')
    } else {
      const body = await request.json().catch(() => ({}))
      base64Data = body.base64 || body.image || ''
      mimeType = body.mimeType || 'image/jpeg'
      fileName = body.fileName || ''
    }

    if (!base64Data) {
      return NextResponse.json({ error: 'Empty file payload' }, { status: 400 })
    }

    const extracted = await extractSoilReport(base64Data, mimeType, fileName)
    return NextResponse.json({ success: true, data: extracted })
  } catch (error: any) {
    console.error('Soil extraction error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to extract soil data from report',
      },
      { status: 500 }
    )
  }
}
