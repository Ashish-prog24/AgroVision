// AgroVision™ - Weather & Location Service for Real-Time Agro-Meteorological Advisory

export const KNOWN_AGRO_LOCATIONS = {
  "bargarh, odisha": {
    name: "Bargarh / Barpali, Odisha",
    state: "Odisha",
    lat: 21.33,
    lon: 83.62,
    temp: 29,
    humidity: 78,
    rainfallForecast: "Moderate Rain Expected (12 mm)",
    season: "Kharif",
    soilAffinity: "Red & Yellow Loam",
    weatherAlert: "High humidity (>75%) favors fungal blast in paddy. Ensure good field drainage.",
  },
  "bhubaneswar, odisha": {
    name: "Bhubaneswar / Khordha, Odisha",
    state: "Odisha",
    lat: 20.27,
    lon: 85.83,
    temp: 30,
    humidity: 82,
    rainfallForecast: "Scattered Coastal Showers",
    season: "Kharif",
    soilAffinity: "Coastal Alluvial & Red Loam",
    weatherAlert: "Coastal humidity high. Delay foliar nitrogen spraying until rainfall clears.",
  },
  "ludhiana, punjab": {
    name: "Ludhiana, Punjab",
    state: "Punjab",
    lat: 30.90,
    lon: 75.85,
    temp: 24,
    humidity: 58,
    rainfallForecast: "Clear Skies (0 mm)",
    season: "Rabi",
    soilAffinity: "Alluvial Loam",
    weatherAlert: "Optimal weather for sowing and basal fertilizer incorporation.",
  },
  "karnal, haryana": {
    name: "Karnal, Haryana",
    state: "Haryana",
    lat: 29.68,
    lon: 76.98,
    temp: 25,
    humidity: 55,
    rainfallForecast: "Dry & Clear (0 mm)",
    season: "Rabi",
    soilAffinity: "Indo-Gangetic Alluvium",
    weatherAlert: "Favorable conditions for wheat seedbed preparation and basal DAP.",
  },
  "nagpur, maharashtra": {
    name: "Nagpur, Vidarbha, Maharashtra",
    state: "Maharashtra",
    lat: 21.14,
    lon: 79.08,
    temp: 31,
    humidity: 62,
    rainfallForecast: "Scattered Showers (4 mm)",
    season: "Kharif",
    soilAffinity: "Black Vertisol",
    weatherAlert: "Warm conditions. Maintain cotton pest scouting for bollworm/whitefly.",
  },
  "pune, maharashtra": {
    name: "Pune / Western Ghats, Maharashtra",
    state: "Maharashtra",
    lat: 18.52,
    lon: 73.85,
    temp: 27,
    humidity: 65,
    rainfallForecast: "Partly Cloudy (1 mm)",
    season: "Kharif",
    soilAffinity: "Medium Black & Red Loam",
    weatherAlert: "Moderate humidity. Ideal for vegetable intercultural operations and fertigation.",
  },
  "guntur, andhra pradesh": {
    name: "Guntur, Andhra Pradesh",
    state: "Andhra Pradesh",
    lat: 16.30,
    lon: 80.43,
    temp: 32,
    humidity: 70,
    rainfallForecast: "Light Rain (2 mm)",
    season: "Kharif",
    soilAffinity: "Red Sandy Clay",
    weatherAlert: "Good soil moisture. Ideal for basal fertilizer application.",
  },
  "warangal, telangana": {
    name: "Warangal, Telangana",
    state: "Telangana",
    lat: 17.96,
    lon: 79.59,
    temp: 31,
    humidity: 68,
    rainfallForecast: "Scattered Clouds (0 mm)",
    season: "Kharif",
    soilAffinity: "Red Chalkas & Black Soils",
    weatherAlert: "Monitor soil moisture in cotton/chilli tracts before urea top-dressing.",
  },
  "jaipur, rajasthan": {
    name: "Jaipur / Bikaner, Rajasthan",
    state: "Rajasthan",
    lat: 26.91,
    lon: 75.78,
    temp: 33,
    humidity: 35,
    rainfallForecast: "Dry & Sunny (0 mm)",
    season: "Rabi",
    soilAffinity: "Sandy Arid",
    weatherAlert: "Low humidity. Water loss is rapid; consider drip irrigation and mulching.",
  },
  "rajkot, gujarat": {
    name: "Rajkot / Saurashtra, Gujarat",
    state: "Gujarat",
    lat: 22.30,
    lon: 70.80,
    temp: 32,
    humidity: 60,
    rainfallForecast: "Clear & Breezy",
    season: "Kharif",
    soilAffinity: "Medium Black Vertisol",
    weatherAlert: "Groundnut/cotton tract. Check for dry root rot and white grub activity.",
  },
  "varanasi, uttar pradesh": {
    name: "Varanasi / Purvanchal, Uttar Pradesh",
    state: "Uttar Pradesh",
    lat: 25.31,
    lon: 82.97,
    temp: 29,
    humidity: 72,
    rainfallForecast: "Light Showers (3 mm)",
    season: "Kharif",
    soilAffinity: "Gangetic Alluvium",
    weatherAlert: "High relative humidity. Avoid midday pesticide spraying; prefer early morning.",
  },
  "burdwan, west bengal": {
    name: "Burdwan, West Bengal",
    state: "West Bengal",
    lat: 23.23,
    lon: 87.86,
    temp: 30,
    humidity: 80,
    rainfallForecast: "Rain Showers (8 mm)",
    season: "Kharif",
    soilAffinity: "Deltaic Alluvium",
    weatherAlert: "High rainfall risk. Ensure paddy field bunds and drain surplus standing water.",
  },
  "mandya, karnataka": {
    name: "Mandya / Cauvery Basin, Karnataka",
    state: "Karnataka",
    lat: 12.52,
    lon: 76.89,
    temp: 28,
    humidity: 68,
    rainfallForecast: "Overcast with Mild Drizzle",
    season: "Kharif",
    soilAffinity: "Red Sandy Loam",
    weatherAlert: "Sugarcane and paddy tract. Good soil moisture for basal fertilizer incorporation.",
  },
  "thanjavur, tamil nadu": {
    name: "Thanjavur Delta, Tamil Nadu",
    state: "Tamil Nadu",
    lat: 10.78,
    lon: 79.13,
    temp: 31,
    humidity: 74,
    rainfallForecast: "Warm & Humid (0 mm)",
    season: "Kharif",
    soilAffinity: "Cauvery Alluvial Clay",
    weatherAlert: "Samba/Kuruvai paddy. Split nitrogen application advised to prevent volatilization.",
  },
  "indore, madhya pradesh": {
    name: "Indore / Malwa, Madhya Pradesh",
    state: "Madhya Pradesh",
    lat: 22.71,
    lon: 75.85,
    temp: 29,
    humidity: 64,
    rainfallForecast: "Clear Sky",
    season: "Kharif",
    soilAffinity: "Deep Black Cotton Soil",
    weatherAlert: "Soybean/wheat tract. Vertisol moisture retention is high; avoid over-irrigation.",
  },
};

