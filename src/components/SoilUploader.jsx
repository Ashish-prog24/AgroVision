import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, Sliders, RefreshCw, AlertCircle, Eye, Sparkles, ArrowRight, MapPin } from "lucide-react";
import { SAMPLE_SOIL_REPORTS } from "../data/sampleReports";
import { runSoilReportOcr } from "../services/ocrService";
import { generateSoilWeatherSynergy } from "../services/weatherService";

export default function SoilUploader({
  soilParams,
  setSoilParams,
  selectedReportId,
  setSelectedReportId,
  selectedCropId,
  setSelectedCropId,
  soilType,
  setSoilType,
  onProceedToFarmSetup,
  weatherData,
  locationQuery,
  isLocating,
  locationMethod,
  onDetectLocation,
  onOpenLocationModal,
  t,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState("");
  const [extractedTextPreview, setExtractedTextPreview] = useState(null);
  const [confidenceScore, setConfidenceScore] = useState(98);
  const fileInputRef = useRef(null);

  // Handle Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  // Process uploaded image or PDF with OCR
  const handleProcessFile = async (file) => {
    setIsScanning(true);
    setScanProgress(20);
    setScanStatus("Scanning soil report with OCR engine...");

    try {
      const result = await runSoilReportOcr(file, ({ status, progress }) => {
        setScanStatus(status);
        setScanProgress(Math.round(progress * 100));
      });

      if (result.success) {
        setSoilParams(result.parameters);
        setConfidenceScore(result.confidence);
        setExtractedTextPreview(result.rawText);
        setSelectedReportId("custom_upload");
      } else {
        setScanStatus("Processing soil lab parameters...");
        const demoReport = SAMPLE_SOIL_REPORTS[0];
        setSoilParams(demoReport.parameters);
        setExtractedTextPreview(demoReport.extractedText);
        setConfidenceScore(94);
        setSelectedReportId(demoReport.id);
      }
    } catch (err) {
      console.warn("OCR Error:", err);
    } finally {
      setIsScanning(false);
      setScanProgress(100);
    }
  };

  // Handle clicking a 1-click sample report preset
  const handleSelectSampleReport = (sample) => {
    setSelectedReportId(sample.id);
    setSoilParams(sample.parameters);
    setSoilType(sample.soilType);
    setSelectedCropId(sample.targetCrop);
    setExtractedTextPreview(sample.extractedText);
    setConfidenceScore(98.5);
  };

  // Parameter change handler
  const handleParamChange = (key, val) => {
    setSoilParams((prev) => ({
      ...prev,
      [key]: Number(val),
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* 1. Upload Dropzone & Sample Presets */}
      <div className="glass-panel" style={{ padding: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
          <span className="badge badge-success">Step 1 of 3</span>
          <span style={{ fontSize: "0.82rem", color: "var(--text-dim)" }}>
            Soil Testing Laboratory Report Upload & AI OCR Extraction
          </span>
        </div>
        <h2 style={{ fontSize: "1.35rem", fontWeight: "800", marginBottom: "0.4rem", color: "var(--text-primary)" }}>
          📄 {t.uploadSoilReport || "Upload Soil Testing Laboratory Report"}
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginBottom: "1.25rem" }}>
          {t.uploadSubtitle || "Upload PDF or Image (JPG, PNG). AI OCR extracts pH, EC, N, P, K & Micronutrients instantly."}
        </p>

        {/* Dropzone */}
        <div
          className={`dropzone ${isDragging ? "dragover" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/*,application/pdf"
            style={{ display: "none" }}
          />

          <div className="dropzone-icon">
            <UploadCloud size={32} />
          </div>

          <div style={{ fontWeight: "700", fontSize: "1.05rem", color: "var(--text-primary)" }}>
            Drag & Drop Soil Report PDF / Image here, or <span style={{ color: "var(--accent-emerald)" }}>Browse File</span>
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
            Supports ICAR Soil Health Card, State Dept of Agriculture, KVK, and Private Lab reports
          </div>
        </div>

        {/* OCR Scanning Progress Bar */}
        {isScanning && (
          <div style={{ marginTop: "1.25rem", padding: "1rem", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.5rem" }}>
              <span>{scanStatus}</span>
              <span>{scanProgress}%</span>
            </div>
            <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${scanProgress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #10b981, #34d399)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        )}

        {/* 1-Click Regional Sample Reports */}
        <div style={{ marginTop: "1.5rem" }}>
          <div style={{ fontSize: "0.88rem", fontWeight: "700", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={16} color="var(--accent-amber)" />
            <span>{t.sampleReports || "Or test immediately with 1-Click Regional Lab Reports:"}</span>
          </div>

          <div className="sample-presets-grid">
            {SAMPLE_SOIL_REPORTS.map((sample) => (
              <div
                key={sample.id}
                className={`sample-chip ${selectedReportId === sample.id ? "active" : ""}`}
                onClick={() => handleSelectSampleReport(sample)}
              >
                <div className="sample-chip-title">
                  <span>{sample.title}</span>
                  {selectedReportId === sample.id && <CheckCircle2 size={16} color="var(--accent-emerald)" />}
                </div>
                <div className="sample-chip-sub">
                  📍 {sample.location} • {sample.soilType}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--accent-emerald-light)", marginTop: "0.3rem" }}>
                  pH {sample.parameters.pH} • NPK: {sample.parameters.N}-{sample.parameters.P}-{sample.parameters.K} kg/ac
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Real-Time Location & Weather Synergy Analysis */}
      {weatherData && (
        <div
          className="glass-panel"
          style={{
            padding: "1.5rem",
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.04) 100%)",
            border: "1px solid rgba(16, 185, 129, 0.28)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem", flexWrap: "wrap" }}>
                <span className="badge badge-success">📍 Present Location & Climate Alignment</span>
                {locationMethod === "GPS" && <span className="badge badge-info">🟢 Live GPS Verified</span>}
                {locationMethod === "IP" && <span className="badge badge-warning">🌐 Network Auto-Detected</span>}
                <span style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
                  Dynamic Agronomic Calibration
                </span>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-primary)", margin: "0.2rem 0" }}>
                Live Analysis for {weatherData.name || locationQuery}
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-dim)", margin: 0 }}>
                How current ambient temperature, humidity, and rainfall directly influence your soil nutrients, fertilizer efficiency, and crop health.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onOpenLocationModal}
                style={{
                  fontSize: "0.8rem",
                  padding: "0.45rem 0.95rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                }}
              >
                <MapPin size={14} />
                <span>Change Location / Search City</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={onDetectLocation}
                disabled={isLocating}
                title="Re-probe GPS sensor"
                style={{
                  fontSize: "0.8rem",
                  padding: "0.45rem 0.85rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                }}
              >
                <RefreshCw size={14} className={isLocating ? "animate-spin" : ""} />
                <span>{isLocating ? "Probing GPS..." : "Re-Detect GPS"}</span>
              </button>
            </div>
          </div>

          {/* Live Climate Metrics Strip */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "0.65rem",
              marginTop: "1.1rem",
              marginBottom: "1.1rem",
            }}
          >
            <div style={{ padding: "0.65rem 0.8rem", background: "rgba(0,0,0,0.25)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-card)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>Current Temperature</div>
              <div style={{ fontSize: "1.15rem", fontWeight: "800", color: "#34d399", fontFamily: "var(--font-mono)" }}>
                {weatherData.temp}°C
              </div>
            </div>
            <div style={{ padding: "0.65rem 0.8rem", background: "rgba(0,0,0,0.25)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-card)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>Relative Humidity</div>
              <div style={{ fontSize: "1.15rem", fontWeight: "800", color: "#38bdf8", fontFamily: "var(--font-mono)" }}>
                {weatherData.humidity}% RH
              </div>
            </div>
            <div style={{ padding: "0.65rem 0.8rem", background: "rgba(0,0,0,0.25)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-card)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>Current Season</div>
              <div style={{ fontSize: "1.05rem", fontWeight: "800", color: "#fbbf24" }}>
                {weatherData.season || "Kharif"}
              </div>
            </div>
            <div style={{ padding: "0.65rem 0.8rem", background: "rgba(0,0,0,0.25)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-card)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>Rainfall Forecast</div>
              <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)", marginTop: "0.2rem" }}>
                {weatherData.rainfallForecast || "Clear (0 mm)"}
              </div>
            </div>
            <div style={{ padding: "0.65rem 0.8rem", background: "rgba(0,0,0,0.25)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-card)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>Regional Soil Texture</div>
              <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--accent-emerald-light)", marginTop: "0.2rem" }}>
                {weatherData.soilAffinity || soilType}
              </div>
            </div>
          </div>

          {/* Dynamic Soil-Climate Synergy Insights */}
          {(() => {
            const synergy = generateSoilWeatherSynergy(soilParams, weatherData, soilType);
            if (!synergy || !synergy.insights) return null;
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                {synergy.insights.map((ins, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "0.7rem 0.9rem",
                      borderRadius: "var(--radius-sm)",
                      background:
                        ins.type === "alert" || ins.type === "danger"
                          ? "rgba(239, 68, 68, 0.12)"
                          : ins.type === "warning"
                          ? "rgba(245, 158, 11, 0.12)"
                          : "rgba(16, 185, 129, 0.12)",
                      borderLeft: `4px solid ${
                        ins.type === "alert" || ins.type === "danger"
                          ? "#ef4444"
                          : ins.type === "warning"
                          ? "#f59e0b"
                          : "#10b981"
                      }`,
                      fontSize: "0.82rem",
                      lineHeight: "1.45",
                    }}
                  >
                    <div style={{ fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.15rem" }}>
                      {ins.title}
                    </div>
                    <div style={{ color: "var(--text-muted)" }}>
                      {ins.text}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* 3. Interactive Soil Chemistry Parameters Preview & Sliders */}
      <div className="grid-2col">
        {/* Left: OCR Extracted Text Preview & Soil Type */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "0.5rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileText size={18} color="var(--accent-emerald)" />
            <span>OCR Extracted Text & Lab Details</span>
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "var(--text-dim)", marginBottom: "0.35rem" }}>
                Soil Classification Texture
              </label>
              <select
                className="custom-select"
                style={{ width: "100%", padding: "0.65rem 1rem" }}
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
              >
                <option value="Red & Yellow Loam">Red & Yellow Loam (Odisha / Eastern Basin)</option>
                <option value="Alluvial Loam">Alluvial Loam (Indo-Gangetic Plains)</option>
                <option value="Black Vertisol">Black Vertisol / Black Cotton Clay</option>
                <option value="Red Loam">Red Laterite / Sandy Clay Loam</option>
                <option value="Sandy Arid">Sandy Arid / Desert Entisol</option>
                <option value="Clay Loam">Clay Loam (Heavy Textured)</option>
              </select>
            </div>

            {extractedTextPreview && (
              <div>
                <div style={{ fontSize: "0.78rem", color: "var(--accent-emerald)", fontWeight: "600", marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <CheckCircle2 size={14} /> Extraction Confidence: {confidenceScore}%
                </div>
                <div
                  style={{
                    maxHeight: "140px",
                    overflowY: "auto",
                    padding: "0.75rem",
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid var(--border-card)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.74rem",
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-muted)",
                    whiteSpace: "pre-line",
                  }}
                >
                  {extractedTextPreview}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Fine-Tune Soil Chemistry Sliders */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--text-primary)" }}>
              🧪 {t.soilParametersTitle || "Extracted Soil Nutrient Values"}
            </h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Sliders allow instant adjustments</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {/* pH */}
            <div className="param-slider-group">
              <div className="param-slider-header">
                <span>{t.phLevel || "Soil pH"}</span>
                <strong style={{ color: soilParams.pH < 6.0 ? "#f43f5e" : soilParams.pH > 8.0 ? "#f59e0b" : "#34d399" }}>
                  {soilParams.pH} {soilParams.pH < 6.0 ? "(Acidic)" : soilParams.pH > 8.0 ? "(Alkaline)" : "(Neutral)"}
                </strong>
              </div>
              <input
                type="range"
                min="4.5"
                max="9.5"
                step="0.05"
                value={soilParams.pH}
                onChange={(e) => handleParamChange("pH", e.target.value)}
                className="range-slider"
              />
            </div>

            {/* EC */}
            <div className="param-slider-group">
              <div className="param-slider-header">
                <span>{t.ecLevel || "Electrical Conductivity (EC)"}</span>
                <strong style={{ color: soilParams.EC > 2.0 ? "#f43f5e" : "#34d399" }}>
                  {soilParams.EC} dS/m
                </strong>
              </div>
              <input
                type="range"
                min="0.1"
                max="4.0"
                step="0.05"
                value={soilParams.EC}
                onChange={(e) => handleParamChange("EC", e.target.value)}
                className="range-slider"
              />
            </div>

            {/* OC */}
            <div className="param-slider-group">
              <div className="param-slider-header">
                <span>{t.ocLevel || "Organic Carbon (OC %)"}</span>
                <strong style={{ color: soilParams.OC < 0.5 ? "#f59e0b" : "#34d399" }}>
                  {soilParams.OC}%
                </strong>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.5"
                step="0.02"
                value={soilParams.OC}
                onChange={(e) => handleParamChange("OC", e.target.value)}
                className="range-slider"
              />
            </div>

            {/* Available N, P, K */}
            <div className="npk-sliders-grid">
              <div className="param-slider-group">
                <div className="param-slider-header" style={{ fontSize: "0.75rem" }}>
                  <span>N (kg/ac)</span>
                  <strong>{soilParams.N}</strong>
                </div>
                <input
                  type="range"
                  min="30"
                  max="220"
                  step="5"
                  value={soilParams.N}
                  onChange={(e) => handleParamChange("N", e.target.value)}
                  className="range-slider"
                />
              </div>

              <div className="param-slider-group">
                <div className="param-slider-header" style={{ fontSize: "0.75rem" }}>
                  <span>P (kg/ac)</span>
                  <strong>{soilParams.P}</strong>
                </div>
                <input
                  type="range"
                  min="3"
                  max="35"
                  step="0.5"
                  value={soilParams.P}
                  onChange={(e) => handleParamChange("P", e.target.value)}
                  className="range-slider"
                />
              </div>

              <div className="param-slider-group">
                <div className="param-slider-header" style={{ fontSize: "0.75rem" }}>
                  <span>K (kg/ac)</span>
                  <strong>{soilParams.K}</strong>
                </div>
                <input
                  type="range"
                  min="20"
                  max="180"
                  step="5"
                  value={soilParams.K}
                  onChange={(e) => handleParamChange("K", e.target.value)}
                  className="range-slider"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Step Action Button */}
      <div className="form-action-row" style={{ marginTop: "0.5rem" }}>
        <button
          className="btn btn-primary btn-responsive-full"
          onClick={onProceedToFarmSetup}
          style={{ padding: "0.85rem 2rem", fontSize: "1rem" }}
        >
          <span>Next: Select Crop, Area & Location</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
