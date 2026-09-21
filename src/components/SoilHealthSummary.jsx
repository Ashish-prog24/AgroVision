import React from "react";
import { Award, AlertTriangle, CheckCircle, Activity, Droplets, ShieldCheck } from "lucide-react";
import { calculateSoilHealthIndex } from "../services/agronomyEngine";

export default function SoilHealthSummary({ soilParams, t }) {
  const health = calculateSoilHealthIndex(soilParams);

  // Status mapping for nutrient bars
  const getNStatus = (n) => (n < 70 ? { label: "Low", color: "#f59e0b", pct: Math.min(100, (n / 160) * 100) } : n < 120 ? { label: "Medium", color: "#10b981", pct: Math.min(100, (n / 160) * 100) } : { label: "High", color: "#06b6d4", pct: 100 });
  const getPStatus = (p) => (p < 8 ? { label: "Low", color: "#f43f5e", pct: Math.min(100, (p / 25) * 100) } : p < 18 ? { label: "Medium", color: "#10b981", pct: Math.min(100, (p / 25) * 100) } : { label: "High", color: "#06b6d4", pct: 100 });
  const getKStatus = (k) => (k < 50 ? { label: "Low", color: "#f59e0b", pct: Math.min(100, (k / 140) * 100) } : k < 110 ? { label: "Medium", color: "#10b981", pct: Math.min(100, (k / 140) * 100) } : { label: "High", color: "#06b6d4", pct: 100 });
  const getZnStatus = (zn) => (zn < 0.6 ? { label: "Deficient", color: "#f43f5e", pct: Math.min(100, (zn / 1.2) * 100) } : { label: "Sufficient", color: "#10b981", pct: 100 });
  const getOCStatus = (oc) => (oc < 0.5 ? { label: "Low", color: "#f59e0b", pct: Math.min(100, (oc / 0.8) * 100) } : { label: "Optimal", color: "#10b981", pct: 100 });

  const nStat = getNStatus(soilParams.N || 90);
  const pStat = getPStatus(soilParams.P || 10);
  const kStat = getKStatus(soilParams.K || 70);
  const znStat = getZnStatus(soilParams.Zn || 0.5);
  const ocStat = getOCStatus(soilParams.OC || 0.4);

  return (
    <div className="glass-panel" style={{ padding: "1.5rem" }}>
      {/* Top Banner with Score Gauge */}
      <div className="health-score-container" style={{ marginBottom: "1.25rem" }}>
        <div
          className="score-circle"
          style={{
            background: `radial-gradient(circle, var(--bg-tertiary) 60%, ${health.badgeColor} 100%)`,
            border: `3px solid ${health.badgeColor}`,
            color: health.badgeColor,
          }}
        >
          {health.score}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
            <span className="badge" style={{ background: `${health.badgeColor}22`, color: health.badgeColor, border: `1px solid ${health.badgeColor}55` }}>
              {health.category}
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
              Scale: 0 (Severely Degraded) - 100 (Peak Fertile)
            </span>
          </div>

          <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-primary)" }}>
            {t.soilHealthScore || "Comprehensive Soil Health Index"}
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
            Multivariate evaluation of pH, electrical conductivity, microbial organic carbon, macronutrients (N-P-K), and trace minerals.
          </p>
        </div>
      </div>

      {/* Nutrient Rating Bars Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
        {/* N */}
        <div style={{ padding: "0.85rem", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-card)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "600", marginBottom: "0.3rem" }}>
            <span>Available Nitrogen (N)</span>
            <span style={{ color: nStat.color }}>{nStat.label}</span>
          </div>
          <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ width: `${nStat.pct}%`, height: "100%", background: nStat.color }} />
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.3rem" }}>
            {soilParams.N} kg/acre
          </div>
        </div>

        {/* P */}
        <div style={{ padding: "0.85rem", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-card)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "600", marginBottom: "0.3rem" }}>
            <span>Phosphorus (P₂O₅)</span>
            <span style={{ color: pStat.color }}>{pStat.label}</span>
          </div>
          <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ width: `${pStat.pct}%`, height: "100%", background: pStat.color }} />
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.3rem" }}>
            {soilParams.P} kg/acre
          </div>
        </div>

        {/* K */}
        <div style={{ padding: "0.85rem", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-card)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "600", marginBottom: "0.3rem" }}>
            <span>Potassium (K₂O)</span>
            <span style={{ color: kStat.color }}>{kStat.label}</span>
          </div>
          <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ width: `${kStat.pct}%`, height: "100%", background: kStat.color }} />
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.3rem" }}>
            {soilParams.K} kg/acre
          </div>
        </div>

        {/* OC */}
        <div style={{ padding: "0.85rem", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-card)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "600", marginBottom: "0.3rem" }}>
            <span>Organic Carbon</span>
            <span style={{ color: ocStat.color }}>{ocStat.label}</span>
          </div>
          <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ width: `${ocStat.pct}%`, height: "100%", background: ocStat.color }} />
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.3rem" }}>
            {soilParams.OC}%
          </div>
        </div>

        {/* Zn */}
        <div style={{ padding: "0.85rem", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-card)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "600", marginBottom: "0.3rem" }}>
            <span>Zinc (Zn)</span>
            <span style={{ color: znStat.color }}>{znStat.label}</span>
          </div>
          <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ width: `${znStat.pct}%`, height: "100%", background: znStat.color }} />
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.3rem" }}>
            {soilParams.Zn} ppm
          </div>
        </div>
      </div>

      {/* Diagnostics / Strengths & Deficiencies */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Deficiencies / Attention Needed */}
        <div style={{ padding: "1rem", background: "rgba(244, 63, 94, 0.08)", border: "1px solid rgba(244, 63, 94, 0.2)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#fb7185", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
            <AlertTriangle size={16} /> Key Deficiencies & Soil Stress Factors
          </div>
          {health.issues.length > 0 ? (
            <ul style={{ paddingLeft: "1.2rem", fontSize: "0.8rem", color: "var(--text-dim)", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {health.issues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: "0.8rem", color: "#34d399" }}>No critical soil chemical deficiencies detected!</p>
          )}
        </div>

        {/* Strengths */}
        <div style={{ padding: "1rem", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#34d399", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
            <CheckCircle size={16} /> Soil Strengths & Natural Fertility
          </div>
          <ul style={{ paddingLeft: "1.2rem", fontSize: "0.8rem", color: "var(--text-dim)", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {health.strengths.map((str, idx) => (
              <li key={idx}>{str}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