/**
 * Reverse Geocode Coordinates using fast API with offline nearest-district fallback
 */
export async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { signal: AbortSignal.timeout(3500) }
    );
    if (res.ok) {
      const data = await res.json();
      const locality = data.locality || data.city || data.principalSubdivision;
      const state = data.principalSubdivision;
      if (locality && state && locality !== state) {
        return `${locality}, ${state}`;
      } else if (state) {
        return `${state}, ${data.countryName || "India"}`;
      }
    }
  } catch (e) {
    // network or timeout, continue to nearest agro-hub
  }

  // Nearest neighbor fallback
  return getNearestAgroHub(lat, lon);
}

/**
 * Find the closest known agricultural district by coordinates
 */
export function getNearestAgroHub(lat, lon) {
  let closest = null;
  let minDistance = Infinity;

  for (const loc of Object.values(KNOWN_AGRO_LOCATIONS)) {
    const dLat = loc.lat - lat;
    const dLon = loc.lon - lon;
    const distSq = dLat * dLat + dLon * dLon;
    if (distSq < minDistance) {
      minDistance = distSq;
      closest = loc;
    }
  }

  return closest ? closest.name : "Regional Agro-Zone";
}

/**
 * Determine soil affinity by state or coordinates
 */
export function inferSoilAffinity(locationName = "", lat = null, lon = null) {
  const loc = locationName.toLowerCase();
  if (loc.includes("odisha") || loc.includes("bhubaneswar") || loc.includes("bargarh") || loc.includes("cuttack")) {
    return "Red & Yellow Loam";
  }
  if (loc.includes("punjab") || loc.includes("haryana") || loc.includes("ludhiana") || loc.includes("karnal") || loc.includes("delhi")) {
    return "Alluvial Loam";
  }
  if (loc.includes("maharashtra") || loc.includes("nagpur") || loc.includes("vidarbha") || loc.includes("madhya pradesh") || loc.includes("indore") || loc.includes("gujarat")) {
    return "Black Vertisol";
  }
  if (loc.includes("rajasthan") || loc.includes("jaipur") || loc.includes("bikaner")) {
    return "Sandy Arid";
  }
  if (loc.includes("andhra") || loc.includes("telangana") || loc.includes("karnataka") || loc.includes("tamil nadu")) {
    return "Red Sandy Clay";
  }
  if (loc.includes("bengal") || loc.includes("bihar") || loc.includes("uttar pradesh")) {
    return "Gangetic Alluvial";
  }
  return "Alluvial Loam";
}

