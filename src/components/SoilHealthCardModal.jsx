import React from "react";
import { X, Printer, Download, Award, CheckCircle2, ShieldCheck, QrCode } from "lucide-react";
import { calculateSoilHealthIndex, calculateFertilizerPrescription } from "../services/agronomyEngine";
import { CROPS_DATABASE } from "../data/cropsData";

export default function SoilHealthCardModal({
  soilParams,
  selectedCropId,
  farmAreaAcre,
  soilType,
  selectedReportId,
  weatherData,
  locationQuery,
  onClose,
  t,
}) {
  const crop = CROPS_DATABASE.find((c) => c.id === selectedCropId) || CROPS_DATABASE[0];
  const health = calculateSoilHealthIndex(soilParams);
  const prescription = calculateFertilizerPrescription(soilParams, crop, farmAreaAcre, soilType);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-card-inner" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Award size={22} color="var(--accent-emerald)" />
            <h2 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-primary)" }}>
              {t.officialCardTitle || "OFFICIAL SOIL HEALTH CARD CERTIFICATE"}
            </h2>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn btn-primary" onClick={handlePrint} style={{ padding: "0.45rem 0.9rem", fontSize: "0.82rem" }}>
              <Printer size={15} />
              <span>{t.generatePdf || "Print / Save PDF"}</span>
            </button>
            <button className="btn-icon" onClick={onClose} style={{ width: "34px", height: "34px" }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Card Container */}
        <div
          id="printable-soil-card"
          className="printable-card-container"
          style={{
            background: "#ffffff",
            color: "#0f172a",
            borderRadius: "16px",
            border: "3px double #10b981",
            fontFamily: "var(--font-sans)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.85rem", marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#059669" }}>
              Department of Agriculture & Farmers Welfare • ICAR Agronomy Network
            </div>
            <h1 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#064e3b", margin: "0.25rem 0" }}>
              PRECISION SOIL HEALTH & NPK CARD
            </h1>
            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
              Certificate ID: SHC-2026-AI-8942 • Issue Date: {new Date().toLocaleDateString()} • QR Authenticated
            </div>
          </div>

          {/* Farmer & Field Info */}
          <div className="shc-info-grid">
            <div><strong>Location:</strong> {weatherData?.name || locationQuery || "Registered Agro Field"}</div>
            <div><strong>Area:</strong> {farmAreaAcre} Acre(s)</div>
            <div><strong>Soil Texture:</strong> {soilType}</div>
            <div><strong>Selected Crop:</strong> {crop.name}</div>
            <div><strong>Health Score:</strong> {health.score} / 100 ({health.category})</div>
            <div><strong>Agro-Climate:</strong> {weatherData ? `${weatherData.temp}°C, RH ${weatherData.humidity}% (${weatherData.season})` : "Standard Agro-Zone"}</div>
          </div>

          {/* Soil Test Chemistry Table */}
          <div style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "0.92rem", fontWeight: "800", color: "#0f172a", marginBottom: "0.4rem" }}>
              1. Soil Chemical & Nutrient Test Parameters
            </h3>
            <div className="table-responsive">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", textAlign: "left", minWidth: "480px" }}>
                <thead>
                  <tr style={{ background: "#e2e8f0", borderBottom: "2px solid #cbd5e1" }}>
                    <th style={{ padding: "6px 8px" }}>Parameter</th>
                    <th style={{ padding: "6px 8px" }}>Test Value</th>
                    <th style={{ padding: "6px 8px" }}>Unit</th>
                    <th style={{ padding: "6px 8px" }}>Optimal Range</th>
                    <th style={{ padding: "6px 8px" }}>Nutrient Rating</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "6px 8px", fontWeight: "600" }}>Soil pH (Reaction)</td>
                    <td style={{ padding: "6px 8px" }}>{soilParams.pH}</td>
                    <td style={{ padding: "6px 8px" }}>--</td>
                    <td style={{ padding: "6px 8px" }}>6.5 - 7.5</td>
                    <td style={{ padding: "6px 8px", color: soilParams.pH < 6.0 || soilParams.pH > 8.0 ? "#ef4444" : "#10b981", fontWeight: "700" }}>
                      {soilParams.pH < 6.0 ? "Acidic" : soilParams.pH > 8.0 ? "Alkaline" : "Neutral"}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "6px 8px", fontWeight: "600" }}>Electrical Conductivity (EC)</td>
                    <td style={{ padding: "6px 8px" }}>{soilParams.EC}</td>
                    <td style={{ padding: "6px 8px" }}>dS/m</td>
                    <td style={{ padding: "6px 8px" }}>&lt; 1.0</td>
                    <td style={{ padding: "6px 8px", color: "#10b981", fontWeight: "700" }}>Normal / Non-saline</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "6px 8px", fontWeight: "600" }}>Organic Carbon (OC)</td>
                    <td style={{ padding: "6px 8px" }}>{soilParams.OC}%</td>
                    <td style={{ padding: "6px 8px" }}>%</td>
                    <td style={{ padding: "6px 8px" }}>&gt; 0.75%</td>
                    <td style={{ padding: "6px 8px", color: soilParams.OC < 0.5 ? "#f59e0b" : "#10b981", fontWeight: "700" }}>
                      {soilParams.OC < 0.5 ? "Low" : "Medium/High"}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "6px 8px", fontWeight: "600" }}>Available Nitrogen (N)</td>
                    <td style={{ padding: "6px 8px" }}>{soilParams.N}</td>
                    <td style={{ padding: "6px 8px" }}>kg/acre</td>
                    <td style={{ padding: "6px 8px" }}>110 - 220</td>
                    <td style={{ padding: "6px 8px", fontWeight: "700" }}>{soilParams.N < 80 ? "Low" : "Medium"}</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "6px 8px", fontWeight: "600" }}>Available Phosphorus (P₂O₅)</td>
                    <td style={{ padding: "6px 8px" }}>{soilParams.P}</td>
                    <td style={{ padding: "6px 8px" }}>kg/acre</td>
                    <td style={{ padding: "6px 8px" }}>10 - 25</td>
                    <td style={{ padding: "6px 8px", fontWeight: "700" }}>{soilParams.P < 10 ? "Deficient" : "Sufficient"}</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "6px 8px", fontWeight: "600" }}>Available Potassium (K₂O)</td>
                    <td style={{ padding: "6px 8px" }}>{soilParams.K}</td>
                    <td style={{ padding: "6px 8px" }}>kg/acre</td>
                    <td style={{ padding: "6px 8px" }}>60 - 120</td>
                    <td style={{ padding: "6px 8px", fontWeight: "700" }}>{soilParams.K < 50 ? "Low" : "Medium/High"}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "6px 8px", fontWeight: "600" }}>Available Zinc (Zn)</td>
                    <td style={{ padding: "6px 8px" }}>{soilParams.Zn}</td>
                    <td style={{ padding: "6px 8px" }}>ppm</td>
                    <td style={{ padding: "6px 8px" }}>&gt; 0.60</td>
                    <td style={{ padding: "6px 8px", color: soilParams.Zn < 0.6 ? "#ef4444" : "#10b981", fontWeight: "700" }}>
                      {soilParams.Zn < 0.6 ? "Deficient" : "Sufficient"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Fertilizer Dosage Schedule */}
          <div style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "0.92rem", fontWeight: "800", color: "#0f172a", marginBottom: "0.4rem" }}>
              2. Prescribed Fertilizer Recommendation for {crop.name} ({farmAreaAcre} Acre)
            </h3>
            <div className="shc-presc-grid">
              <div style={{ padding: "8px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px" }}>
                <strong>Urea (46% N):</strong> {prescription.totalFarm.ureaKg} kg ({prescription.totalFarm.ureaBags} bags)
              </div>
              <div style={{ padding: "8px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px" }}>
                <strong>DAP (18-46-0):</strong> {prescription.totalFarm.dapKg} kg ({prescription.totalFarm.dapBags} bags)
              </div>
              <div style={{ padding: "8px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px" }}>
                <strong>MOP (0-0-60):</strong> {prescription.totalFarm.mopKg} kg ({prescription.totalFarm.mopBags} bags)
              </div>
            </div>
          </div>

          {/* Footer & Agronomist Signature */}
          <div className="shc-footer-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "2px solid #e2e8f0", paddingTop: "1rem", marginTop: "1rem", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: "50px", height: "50px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                <QrCode size={36} color="#0f172a" />
              </div>
              <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                Scan to verify digital record<br />on AgroVision Cloud Registry
              </div>
            </div>

            <div style={{ textAlign: "right", fontSize: "0.8rem" }}>
              <div style={{ fontFamily: "cursive", fontSize: "1.1rem", color: "#064e3b" }}>Dr. H. S. Dhillon, Ph.D.</div>
              <div style={{ fontWeight: "700", color: "#0f172a" }}>Senior Chief Soil Scientist & Agronomist</div>
              <div style={{ fontSize: "0.72rem", color: "#64748b" }}>ICAR Certified Soil Testing Specialist</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
