import { FERTILIZERS_DATA } from "../data/fertilizersData";
import { STCR_EQUATIONS } from "../data/stcrCalibration";

/**
 * Computes Soil Health Index (0-100) and qualitative status
 */
export function calculateSoilHealthIndex(params) {
  let score = 0;
  const issues = [];
  const strengths = [];

  // 1. pH Score (25 points max)
  const pH = params.pH || 7.0;
  if (pH >= 6.5 && pH <= 7.5) {
    score += 25;
    strengths.push("Optimal neutral pH (6.5-7.5) maximizes all nutrient bio-availability.");
  } else if ((pH >= 6.0 && pH < 6.5) || (pH > 7.5 && pH <= 8.0)) {
    score += 20;
    strengths.push("Near-optimal pH range; good nutrient mobility.");
  } else if (pH < 6.0) {
    score += Math.max(5, Math.round(25 - (6.0 - pH) * 12));
    issues.push(`Acidic soil (pH ${pH}): Causes phosphorus fixation and aluminum toxicity.`);
  } else {
    score += Math.max(5, Math.round(25 - (pH - 8.0) * 10));
    issues.push(`Alkaline soil (pH ${pH}): Causes micro-nutrient (Zn, Fe, Mn) fixation.`);
  }

  // 2. Electrical Conductivity (15 points max)
  const EC = params.EC || 0.5;
  if (EC < 1.0) {
    score += 15;
    strengths.push("Excellent low salinity index (EC < 1.0 dS/m). Non-saline.");
  } else if (EC < 2.0) {
    score += 10;
    issues.push("Slight salinity (EC 1.0-2.0 dS/m). Sensitive crops may experience mild osmotic stress.");
  } else {
    score += Math.max(2, Math.round(15 - (EC - 2.0) * 4));
    issues.push(`High salinity hazard (EC ${EC} dS/m). Root water uptake inhibited.`);
  }

  // 3. Organic Carbon % (20 points max)
  const OC = params.OC || 0.4;
  if (OC >= 0.75) {
    score += 20;
    strengths.push("High organic carbon (>0.75%), supporting rich microbial biology.");
  } else if (OC >= 0.50) {
    score += 15;
    strengths.push("Medium organic carbon (0.50-0.75%). Good soil structure.");
  } else {
    score += Math.max(4, Math.round(OC * 26));
    issues.push(`Low organic carbon (${OC}%). Soil microbiome and moisture retention are compromised.`);
  }

  // 4. Major N-P-K Balance (25 points max)
  const N = params.N || 90;
  const P = params.P || 10;
  const K = params.K || 70;
  let npkScore = 0;

  if (N >= 100) npkScore += 8;
  else if (N >= 70) npkScore += 6;
  else { npkScore += 3; issues.push("Deficient in Available Nitrogen."); }

  if (P >= 15) npkScore += 9;
  else if (P >= 8) npkScore += 6;
  else { npkScore += 2; issues.push("Critically low in Available Phosphorus."); }

  if (K >= 60) npkScore += 8;
  else if (K >= 40) npkScore += 5;
  else { npkScore += 2; issues.push("Low in Available Potassium."); }

  score += npkScore;

  // 5. Micronutrients (15 points max)
  let microScore = 0;
  if ((params.Zn || 0.5) >= 0.6) microScore += 5; else issues.push("Deficient in Zinc (Zn < 0.6 ppm).");
  if ((params.Fe || 4.0) >= 4.5) microScore += 4; else issues.push("Deficient in Iron (Fe < 4.5 ppm).");
  if ((params.S || 10) >= 10.0) microScore += 3; else issues.push("Deficient in Sulphur (S < 10 ppm).");
  if ((params.B || 0.5) >= 0.5) microScore += 3;

  score += microScore;

  score = Math.min(100, Math.max(10, score));

  let category = "Degraded / Deficient";
  let badgeColor = "#ef4444";
  if (score >= 80) {
    category = "Excellent / High Fertility";
    badgeColor = "#10b981";
  } else if (score >= 65) {
    category = "Good / Productive";
    badgeColor = "#22c55e";
  } else if (score >= 45) {
    category = "Moderate / Balanced Interventions Needed";
    badgeColor = "#f59e0b";
  }

  return {
    score,
    category,
    badgeColor,
    issues,
    strengths,
  };
}

