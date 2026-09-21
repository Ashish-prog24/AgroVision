import React, { useState, useEffect } from "react";
import { TrendingUp, Clock, Droplets, Award, CheckCircle2, ChevronRight, Sparkles, AlertCircle, MapPin } from "lucide-react";
import confetti from "canvas-confetti";
import { recommendCrops } from "../services/cropRecommender";

export default function CropRecommender({
  soilParams,
  soilType,
  farmAreaAcre,
  onSelectTargetCrop,
  selectedCropId,
  weatherData,
  locationQuery,
  t,
}) {
  const [selectedSeason, setSelectedSeason] = useState(weatherData?.season || "Rabi");
  const [waterAvailability, setWaterAvailability] = useState("Moderate");

  // Sync with live season from detected location
  useEffect(() => {
    if (weatherData?.season && weatherData.season !== selectedSeason) {
      setSelectedSeason(weatherData.season);
    }
  }, [weatherData?.season]);

  // Get ranked crops based on soil, season, weather, and market conditions
  const rankedCrops = recommendCrops(soilParams, {
    season: selectedSeason,
    soilType,
    waterAvailability,
    farmAreaAcre,
  });

  const handleCropClick = (crop) => {
    onSelectTargetCrop(crop.id);
    // Fire confetti for crops with > 85% suitability
    if (crop.suitabilityScore >= 85) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header & Filter Controls */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
              <span className="badge badge-success">AI Agronomy Engine</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
                Soil: {soilType} • pH {soilParams.pH} • EC {soilParams.EC} dS/m
              </span>
            </div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--text-primary)" }}>
              {t.cropRecommenderTitle || "Smart Crop Suitability & Profitability Matrix"}
            </h2>
          </div>

          {/* Season & Water Filter */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-dim)", fontWeight: "600", marginBottom: "0.2rem" }}>
                Current Season
              </label>
              <select
                className="custom-select"
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
              >
                <option value="Rabi">Rabi (Winter - Oct to Apr)</option>
                <option value="Kharif">Kharif (Monsoon - Jun to Nov)</option>
                <option value="Zaid">Zaid (Summer - Mar to Jun)</option>
                <option value="All">All Seasons</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-dim)", fontWeight: "600", marginBottom: "0.2rem" }}>
                Water Availability
              </label>
              <select
                className="custom-select"
                value={waterAvailability}
                onChange={(e) => setWaterAvailability(e.target.value)}
              >
                <option value="High">Abundant (Canal / Tube Well)</option>
                <option value="Moderate">Moderate (3-4 Irrigations)</option>
                <option value="Low">Low / Rainfed Dryland</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Location & Season Synergy Strip */}
        {weatherData && (
          <div
            style={{
              marginTop: "1.25rem",
              padding: "0.75rem 1rem",
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.5rem",
              fontSize: "0.82rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <MapPin size={16} color="var(--accent-emerald)" />
              <span>
                <strong>Tailored for Present Location:</strong> {weatherData.name} • <strong>Live Ambient:</strong> {weatherData.temp}°C, {weatherData.humidity}% RH • <strong>Current Season:</strong> {weatherData.season}
              </span>
            </div>
            <span className="badge badge-success" style={{ fontSize: "0.72rem" }}>
              Dynamic Soil & Climate Alignment Active
            </span>
          </div>
        )}
      </div>

      {/* Ranked Crop Cards Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {rankedCrops.map((crop, index) => {
          const isSelected = selectedCropId === crop.id;
          const isTopRecommended = index === 0;

          return (
            <div
              key={crop.id}
              className={`glass-panel glass-card-interactive ${isSelected ? "active" : ""}`}
              onClick={() => handleCropClick(crop)}
              style={{
                padding: "1.5rem",
                borderLeft: `5px solid ${crop.suitabilityScore >= 85 ? "#10b981" : crop.suitabilityScore >= 70 ? "#f59e0b" : "#64748b"}`,
                background: isSelected ? "rgba(16, 185, 129, 0.14)" : undefined,
              }}
            >
              {/* Top Row: Crop Name, Badges, Suitability */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <span style={{ fontSize: "2.2rem" }}>{crop.image}</span>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-primary)" }}>
                        {crop.name}
                      </h3>
                      {isTopRecommended && (
                        <span className="badge badge-success" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <Sparkles size={12} /> #1 Top Pick
                        </span>
                      )}
                      {isSelected && (
                        <span className="badge badge-info">Active Advisory Crop</span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
                      Category: <strong>{crop.category}</strong> • Seasons: {crop.seasons.join(", ")}
                    </div>
                  </div>
                </div>

                {/* Suitability Score Badge */}
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", textTransform: "uppercase" }}>
                    {t.suitabilityScore || "Agronomic Match"}
                  </div>
                  <div
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: "800",
                      color: crop.suitabilityScore >= 85 ? "#34d399" : crop.suitabilityScore >= 70 ? "#fbbf24" : "#94a3b8",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {crop.suitabilityScore}%
                  </div>
                </div>
              </div>

              {/* Middle Row: Duration & Financial Return Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "0.85rem",
                  margin: "1.25rem 0",
                  padding: "1rem",
                  background: "var(--bg-tertiary)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-card)",
                }}
              >
                {/* Duration */}
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Clock size={14} color="var(--accent-cyan)" /> {t.duration || "Growth Duration"}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-primary)", marginTop: "0.2rem" }}>
                    {crop.durationDays.avg} Days ({crop.durationDays.min}-{crop.durationDays.max} d)
                  </div>
                </div>

                {/* Expected Yield */}
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                    {t.expectedYield || "Expected Yield"}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-primary)", marginTop: "0.2rem" }}>
                    {crop.financials.avgYield} {crop.financials.unit}
                  </div>
                </div>

                {/* Mandi Price */}
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                    {t.mandiPrice || "Market / MSP Price"}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: "700", color: "var(--accent-amber-light)", marginTop: "0.2rem" }}>
                    ₹{crop.financials.marketPrice.toLocaleString()} / Qtl
                  </div>
                </div>

                {/* Net Profit per Acre */}
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <TrendingUp size={14} color="var(--accent-emerald)" /> {t.netProfit || "Net Profit / Acre"}
                  </div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#34d399", fontFamily: "var(--font-mono)", marginTop: "0.1rem" }}>
                    ₹{crop.financials.netProfitPerAcre.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--accent-emerald-light)" }}>
                    Total ({farmAreaAcre} ac): ₹{crop.financials.totalNetProfit.toLocaleString()} ({crop.financials.roiPercentage}% ROI)
                  </div>
                </div>
              </div>

              {/* Lifecycle Stage Progress Track */}
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--text-dim)", marginBottom: "0.4rem" }}>
                  Lifecycle Milestone Stages ({crop.durationDays.avg} Days to Harvest)
                </div>
                <div style={{ display: "flex", gap: "0.35rem" }}>
                  {crop.lifecycleStages.map((stage, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        flex: 1,
                        padding: "0.4rem 0.5rem",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid var(--border-card)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.7rem",
                      }}
                      title={`${stage.name} (${stage.days}): ${stage.desc}`}
                    >
                      <strong style={{ display: "block", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {stage.name}
                      </strong>
                      <span style={{ color: "var(--accent-emerald-light)", fontSize: "0.68rem" }}>{stage.days}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom: Recommended Varieties & Tips */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", fontSize: "0.8rem" }}>
                <div style={{ color: "var(--text-dim)" }}>
                  🌾 <strong>Top Varieties:</strong> {crop.varieties.join(", ")}
                </div>
                <div style={{ color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Droplets size={14} color="var(--accent-cyan)" /> Water: {crop.waterRequirement}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
