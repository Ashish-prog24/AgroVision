import React from "react";
import { Package, Calendar, DollarSign, Volume2, ShieldAlert, Sparkles, Check, ArrowLeft, CloudRain, MapPin, Droplets, Award, TrendingUp } from "lucide-react";
import { calculateFertilizerPrescription } from "../services/agronomyEngine";
import { CROPS_DATABASE } from "../data/cropsData";
import { convertLandArea } from "../services/areaConverter";
import { SpeechService } from "../services/speechService";
import SoilHealthSummary from "./SoilHealthSummary";
import HealthyFarmingTips from "./HealthyFarmingTips";

export default function FertilizerAdvisory({
  soilParams,
  selectedCropId,
  areaValue,
  areaUnitId,
  soilType,
  locationQuery,
  weatherData,
  language,
  onBackToFarmSetup,
  t,
}) {
  const crop = CROPS_DATABASE.find((c) => c.id === selectedCropId) || CROPS_DATABASE[0];
  const areaConversion = convertLandArea(areaValue, areaUnitId);
  const farmAreaAcre = areaConversion.acres;
  
  const prescription = calculateFertilizerPrescription(soilParams, crop, farmAreaAcre, soilType);

  const handleSpeakPrescription = () => {
    const text = `For ${areaValue} ${areaConversion.inputUnit.name} of ${crop.name} in ${weatherData?.name || locationQuery}, here is your customized advisory: Apply ${prescription.totalFarm.ureaBags} bags of Urea (${prescription.totalFarm.ureaKg} kg), ${prescription.totalFarm.dapBags} bags of DAP (${prescription.totalFarm.dapKg} kg), and ${prescription.totalFarm.mopBags} bags of MOP Potash (${prescription.totalFarm.mopKg} kg). Current weather alert: ${weatherData?.weatherAlert || "Normal weather for application"}.`;
    SpeechService.speak(text, language);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* 1. Top Result Banner */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
              <span className="badge badge-success">Step 3 of 3 • Advisory Generated</span>
              <span className="badge badge-info" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Award size={13} /> {prescription.stcrCompliance}
              </span>
            </div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--text-primary)" }}>
              🌾 Precision Fertilizer & Crop Advisory for {crop.name}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.3rem", fontSize: "0.85rem", color: "var(--text-dim)" }}>
              <span>📐 <strong>Area:</strong> {areaValue} {areaConversion.inputUnit.name} ({farmAreaAcre} ac / {areaConversion.hectares} ha / {areaConversion.sqFt.toLocaleString()} sq ft)</span>
              <span>📍 <strong>Location:</strong> {weatherData?.name || locationQuery}</span>
              <span>🌱 <strong>Soil:</strong> {soilType} (pH {soilParams.pH})</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button
              className="btn btn-secondary"
              onClick={handleSpeakPrescription}
              style={{ padding: "0.55rem 1rem" }}
            >
              <Volume2 size={16} color="var(--accent-emerald)" />
              <span>{t.voiceSpeakSummary || "Listen to Advisory"}</span>
            </button>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Total Fertilizer Cost
              </div>
              <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "#34d399", fontFamily: "var(--font-mono)" }}>
                ₹{prescription.totalFarm.estimatedFertilizerCost.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Live Weather Impact Banner */}
        {weatherData && (
          <div
            style={{
              marginTop: "1.25rem",
              padding: "0.85rem 1rem",
              background: "rgba(6, 182, 212, 0.1)",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              flexWrap: "wrap",
            }}
          >
            <CloudRain size={22} color="var(--accent-cyan)" />
            <div style={{ flex: 1, fontSize: "0.82rem" }}>
              <strong>Live Weather Impact ({weatherData.temp}°C • RH {weatherData.humidity}% • {weatherData.rainfallForecast}):</strong> {weatherData.weatherAlert}
            </div>
          </div>
        )}

        {/* Commercial Fertilizer Products Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
          {/* Urea Card */}
          <div className="fert-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "700", fontSize: "0.95rem" }}>{t.ureaReq || "Urea (46% N)"}</span>
              <span className="fert-bags-badge">{prescription.totalFarm.ureaBags} {t.bags || "Bags"}</span>
            </div>
            <div className="fert-amount-huge">{prescription.totalFarm.ureaKg} <span style={{ fontSize: "1rem" }}>kg</span></div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
              {prescription.perAcre.ureaKg} kg / acre • Standard 45kg bag
            </div>
          </div>

          {/* DAP Card */}
          <div className="fert-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "700", fontSize: "0.95rem" }}>{t.dapReq || "DAP (18-46-0)"}</span>
              <span className="fert-bags-badge">{prescription.totalFarm.dapBags} {t.bags || "Bags"}</span>
            </div>
            <div className="fert-amount-huge">{prescription.totalFarm.dapKg} <span style={{ fontSize: "1rem" }}>kg</span></div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
              {prescription.perAcre.dapKg} kg / acre • Root development
            </div>
          </div>

          {/* MOP Card */}
          <div className="fert-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "700", fontSize: "0.95rem" }}>{t.mopReq || "MOP Potash (60% K₂O)"}</span>
              <span className="fert-bags-badge">{prescription.totalFarm.mopBags} {t.bags || "Bags"}</span>
            </div>
            <div className="fert-amount-huge">{prescription.totalFarm.mopKg} <span style={{ fontSize: "1rem" }}>kg</span></div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
              {prescription.perAcre.mopKg} kg / acre • Pest resistance
            </div>
          </div>

          {/* Micronutrients / Zinc */}
          {prescription.totalFarm.zincKg > 0 && (
            <div className="fert-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "700", fontSize: "0.95rem" }}>{t.zincReq || "Zinc Sulphate 21%"}</span>
                <span className="badge badge-warning">Essential</span>
              </div>
              <div className="fert-amount-huge">{prescription.totalFarm.zincKg} <span style={{ fontSize: "1rem" }}>kg</span></div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                {prescription.perAcre.zincKg} kg / acre • Prevents chlorosis
              </div>
            </div>
          )}

          {/* Lime or Gypsum */}
          {prescription.totalFarm.limeKg > 0 && (
            <div className="fert-card" style={{ borderColor: "#f43f5e" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "700", fontSize: "0.95rem" }}>Agricultural Lime (CaCO₃)</span>
                <span className="badge badge-danger">Acid Neutralizer</span>
              </div>
              <div className="fert-amount-huge" style={{ color: "#fb7185" }}>
                {prescription.totalFarm.limeKg} <span style={{ fontSize: "1rem" }}>kg</span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                Neutralizes acidic pH {soilParams.pH}
              </div>
            </div>
          )}

          {prescription.totalFarm.gypsumKg > 0 && (
            <div className="fert-card" style={{ borderColor: "#f59e0b" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "700", fontSize: "0.95rem" }}>Agricultural Gypsum</span>
                <span className="badge badge-warning">Alkali Reclamation</span>
              </div>
              <div className="fert-amount-huge" style={{ color: "#fbbf24" }}>
                {prescription.totalFarm.gypsumKg} <span style={{ fontSize: "1rem" }}>kg</span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                Reclaims alkaline pH {soilParams.pH}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. 3-Stage Precision Application Schedule */}
      <div className="glass-panel" style={{ padding: "1.75rem" }}>
        <h3 style={{ fontSize: "1.15rem", fontWeight: "800", marginBottom: "0.5rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Calendar size={20} color="var(--accent-emerald)" />
          <span>{t.splitSchedule || "3-Stage Precision Application Timetable"}</span>
        </h3>
        <p style={{ fontSize: "0.82rem", color: "var(--text-dim)", marginBottom: "1.5rem" }}>
          Weather-synchronized application schedule for {crop.name} on {areaValue} {areaConversion.inputUnit.name}:
        </p>

        <div className="timeline-stepper">
          {prescription.splitSchedule.map((stage, idx) => (
            <div key={idx} className="timeline-step">
              <div className="step-marker">{idx + 1}</div>
              <div className="step-content">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-primary)" }}>{stage.stage}</h4>
                    <span style={{ fontSize: "0.78rem", color: "var(--accent-emerald)", fontWeight: "600" }}>{stage.timing}</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", margin: "0.75rem 0" }}>
                  {stage.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      style={{
                        padding: "0.45rem 0.85rem",
                        background: "rgba(16, 185, 129, 0.12)",
                        border: "1px solid rgba(16, 185, 129, 0.25)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.82rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <Check size={14} color="var(--accent-emerald)" />
                      <strong>{item.name}:</strong> <span>{item.amount}</span> ({item.pct})
                    </div>
                  ))}
                </div>

                <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontStyle: "italic", borderLeft: "2px solid var(--accent-emerald)", paddingLeft: "0.6rem" }}>
                  💡 {stage.instructions}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Soil Health Status & Regenerative Farming Advice */}
      <SoilHealthSummary soilParams={soilParams} t={t} />
      <HealthyFarmingTips soilParams={soilParams} farmAreaAcre={farmAreaAcre} t={t} />

      {/* Back Button */}
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <button
          className="btn btn-secondary"
          onClick={onBackToFarmSetup}
          style={{ padding: "0.75rem 1.5rem" }}
        >
          <ArrowLeft size={18} />
          <span>Change Crop, Area or Location</span>
        </button>
      </div>
    </div>
  );
}