/**
 * Detect Current Season dynamically based on latitude and month
 */
export function calculateCurrentSeason(lat = 21.0) {
  const month = new Date().getMonth() + 1; // 1-12
  // Indian agricultural seasons:
  // Kharif: June to October (Monsoon crops like Paddy, Cotton, Soybean)
  // Rabi: November to March (Winter crops like Wheat, Mustard, Gram)
  // Zaid: April to May (Summer crops like Moong, Cucumber, Watermelon)
  if (month >= 6 && month <= 10) return "Kharif";
  if (month >= 11 || month <= 3) return "Rabi";
  return "Zaid";
}

/**
 * Fetch live weather from Open-Meteo API or fallback
 */
export async function fetchAgroWeather(locationQuery = "Ludhiana, Punjab", lat = null, lon = null) {
  let targetLat = lat;
  let targetLon = lon;
  let resolvedName = locationQuery;

  // 1. If lat/lon not provided, geocode locationQuery via Open-Meteo
  if ((targetLat == null || targetLon == null) && locationQuery) {
    // Check if query exactly matches known preset coordinates
    const q = locationQuery.toLowerCase().trim();
    for (const [key, loc] of Object.entries(KNOWN_AGRO_LOCATIONS)) {
      if (q === key || q === loc.name.toLowerCase()) {
        targetLat = loc.lat;
        targetLon = loc.lon;
        resolvedName = loc.name;
        break;
      }
    }

    if (targetLat == null) {
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationQuery)}&count=1&language=en&format=json`,
          { signal: AbortSignal.timeout(4000) }
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.results && geoData.results.length > 0) {
            targetLat = geoData.results[0].latitude;
            targetLon = geoData.results[0].longitude;
            const admin1 = geoData.results[0].admin1;
            resolvedName = admin1 ? `${geoData.results[0].name}, ${admin1}` : geoData.results[0].name;
          }
        }
      } catch (e) {
        // Geocode error
      }
    }
  }

  // Default coordinate fallback if all geocoding fails
  if (targetLat == null || targetLon == null) {
    targetLat = 21.33;
    targetLon = 83.62;
    resolvedName = "Bargarh / Barpali, Odisha";
  }

  // 2. Fetch Live Meteorological Forecast from Open-Meteo
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${targetLat}&longitude=${targetLon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&timezone=auto`,
      { signal: AbortSignal.timeout(5000) }
    );

    if (res.ok) {
      const data = await res.json();
      if (data.current) {
        const temp = Math.round(data.current.temperature_2m);
        const humidity = Math.round(data.current.relative_humidity_2m);
        const windSpeed = Math.round(data.current.wind_speed_10m || 0);
        const precip = data.current.precipitation || 0;
        const rainSum = data.daily?.precipitation_sum?.[0] || 0;
        const maxTemp = data.daily?.temperature_2m_max?.[0] ? Math.round(data.daily.temperature_2m_max[0]) : temp;
        const minTemp = data.daily?.temperature_2m_min?.[0] ? Math.round(data.daily.temperature_2m_min[0]) : temp;

        let weatherAlert = "Normal agricultural conditions. Field operations and fertilizer incorporation can proceed normally.";
        if (rainSum > 10 || precip > 2) {
          weatherAlert = `Rain expected (${rainSum || precip} mm). Postpone surface Urea broadcasting & foliar pesticide spraying to prevent runoff.`;
        } else if (temp > 35 || maxTemp > 38) {
          weatherAlert = `High temperature alert (${temp}°C). Ammonia volatilization from Urea increases; irrigate in late afternoon.`;
        } else if (humidity > 80) {
          weatherAlert = `High humidity alert (${humidity}%). Conditions favor foliar fungal blast and blight. Monitor crops closely.`;
        } else if (windSpeed > 20) {
          weatherAlert = `Breezy conditions (${windSpeed} km/h). Delay fine droplet foliar spraying to prevent drift.`;
        }

        const season = calculateCurrentSeason(targetLat);
        const soilAffinity = inferSoilAffinity(resolvedName, targetLat, targetLon);

        return {
          name: resolvedName,
          state: resolvedName.includes(",") ? resolvedName.split(",")[1].trim() : "Regional Agro-Zone",
          lat: targetLat,
          lon: targetLon,
          temp,
          humidity,
          windSpeed,
          maxTemp,
          minTemp,
          precipitation: precip,
          precipitationSum: rainSum,
          rainfallForecast: rainSum > 0 ? `Rain Expected (${rainSum} mm)` : "Clear / Dry Skies (0 mm)",
          season,
          soilAffinity,
          weatherAlert,
          isLiveApi: true,
        };
      }
    }
  } catch (err) {
    console.warn("Live weather fetch fallback:", err);
  }

  // Offline Fallback
  const fallback = KNOWN_AGRO_LOCATIONS["bargarh, odisha"];
  return {
    ...fallback,
    name: resolvedName || fallback.name,
    isLiveApi: false,
  };
}

