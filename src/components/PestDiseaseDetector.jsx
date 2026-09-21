import React, { useState, useRef } from "react";
import { Bug, Camera, UploadCloud, AlertTriangle, ShieldCheck, CheckCircle2, Sparkles, Volume2, Droplets, Info } from "lucide-react";
import { SAMPLE_DISEASE_CARDS } from "../data/sampleDiseases";
import { classifyPlantDisease } from "../services/diseaseClassifier";
import { SpeechService } from "../services/speechService";

export default function PestDiseaseDetector({ language, t }) {
  const [selectedSampleCard, setSelectedSampleCard] = useState(SAMPLE_DISEASE_CARDS[0]);
  const [customImageSrc, setCustomImageSrc] = useState(null);
  const [isInferencing, setIsInferencing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const fileInputRef = useRef(null);

  // Run CNN inference whenever selected card changes
  React.useEffect(() => {
    handleRunDiagnosis(null, selectedSampleCard.diseaseId);
  }, []);

  const handleRunDiagnosis = async (imageFileOrUrl, diseaseId = null) => {
    setIsInferencing(true);
    try {
      const result = await classifyPlantDisease(imageFileOrUrl || customImageSrc, diseaseId);
      setDiagnosisResult(result);
    } catch (err) {
      console.warn("CNN Classification error:", err);
    } finally {
      setTimeout(() => setIsInferencing(false), 500);
    }
  };

  const handleSelectSample = (sample) => {
    setSelectedSampleCard(sample);
    setCustomImageSrc(null);
    handleRunDiagnosis(null, sample.diseaseId);
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCustomImageSrc(ev.target.result);
        setSelectedSampleCard(null);
        handleRunDiagnosis(file, null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpeakDiseasePrescription = () => {
    if (!diagnosisResult || !diagnosisResult.disease) return;
    const d = diagnosisResult.disease;
    const text = `Detected Condition: ${d.name} for ${d.crop}. Severity is ${d.severity}. Recommended chemical spray: ${d.chemicalControl.activeIngredient} at ${d.chemicalControl.dosagePerLitre}. Recommended organic remedy: ${d.organicBiologicalControl.bioFungicide || d.organicBiologicalControl.neemExtract}.`;
    SpeechService.speak(text, language);
  };

  const disease = diagnosisResult?.disease;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
              <span className="badge badge-danger">Computer Vision Diagnostic</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
                Deep Learning CNN • 12 Plant Pathology Classes
              </span>
            </div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--text-primary)" }}>
              {t.pestModuleTitle || "CNN Plant Disease & Pest Vision Diagnostic"}
            </h2>
          </div>

          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button
              className="btn btn-primary"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={16} />
              <span>{t.uploadLeafPhoto || "Upload Leaf Photo"}</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* 1-Click Disease Sample Cards */}
        <div style={{ marginTop: "1.25rem" }}>
          <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
            <Sparkles size={15} color="var(--accent-amber)" />
            <span>Or select from Pre-loaded Disease Leaf Samples:</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
            {SAMPLE_DISEASE_CARDS.map((card) => {
              const isSelected = selectedSampleCard?.id === card.id;
              return (
                <div
                  key={card.id}
                  onClick={() => handleSelectSample(card)}
                  style={{
                    padding: "0.75rem",
                    background: isSelected ? "rgba(16, 185, 129, 0.15)" : "var(--bg-tertiary)",
                    border: `1px solid ${isSelected ? "var(--accent-emerald)" : "var(--border-card)"}`,
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)" }}>
                    <span>{card.crop}</span>
                    {isSelected && <CheckCircle2 size={15} color="var(--accent-emerald)" />}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
                    {card.title}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: card.diseaseId === "healthy_crop" ? "#34d399" : "#fb7185", marginTop: "0.3rem" }}>
                    {card.severityRating}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Diagnostic Showcase */}
      {disease && (
        <div className="grid-2col">
          {/* Left: Visual Leaf Scanner with Bounding Box / Heatmap */}
          <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-primary)" }}>
                AI Visual Heatmap & Bounding Inspection
              </h3>
              <span className="badge badge-success">
                {diagnosisResult?.confidence || 97}% Confidence
              </span>
            </div>

            {/* Leaf Image Container */}
            <div className="leaf-preview-container">
              {/* Scanner Line */}
              {isInferencing && <div className="cnn-scanner-bar" />}

              {/* Render either uploaded custom image or SVG leaf */}
              {customImageSrc ? (
                <img
                  src={customImageSrc}
                  alt="Uploaded leaf"
                  style={{ width: "100%", height: "260px", objectFit: "cover", display: "block" }}
                />
              ) : selectedSampleCard ? (
                <div
                  dangerouslySetInnerHTML={{ __html: selectedSampleCard.svgVisual }}
                  style={{ width: "100%", height: "260px", display: "flex", alignItems: "center", justifyContent: "center" }}
                />
              ) : null}

              {/* Bounding Box Overlay */}
              {!isInferencing && diagnosisResult?.heatmap && disease.id !== "healthy_crop" && (
                <div
                  className="cnn-bounding-box"
                  style={{
                    top: diagnosisResult.heatmap.y,
                    left: diagnosisResult.heatmap.x,
                    width: diagnosisResult.heatmap.width,
                    height: diagnosisResult.heatmap.height,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-22px",
                      left: 0,
                      background: "#f43f5e",
                      color: "white",
                      fontSize: "0.68rem",
                      fontWeight: "700",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {disease.name} ({diagnosisResult.confidence}%)
                  </div>
                </div>
              )}
            </div>

            {/* Probability Breakdown */}
            <div style={{ width: "100%", marginTop: "1.25rem" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--text-dim)", marginBottom: "0.5rem" }}>
                Classification Probabilities
              </div>
              {diagnosisResult?.topProbabilities?.map((p, idx) => (
                <div key={idx} style={{ marginBottom: "0.4rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.2rem" }}>
                    <span>{p.name}</span>
                    <strong>{p.prob}%</strong>
                  </div>
                  <div style={{ width: "100%", height: "5px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${p.prob}%`,
                        height: "100%",
                        background: idx === 0 ? "var(--accent-emerald)" : "var(--accent-amber)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Pathogen Dossier & Prescriptions */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <span className="badge badge-danger">{disease.pathogenType}</span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-primary)", marginTop: "0.3rem" }}>
                  {disease.name}
                </h3>
                <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontStyle: "italic" }}>
                  {disease.scientificName} • Affected Crop: {disease.crop}
                </span>
              </div>

              <button
                className="btn btn-secondary"
                onClick={handleSpeakDiseasePrescription}
                style={{ padding: "0.45rem 0.85rem", fontSize: "0.8rem" }}
              >
                <Volume2 size={15} color="var(--accent-emerald)" />
                <span>Listen</span>
              </button>
            </div>

            {/* Symptoms */}
            <div style={{ marginBottom: "1.25rem" }}>
              <h4 style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--accent-amber-light)", marginBottom: "0.4rem" }}>
                Diagnostic Symptoms & Damage
              </h4>
              <ul style={{ paddingLeft: "1.2rem", fontSize: "0.8rem", color: "var(--text-dim)", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {disease.symptoms.map((sym, sIdx) => (
                  <li key={sIdx}>{sym}</li>
                ))}
              </ul>
            </div>

            {/* Chemical Prescription */}
            {disease.id !== "healthy_crop" && (
              <div
                style={{
                  padding: "1rem",
                  background: "rgba(244, 63, 94, 0.08)",
                  border: "1px solid rgba(244, 63, 94, 0.25)",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#fb7185", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                  <Droplets size={16} /> {t.chemicalTreatment || "Targeted Chemical Prescription"}
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)" }}>
                  {disease.chemicalControl.activeIngredient}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
                  Commercial Brands: <strong>{disease.chemicalControl.commercialBrands?.join(", ")}</strong>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.6rem", fontSize: "0.78rem" }}>
                  <div>💧 <strong>Dosage:</strong> {disease.chemicalControl.dosagePerLitre}</div>
                  <div>🌾 <strong>Per Acre:</strong> {disease.chemicalControl.dosagePerAcre}</div>
                  <div>⏳ <strong>PHI Safety:</strong> {disease.chemicalControl.phiDays} Days before harvest</div>
                </div>
              </div>
            )}

            {/* Organic & Biological Control */}
            <div
              style={{
                padding: "1rem",
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#34d399", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                <ShieldCheck size={16} /> {t.organicBiocontrol || "Organic & Biological Management"}
              </div>
              {disease.organicBiologicalControl.bioFungicide && (
                <div style={{ fontSize: "0.8rem", color: "var(--text-primary)", marginBottom: "0.2rem" }}>
                  🌿 <strong>Bio-agent:</strong> {disease.organicBiologicalControl.bioFungicide}
                </div>
              )}
              {disease.organicBiologicalControl.neemExtract && (
                <div style={{ fontSize: "0.8rem", color: "var(--text-primary)", marginBottom: "0.2rem" }}>
                  🍃 <strong>Neem Formulation:</strong> {disease.organicBiologicalControl.neemExtract}
                </div>
              )}
              {disease.organicBiologicalControl.culturalPractices && (
                <ul style={{ paddingLeft: "1.2rem", fontSize: "0.76rem", color: "var(--text-dim)", marginTop: "0.3rem" }}>
                  {disease.organicBiologicalControl.culturalPractices.map((cp, cIdx) => (
                    <li key={cIdx}>{cp}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
