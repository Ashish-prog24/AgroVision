import { NextResponse } from 'next/server'
import { fetchWeather, getMockWeather, generateWeatherAlerts } from '@/lib/weather'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') ?? '')
  const lng = parseFloat(searchParams.get('lng') ?? '')

  if (isNaN(lat) || isNaN(lng)) {
    const mock = getMockWeather()
    return NextResponse.json({
      success: true,
      data: mock,
      alerts: generateWeatherAlerts(mock),
      demo: true,
    })
  }

  try {
    const data = await fetchWeather(lat, lng)
    const alerts = generateWeatherAlerts(data)
    return NextResponse.json({
      success: true,
      data,
      alerts,
      demo: false,
    })
  } catch (error: any) {
    console.error('Weather API fetch error:', error?.message || error)
    const mock = getMockWeather()
    return NextResponse.json({
      success: true,
      data: mock,
      alerts: generateWeatherAlerts(mock),
      demo: true,
      error: error?.message,
    })
  }
}