/**
 * Automatically detect user's present location via Browser GPS or IP fallback
 */
export async function detectPresentLocation() {
  // 1. Try Native Geolocation API (High accuracy GPS)
  if (typeof navigator !== "undefined" && navigator.geolocation) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 6000,
          maximumAge: 120000,
          enableHighAccuracy: true,
        });
      });

      const { latitude, longitude } = position.coords;
      const locationName = await reverseGeocode(latitude, longitude);
      const weather = await fetchAgroWeather(locationName, latitude, longitude);

      return {
        success: true,
        method: "GPS",
        latitude,
        longitude,
        locationName,
        weather,
      };
    } catch (gpsError) {
      console.info("GPS detection skipped or denied, attempting IP location...", gpsError.message || gpsError);
    }
  }

  // 2. IP Location Fallback
  try {
    const ipRes = await fetch("https://freeipapi.com/api/json", { signal: AbortSignal.timeout(3500) });
    if (ipRes.ok) {
      const ipData = await ipRes.json();
      if (ipData && ipData.latitude && ipData.longitude) {
        const cityName = ipData.cityName || ipData.regionName || "Your Region";
        const regionName = ipData.regionName || ipData.countryName || "";
        const locationName = regionName ? `${cityName}, ${regionName}` : cityName;
        const weather = await fetchAgroWeather(locationName, ipData.latitude, ipData.longitude);

        return {
          success: true,
          method: "IP",
          latitude: ipData.latitude,
          longitude: ipData.longitude,
          locationName,
          weather,
        };
      }
    }
  } catch (ipErr) {
    console.info("IP fallback unavailable, using regional agro center.");
  }

  // 3. Graceful Default Preset (Hirakud / Bargarh Agro Basin)
  const defaultPreset = KNOWN_AGRO_LOCATIONS["bargarh, odisha"];
  return {
    success: false,
    method: "DEFAULT",
    latitude: defaultPreset.lat,
    longitude: defaultPreset.lon,
    locationName: defaultPreset.name,
    weather: defaultPreset,
  };
}

