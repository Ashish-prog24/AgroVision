// Open-Meteo weather client — no API key required
export interface WeatherData {
  current: {
    temperature: number
    feelsLike: number
    humidity: number
    windSpeed: number
    weatherCode: number
    precipitation: number
    cloudCover: number
    condition: string
  }
  daily: DayForecast[]
}

export interface DayForecast {
  date: string
  tempMax: number
  tempMin: number
  precipitationSum: number
  precipitationProbability: number
  weatherCode: number
  condition: string
  windSpeedMax: number
}

const WMO_CODES: Record<number, string> = {
  0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy Fog', 51: 'Light Drizzle', 53: 'Moderate Drizzle',
  55: 'Dense Drizzle', 61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
  71: 'Slight Snow', 73: 'Moderate Snow', 75: 'Heavy Snow', 80: 'Slight Showers',
  81: 'Moderate Showers', 82: 'Violent Showers', 95: 'Thunderstorm',
  96: 'Thunderstorm with Hail', 99: 'Thunderstorm with Heavy Hail',
}

export function getWeatherCondition(code: number): string {
  return WMO_CODES[code] ?? 'Unknown'
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code,wind_speed_10m_max&timezone=Asia%2FKolkata&forecast_days=7`

  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('Weather API unavailable')

  const data = await res.json()
  const c = data.current

  const daily: DayForecast[] = (data.daily.time as string[]).map((date: string, i: number) => ({
    date,
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i],
    precipitationSum: data.daily.precipitation_sum[i],
    precipitationProbability: data.daily.precipitation_probability_max[i],
    weatherCode: data.daily.weather_code[i],
    condition: getWeatherCondition(data.daily.weather_code[i]),
    windSpeedMax: data.daily.wind_speed_10m_max[i],
  }))

  return {
    current: {
      temperature: c.temperature_2m,
      feelsLike: c.apparent_temperature,
      humidity: c.relative_humidity_2m,
      windSpeed: c.wind_speed_10m,
      weatherCode: c.weather_code,
      precipitation: c.precipitation,
      cloudCover: c.cloud_cover,
      condition: getWeatherCondition(c.weather_code),
    },
    daily,
  }
}

// Mock weather for demo / offline
export function getMockWeather(): WeatherData {
  const today = new Date()
  const formatDate = (offsetDays: number) => {
    const d = new Date(today)
    d.setDate(today.getDate() + offsetDays)
    return d.toISOString().split('T')[0]
  }

  return {
    current: {
      temperature: 29,
      feelsLike: 33,
      humidity: 72,
      windSpeed: 12,
      weatherCode: 63,
      precipitation: 2.4,
      cloudCover: 75,
      condition: 'Moderate Rain',
    },
    daily: [
      { date: formatDate(0), tempMax: 31, tempMin: 24, precipitationSum: 8, precipitationProbability: 80, weatherCode: 63, condition: 'Moderate Rain', windSpeedMax: 15 },
      { date: formatDate(1), tempMax: 33, tempMin: 25, precipitationSum: 2, precipitationProbability: 30, weatherCode: 2, condition: 'Partly Cloudy', windSpeedMax: 10 },
      { date: formatDate(2), tempMax: 30, tempMin: 23, precipitationSum: 12, precipitationProbability: 85, weatherCode: 65, condition: 'Heavy Rain', windSpeedMax: 22 },
      { date: formatDate(3), tempMax: 29, tempMin: 22, precipitationSum: 4, precipitationProbability: 55, weatherCode: 61, condition: 'Slight Rain', windSpeedMax: 12 },
      { date: formatDate(4), tempMax: 32, tempMin: 24, precipitationSum: 0, precipitationProbability: 15, weatherCode: 1, condition: 'Mainly Clear', windSpeedMax: 8 },
      { date: formatDate(5), tempMax: 34, tempMin: 26, precipitationSum: 0, precipitationProbability: 10, weatherCode: 0, condition: 'Clear Sky', windSpeedMax: 7 },
      { date: formatDate(6), tempMax: 31, tempMin: 25, precipitationSum: 6, precipitationProbability: 65, weatherCode: 80, condition: 'Slight Showers', windSpeedMax: 14 },
    ],
  }
}

export function generateWeatherAlerts(weather: WeatherData): string[] {
  const alerts: string[] = []
  const { current, daily } = weather
  const nextDay = daily[0]

  if (nextDay?.precipitationProbability > 70)
    alerts.push('🌧️ Heavy rainfall expected. Consider postponing fertilizer application.')
  if (current.temperature > 38)
    alerts.push('🌡️ Extreme heat alert. Ensure adequate irrigation for crops.')
  if (current.windSpeed > 30)
    alerts.push('💨 Strong winds forecast. Protect supported crops and young seedlings.')
  if (nextDay?.precipitationProbability < 10 && current.humidity < 40)
    alerts.push('☀️ Dry spell expected. Plan irrigation accordingly.')
  if (nextDay?.precipitationSum > 15)
    alerts.push('⚠️ Risk of waterlogging. Check drainage in low-lying fields.')

  return alerts
}