/**
 * Calculates precision fertilizer amounts (Urea, DAP, MOP, Micronutrients, Amendments)
 * Uses ICAR STCR quadratic equations for yield targets
 */
export function calculateFertilizerPrescription(soilParams, crop, farmAreaAcre = 1.0, soilType = "Alluvial") {
  const pH = soilParams.pH || 7.0;
  const area = Math.max(0.01, Number(farmAreaAcre) || 1.0);
  
  // Soil available nutrients (kg/acre)
  const soilN = soilParams.N || 80;
  const soilP = soilParams.P || 10;
  const soilK = soilParams.K || 60;
  const soilZn = soilParams.Zn || 0.5;

  let nGapKgPerAcre = 0;
  let pGapKgPerAcre = 0;
  let kGapKgPerAcre = 0;

  // Check if certified STCR equation exists for crop
  const stcr = STCR_EQUATIONS[crop.id];
  if (stcr) {
    const targetYield = crop.yieldPerAcre?.avg || stcr.targetYieldDefault;
    nGapKgPerAcre = Math.round(stcr.equations.fn(targetYield, soilN));
    pGapKgPerAcre = Math.round(stcr.equations.fp(targetYield, soilP));
    kGapKgPerAcre = Math.round(stcr.equations.fk(targetYield, soilK));
  } else {
    // Standard Nutrient Uptake Balancer
    const targetN = crop.nutrientRequirements?.N || 45;
    const targetP = crop.nutrientRequirements?.P || 20;
    const targetK = crop.nutrientRequirements?.K || 20;

    let pEfficiency = (pH < 6.0 || pH > 7.8) ? 0.75 : 1.0;
    pGapKgPerAcre = Math.round((targetP * (soilP < 10 ? 1.25 : soilP < 20 ? 1.0 : 0.7)) / pEfficiency);
    nGapKgPerAcre = Math.round(targetN * (soilN < 80 ? 1.2 : soilN < 140 ? 1.0 : 0.75));
    kGapKgPerAcre = Math.round(targetK * (soilK < 50 ? 1.25 : soilK < 100 ? 1.0 : 0.5));
  }

  // 1. DAP (18-46-0) supplies P2O5 and starter Nitrogen
  const dapKgPerAcre = Math.round(pGapKgPerAcre / 0.46);
  const nFromDapPerAcre = dapKgPerAcre * 0.18;

  // 2. Urea (46% N) supplies remaining Nitrogen
  const remainingNPerAcre = Math.max(0, nGapKgPerAcre - nFromDapPerAcre);
  const ureaKgPerAcre = Math.round(remainingNPerAcre / 0.46);

  // 3. MOP (60% K2O)
  const mopKgPerAcre = Math.round(kGapKgPerAcre / 0.60);

  // 4. Micronutrients & Amendments
  const zincSulphateKgPerAcre = (soilZn < 0.6) ? (soilZn < 0.5 ? 12 : 8) : 0;
  const limeKgPerAcre = pH < 6.0 ? Math.round((6.5 - pH) * 400) : 0;
  const gypsumKgPerAcre = pH > 8.0 ? Math.round((pH - 7.8) * 450) : 0;

  // Total farm multiplication
  const totalUreaKg = Math.round(ureaKgPerAcre * area);
  const totalDapKg = Math.round(dapKgPerAcre * area);
  const totalMopKg = Math.round(mopKgPerAcre * area);
  const totalZincKg = Math.round(zincSulphateKgPerAcre * area);
  const totalLimeKg = Math.round(limeKgPerAcre * area);
  const totalGypsumKg = Math.round(gypsumKgPerAcre * area);

  // 50kg bag equivalents (Urea 45kg bag)
  const ureaBags = Number((totalUreaKg / 45).toFixed(1));
  const dapBags = Number((totalDapKg / 50).toFixed(1));
  const mopBags = Number((totalMopKg / 50).toFixed(1));

  // 3-Stage Split Schedule
  const basalUrea = Math.round(totalUreaKg * 0.33);
  const topDress1Urea = Math.round(totalUreaKg * 0.33);
  const topDress2Urea = totalUreaKg - basalUrea - topDress1Urea;

  const splitSchedule = [
    {
      stage: "Basal Application (At Sowing / Seed Bed Preparation)",
      timing: "Day 0 (Pre-sowing placement 5 cm below seed)",
      items: [
        { name: "DAP (18-46-0)", amount: `${totalDapKg} kg (${dapBags} bags)`, pct: "100% of total DAP" },
        { name: "MOP (0-0-60)", amount: `${totalMopKg} kg (${mopBags} bags)`, pct: "100% of total MOP" },
        { name: "Urea (46% N)", amount: `${basalUrea} kg (~33% starter N)`, pct: "1/3rd of total Urea" },
        ...(totalZincKg > 0 ? [{ name: "Zinc Sulphate 21%", amount: `${totalZincKg} kg`, pct: "100% Basal" }] : []),
        ...(totalLimeKg > 0 ? [{ name: "Agricultural Lime (CaCO3)", amount: `${totalLimeKg} kg`, pct: "Broadcast 15 days prior" }] : []),
        ...(totalGypsumKg > 0 ? [{ name: "Gypsum (CaSO4)", amount: `${totalGypsumKg} kg`, pct: "Soil incorporation" }] : []),
      ],
      instructions: "Band place DAP & MOP at least 4-5 cm away from seed to prevent osmotic seed burn.",
    },
    {
      stage: "1st Top Dressing (Active Tillering / Vegetative Branching)",
      timing: "Day 25 - 30 (After 1st weeding & irrigation)",
      items: [
        { name: "Urea (46% N)", amount: `${topDress1Urea} kg`, pct: "1/3rd of total Urea" },
      ],
      instructions: "Broadcast uniformly when foliage is dry; irrigate within 24-48 hours to minimize ammonia volatilization.",
    },
    {
      stage: "2nd Top Dressing (Panicle Initiation / Flowering / Knee High)",
      timing: "Day 50 - 60 (Critical reproductive phase)",
      items: [
        { name: "Urea (46% N)", amount: `${topDress2Urea} kg`, pct: "Final 1/3rd of total Urea" },
      ],
      instructions: "Boosts earhead length, spikelet fertility, and protein grain filling.",
    },
  ];

  const regenerativePlan = {
    vermicompostRecommendation: `${(area * 1.2).toFixed(1)} Tonnes (${Math.round(area * 24)} bags)`,
    biofertilizers: crop.category === "Pulse" ? "Rhizobium + PSB Culture (200g/10kg seeds)" : "Azotobacter / Azospirillum + PSB (2 kg/acre)",
    greenManuring: "Sow Sesbania (Dhaincha) or Sunn hemp during summer fallow (45 days); turn into soil to fix 80 kg natural N/ha.",
    soilCarbonAdvice: "Apply crop residue mulching and avoid in-field stubble burning to restore soil organic carbon above 0.75%.",
  };

  return {
    perAcre: {
      ureaKg: ureaKgPerAcre,
      dapKg: dapKgPerAcre,
      mopKg: mopKgPerAcre,
      zincKg: zincSulphateKgPerAcre,
      limeKg: limeKgPerAcre,
      gypsumKg: gypsumKgPerAcre,
    },
    totalFarm: {
      areaAcre: area,
      ureaKg: totalUreaKg,
      ureaBags,
      dapKg: totalDapKg,
      dapBags,
      mopKg: totalMopKg,
      mopBags,
      zincKg: totalZincKg,
      limeKg: totalLimeKg,
      gypsumKg: totalGypsumKg,
      estimatedFertilizerCost: Math.round(
        ureaBags * FERTILIZERS_DATA.urea.costPerBag +
        dapBags * FERTILIZERS_DATA.dap.costPerBag +
        mopBags * FERTILIZERS_DATA.mop.costPerBag +
        (totalZincKg > 0 ? (totalZincKg / 25) * 750 : 0)
      ),
    },
    splitSchedule,
    regenerativePlan,
    stcrCompliance: stcr ? stcr.standardSource : "ICAR Soil Test Rating Chart Standard",
  };
}