/**
 * Generate Location, Weather & Soil Synergy Insights
 * Directly compares soil parameters with live weather conditions at present location
 */
export function generateSoilWeatherSynergy(soilParams = {}, weatherData = {}, soilType = "Alluvial Loam") {
  if (!weatherData) return null;

  const insights = [];
  const pH = soilParams.pH || 7.0;
  const N = soilParams.N || 90;
  const P = soilParams.P || 12;
  const OC = soilParams.OC || 0.5;
  const temp = weatherData.temp || 28;
  const humidity = weatherData.humidity || 65;
  const rainSum = weatherData.precipitationSum || 0;

  // 1. pH & Rainfall leaching synergy
  if (pH < 6.0) {
    if (rainSum > 5 || humidity > 75) {
      insights.push({
        type: "warning",
        title: "Acidic Soil + High Moisture Leaching Warning",
        text: `Your soil is acidic (pH ${pH}) in a humid/rainfall-prone zone (${weatherData.name}). Excessive moisture leaches calcium and locks phosphorus into insoluble iron/aluminum compounds. Apply 250-300 kg/acre Agricultural Lime 15 days before sowing.`,
      });
    } else {
      insights.push({
        type: "info",
        title: "Acidic Soil Management",
        text: `Soil pH (${pH}) limits phosphorus bio-availability. Pair DAP with Phosphate Solubilizing Bio-fertilizer (PSB) to unlock fixed P.`,
      });
    }
  } else if (pH > 8.0) {
    insights.push({
      type: "warning",
      title: "Alkaline Soil + Evaporation Stress",
      text: `Alkaline soil (pH ${pH}) at local temperature (${temp}°C) causes micro-nutrient lockout (Zinc and Iron). Incorporate Gypsum (CaSO4) and spray chelated Zinc (Zn-EDTA 12%) as foliar nourishment.`,
    });
  }

  // 2. Nitrogen Volatilization vs Rainfall Runoff
  if (rainSum > 8) {
    insights.push({
      type: "alert",
      title: "Immediate Rainfall Forecasted: Hold Urea Broadcasting",
      text: `Forecast shows ${rainSum} mm rainfall at your present location. Do NOT broadcast surface Urea or spray pesticides right now; wait for dry foliage to prevent nutrient runoff and financial loss.`,
    });
  } else if (temp > 33) {
    insights.push({
      type: "caution",
      title: "High Heat Nitrogen Volatilization Risk",
      text: `Current local temperature (${temp}°C) accelerates ammonia gas volatilization from Urea by up to 35%. Apply Urea only in the evening and irrigate lightly within 24 hours.`,
    });
  } else {
    insights.push({
      type: "success",
      title: "Optimal Climate for Nutrient Uptake",
      text: `Ambient temperature (${temp}°C) and relative humidity (${humidity}%) at ${weatherData.name} are ideal for basal fertilizer absorption and active root respiration.`,
    });
  }

  // 3. Fungal Blast / Pest Humidity Alert
  if (humidity >= 78) {
    insights.push({
      type: "danger",
      title: "Fungal Disease Warning (High Relative Humidity)",
      text: `RH is currently ${humidity}%. Humid canopies promote foliar fungal blast (Paddy), downy mildew, and leaf spots. If applying high Nitrogen (${N} kg/acre), monitor closely and prepare prophylactic bio-fungicide (Trichoderma viride).`,
    });
  }

  // 4. Organic Carbon & Biological Activity
  if (OC < 0.5) {
    insights.push({
      type: "info",
      title: "Organic Carbon Deficit for Local Climate",
      text: `Organic Carbon is low (${OC}%). Adding 2 tonnes/acre Farmyard Manure (FYM) will significantly improve water-holding capacity under current ${weatherData.season || "crop"} conditions.`,
    });
  }

  return {
    location: weatherData.name,
    temp,
    humidity,
    season: weatherData.season,
    soilAffinity: weatherData.soilAffinity || soilType,
    weatherAlert: weatherData.weatherAlert,
    rainfallForecast: weatherData.rainfallForecast,
    insights,
  };
}
