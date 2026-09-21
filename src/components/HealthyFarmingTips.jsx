import React from "react";
import { Sparkles, Sprout, ShieldCheck, HeartPulse, Recycle, Droplet, Sun } from "lucide-react";
import { FERTILIZERS_DATA } from "../data/fertilizersData";

export default function HealthyFarmingTips({ soilParams, farmAreaAcre, t }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
          <span className="badge badge-success">Regenerative Agriculture</span>
          <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
            Soil Carbon Restoration & Ecological Pest Resilience
          </span>
        </div>
        <h2 style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--text-primary)" }}>
          {t.regenerativeTips || "Regenerative Carbon Farming & Healthy Soil Practices"}
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginTop: "0.3rem" }}>
          Enhancing soil organic carbon (OC) from current {soilParams.OC || 0.4}% to &gt;0.75% reduces chemical fertilizer requirement by 25-30% while increasing crop drought resistance.
        </p>
      </div>

      {/* Grid of Key Regenerative Practices */}
      <div className="grid-2col">
        {/* 1. Green Manuring */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-emerald)" }}>
              <Sprout size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--text-primary)" }}>
                Green Manuring with Dhaincha / Sunn Hemp
              </h3>
              <span style={{ fontSize: "0.75rem", color: "var(--accent-emerald)" }}>Adds 80-100 kg Natural N / Hectare</span>
            </div>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-dim)", lineHeight: "1.5" }}>
            Sow <em>Sesbania aculeata</em> (Dhaincha) @ 20 kg/acre in May-June with pre-monsoon showers. Plough it back into the soil at 45 days when plants are succulent before flowering. It decomposes rapidly, enriching humus and unlocking bound phosphorus.
          </p>
        </div>

        {/* 2. Biofertilizers & Microbial Inoculants */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-cyan)" }}>
              <HeartPulse size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--text-primary)" }}>
                Biofertilizers (PSB, Azotobacter, Rhizobium)
              </h3>
              <span style={{ fontSize: "0.75rem", color: "var(--accent-cyan)" }}>Microbial Phosphate Solubilizers</span>
            </div>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-dim)", lineHeight: "1.5" }}>
            Inoculate seeds with <strong>Rhizobium</strong> (for pulses) or <strong>Azotobacter</strong> (for cereals) + <strong>Phosphate Solubilizing Bacteria (PSB)</strong>. PSB secretes organic acids that convert insoluble tricalcium phosphate in soil into plant-usable orthophosphate ions.
          </p>
        </div>

        {/* 3. Enriched Vermicompost & Farmyard Manure */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(245, 158, 11, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-amber)" }}>
              <Recycle size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--text-primary)" }}>
                Enriched Vermicompost Application
              </h3>
              <span style={{ fontSize: "0.75rem", color: "var(--accent-amber)" }}>Target: {(farmAreaAcre * 1.5).toFixed(1)} Tonnes for {farmAreaAcre} Acre(s)</span>
            </div>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-dim)", lineHeight: "1.5" }}>
            Apply well-decomposed vermicompost fortified with <em>Trichoderma viride</em> (2 kg/tonne). Increases soil cation exchange capacity (CEC), promotes mycorrhizal root networks, and prevents soil crusting in heavy black and clay soils.
          </p>
        </div>

        {/* 4. Drip Fertigation & Stubble Mulching */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(132, 204, 22, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-lime)" }}>
              <Droplet size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--text-primary)" }}>
                In-Situ Mulching & Precision Fertigation
              </h3>
              <span style={{ fontSize: "0.75rem", color: "var(--accent-lime)" }}>Saves 40% Water & Stops Stubble Burning</span>
            </div>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-dim)", lineHeight: "1.5" }}>
            Incorporate crop residue using Happy Seeder / Super SMS machines rather than burning. Surface mulching retains soil moisture, suppresses weed emergence by 70%, and maintains moderate root-zone temperature during peak summer heat waves.
          </p>
        </div>
      </div>
    </div>
  );
}
