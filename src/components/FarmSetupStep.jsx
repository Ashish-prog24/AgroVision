import React, { useState, useEffect } from "react";
import { Sprout, MapPin, CloudRain, Thermometer, Droplets, Compass, ArrowRight, ArrowLeft, RefreshCw, Sparkles, TrendingUp, DollarSign } from "lucide-react";
import { CROPS_DATABASE } from "../data/cropsData";
import { AREA_UNITS, convertLandArea } from "../services/areaConverter";
import { fetchAgroWeather, detectPresentLocation } from "../services/weatherService";
import { fetchLiveMandiPrice } from "../services/mandiService";

export default function FarmSetupStep({
  selectedCropId,
  setSelectedCropId,
  areaValue,
  setAreaValue,
  areaUnitId,
  setAreaUnitId,
  locationQuery,
  setLocationQuery,
  weatherData,
  setWeatherData,
  onProceedToAdvisory,
  onBackToSoilUpload,
  t,
}) {
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);
  const [liveMandi, setLiveMandi] = useState(null);
  const areaConversion = convertLandArea(areaValue, areaUnitId);

  // Fetch weather and live mandi price on location/crop change
  useEffect(() => {
    handleLoadWeather(locationQuery);
    handleLoadMandiPrice(selectedCropId, locationQuery);
  }, [selectedCropId]);

  const handleLoadWeather = async (locName) => {
    setIsFetchingWeather(true);
    try {
      const data = await fetchAgroWeather(locName);
      setWeatherData(data);
      handleLoadMandiPrice(selectedCropId, locName);
    } catch (e) {
      console.warn("Weather load error:", e);
    } finally {
      setIsFetchingWeather(false);
    }
  };

  const handleLoadMandiPrice = async (cropId, locName) => {
    try {
      const mandiData = await fetchLiveMandiPrice(cropId, locName);
      setLiveMandi(mandiData);
    } catch (e) {
      console.warn("Mandi load error:", e);
    }
  };

  const handleDetectGpsLocation = async () => {
    setIsFetchingWeather(true);
    try {
      const res = await detectPresentLocation();
      if (res && res.weather) {
        setWeatherData(res.weather);
        setLocationQuery(res.locationName);
        handleLoadMandiPrice(selectedCropId, res.locationName);
      }
    } catch (e) {
      console.warn("GPS detection fallback:", e);
      handleLoadWeather("Bargarh, Odisha");
    } finally {
      setIsFetchingWeather(false);
    }
  };

  const selectedCrop = CROPS_DATABASE.find((c) => c.id === selectedCropId) || CROPS_DATABASE[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
          <span className="badge badge-success">Step 2 of 3</span>
          <span style={{ fontSize: "0.82rem", color: "var(--text-dim)" }}>
            Crop Selection • Multi-Unit Land Area Converter • Live Agrometeorological & Mandi Sync
          </span>
        </div>
        <h2 style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--text-primary)" }}>
          🌾 Farm Setup & Agricultural Environmental Conditions
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
          Specify what crop you want to cultivate, your exact land area in any unit, and your farm location to fetch weather-adjusted recommendations.
        </p>
      </div>

      <div className="grid-2col">
        {/* Left Column: Crop Choice & Land Area Measurement */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* 1. Crop Selection */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              1. What crop do you want to grow?
            </label>
            <p style={{ fontSize: "0.78rem", color: "var(--text-dim)", marginBottom: "0.85rem" }}>
              Choose your target crop or select one of the high-return suggestions below:
            </p>

            <select
              className="custom-select"
              style={{ width: "100%", padding: "0.75rem 1rem", fontSize: "0.95rem", marginBottom: "1rem" }}
              value={selectedCropId}
              onChange={(e) => {
                setSelectedCropId(e.target.value);
                handleLoadMandiPrice(e.target.value, locationQuery);
              }}
            >
              {CROPS_DATABASE.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.image} {c.name} — ({c.category} • {c.seasons.join("/")})
                </option>
              ))}
            </select>

            {/* Quick Crop Chips */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
              {CROPS_DATABASE.slice(0, 6).map((c) => {
                const isCur = selectedCropId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCropId(c.id);
                      handleLoadMandiPrice(c.id, locationQuery);
                    }}
                    style={{
                      padding: "0.6rem 0.5rem",
                      background: isCur ? "rgba(16, 185, 129, 0.2)" : "var(--bg-tertiary)",
                      border: `1px solid ${isCur ? "var(--accent-emerald)" : "var(--border-card)"}`,
                      borderRadius: "var(--radius-sm)",
                      color: isCur ? "#34d399" : "var(--text-primary)",
                      fontWeight: isCur ? "700" : "500",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.3rem",
                      transition: "all 0.2s",
                    }}
                  >
                    <span>{c.image}</span>
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Live Mandi Market Price Ticker */}
            {liveMandi && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem",
                  background: "rgba(245, 158, 11, 0.1)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.8rem",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", textTransform: "uppercase" }}>
                    🏛️ Live Mandi Modal Rate ({liveMandi.mandiName.split(",")[0]})
                  </div>
                  <strong style={{ fontSize: "0.95rem", color: "#fbbf24" }}>
                    ₹{liveMandi.modalPrice.toLocaleString()} / Quintal
                  </strong>
                </div>
                <span className="badge badge-warning">{liveMandi.trend}</span>
              </div>
            )}
          </div>

          {/* 2. Land Area Measurement with Multi-Unit Converter */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "0.3rem" }}>
              2. Total Farm Area Measurement
            </label>
            <p style={{ fontSize: "0.78rem", color: "var(--text-dim)", marginBottom: "0.85rem" }}>
              Enter your land area in <strong>Square Feet, Acres, or Hectares</strong>:
            </p>

            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
              <input
                type="number"
                min="0.1"
                step="any"
                value={areaValue}
                onChange={(e) => setAreaValue(Math.max(0.01, parseFloat(e.target.value) || 1))}
                style={{
                  flex: "1 1 120px",
                  padding: "0.75rem 1rem",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  fontFamily: "var(--font-mono)",
                  outline: "none",
                  minWidth: "120px",
                }}
              />

              <select
                className="custom-select"
                style={{ flex: "1 1 180px", padding: "0.75rem 1rem", fontSize: "0.85rem", minWidth: "160px" }}
                value={areaUnitId}
                onChange={(e) => setAreaUnitId(e.target.value)}
              >
                {AREA_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Live Multi-Unit Equivalent Banner */}
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1rem",
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Live Area Equivalent Breakdown
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "#34d399" }}>
                🌾 {areaConversion.acres} Acres = {areaConversion.hectares} Hectares = {areaConversion.sqFt.toLocaleString()} Sq. Ft.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Location & Live Weather Fetcher */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "0.3rem" }}>
              3. Farm Location & Live Agro-Weather
            </label>
            <p style={{ fontSize: "0.78rem", color: "var(--text-dim)", marginBottom: "0.85rem" }}>
              Enter district / city or auto-detect GPS to fetch real-time weather and agronomy alerts:
            </p>

            <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem" }}>
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="e.g. Barpali, Bargarh, Odisha or Ludhiana"
                style={{
                  flex: 1,
                  padding: "0.75rem 1rem",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleLoadWeather(locationQuery)}
                disabled={isFetchingWeather}
                title="Fetch Weather"
              >
                <RefreshCw size={16} className={isFetchingWeather ? "animate-spin" : ""} />
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleDetectGpsLocation}
                title="Auto-detect GPS"
              >
                <Compass size={16} color="var(--accent-cyan)" />
              </button>
            </div>

            {/* Quick Location Shortcuts */}
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
              {["Bargarh, Odisha", "Ludhiana, Punjab", "Nagpur, Maharashtra", "Guntur, Andhra", "Jaipur, Rajasthan"].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    setLocationQuery(loc);
                    handleLoadWeather(loc);
                  }}
                  style={{
                    padding: "0.3rem 0.6rem",
                    background: locationQuery.includes(loc.split(",")[0]) ? "rgba(6, 182, 212, 0.2)" : "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border-card)",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.72rem",
                    color: "var(--text-dim)",
                    cursor: "pointer",
                  }}
                >
                  📍 {loc}
                </button>
              ))}
            </div>

            {/* Weather Condition Card */}
            {weatherData && (
              <div
                style={{
                  padding: "1.25rem",
                  background: "linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(16, 185, 129, 0.08))",
                  border: "1px solid rgba(6, 182, 212, 0.3)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <MapPin size={16} color="var(--accent-cyan)" />
                    <strong style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>{weatherData.name}</strong>
                  </div>
                  <span className="badge badge-info">{weatherData.season} Season</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "0.85rem", textAlign: "center" }}>
                  <div style={{ padding: "0.5rem", background: "rgba(0,0,0,0.2)", borderRadius: "6px" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>Temperature</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#38bdf8" }}>{weatherData.temp}°C</div>
                  </div>
                  <div style={{ padding: "0.5rem", background: "rgba(0,0,0,0.2)", borderRadius: "6px" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>Humidity</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#34d399" }}>{weatherData.humidity}%</div>
                  </div>
                  <div style={{ padding: "0.5rem", background: "rgba(0,0,0,0.2)", borderRadius: "6px" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>Rainfall</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#fbbf24" }}>{weatherData.rainfallForecast.split(" ")[0]}</div>
                  </div>
                </div>

                {/* Weather Agronomy Alert */}
                <div style={{ fontSize: "0.78rem", color: "var(--text-primary)", background: "rgba(0,0,0,0.25)", padding: "0.6rem 0.8rem", borderRadius: "6px" }}>
                  🌦️ <strong>Weather Advisory:</strong> {weatherData.weatherAlert}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Step Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
        <button
          className="btn btn-secondary"
          onClick={onBackToSoilUpload}
          style={{ padding: "0.75rem 1.5rem" }}
        >
          <ArrowLeft size={18} />
          <span>Back to Soil Report</span>
        </button>

        <button
          className="btn btn-primary"
          onClick={onProceedToAdvisory}
          style={{ padding: "0.75rem 1.75rem", fontSize: "0.95rem" }}
        >
          <span>Calculate Precision Fertilizer Prescription</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
