import { CROPS_DATABASE } from "../data/cropsData";

/**
 * Multi-variable Crop Recommendation and Profitability Analyzer
 */
export function recommendCrops(soilParams, options = {}) {
  const {
    season = "Rabi",
    soilType = "Alluvial",
    waterAvailability = "Moderate", // Low, Moderate, High
    farmAreaAcre = 1.0,
  } = options;

  const pH = soilParams.pH || 7.0;
  const EC = soilParams.EC || 0.5;
  const OC = soilParams.OC || 0.5;
  const N = soilParams.N || 90;
  const P = soilParams.P || 12;
  const K = soilParams.K || 70;

  const scoredCrops = CROPS_DATABASE.map((crop) => {
    let score = 0;
    const matchDetails = [];

    // 1. pH Compatibility (25 pts)
    if (pH >= crop.phRange.min && pH <= crop.phRange.max) {
      const diffFromOptimal = Math.abs(pH - crop.phRange.optimal);
      const phScore = Math.max(15, Math.round(25 - diffFromOptimal * 8));
      score += phScore;
      matchDetails.push(`Optimal pH fit (${pH} is within ${crop.phRange.min}-${crop.phRange.max})`);
    } else {
      const phPenalty = Math.min(20, Math.round(Math.abs(pH - crop.phRange.optimal) * 15));
      score += Math.max(2, 25 - phPenalty);
      matchDetails.push(`Sub-optimal pH (${pH} vs preferred ${crop.phRange.min}-${crop.phRange.max})`);
    }

    // 2. EC / Salinity Tolerance (15 pts)
    if (EC <= crop.maxEC) {
      score += 15;
      matchDetails.push(`High salinity tolerance (EC ${EC} <= ${crop.maxEC} dS/m)`);
    } else {
      const ecPenalty = Math.min(13, Math.round((EC - crop.maxEC) * 8));
      score += Math.max(2, 15 - ecPenalty);
      matchDetails.push(`Salinity stress warning (EC ${EC} exceeds limit ${crop.maxEC})`);
    }

    // 3. Season Match (25 pts)
    if (season === "All" || crop.seasons.includes(season) || crop.seasons.includes("Perennial")) {
      score += 25;
      matchDetails.push(`Ideal growing season: ${season}`);
    } else {
      score += 5; // Off-season penalty
      matchDetails.push(`Off-season (Usually grown in ${crop.seasons.join(", ")})`);
    }

    // 4. Soil Type Affinity (15 pts)
    const matchesSoil = crop.optimalSoilTypes.some(
      (st) => st.toLowerCase().includes(soilType.toLowerCase()) || soilType.toLowerCase().includes(st.toLowerCase())
    );
    if (matchesSoil) {
      score += 15;
      matchDetails.push(`Well adapted to ${soilType} soil texture`);
    } else {
      score += 8;
      matchDetails.push(`Moderate adaptation to ${soilType}`);
    }

    // 5. Nutrient Demand vs Soil Balance (20 pts)
    let nutrientScore = 15;
    if (crop.category === "Pulse" && N < 70) {
      // Pulses fix nitrogen so they do great in low N soil!
      nutrientScore = 20;
      matchDetails.push("Pulse crop fixes atmospheric N, highly suited to low-N soil!");
    } else if (crop.category === "Oilseed" && (soilParams.S || 10) < 10) {
      nutrientScore = 12;
    }
    score += nutrientScore;

    // Cap suitability score between 10% and 99%
    const finalScore = Math.min(99, Math.max(20, Math.round(score)));

    // Financial Analysis (Per Acre & Total Farm)
    const avgYield = crop.yieldPerAcre.avg;
    const grossRevenuePerAcre = avgYield * crop.marketPricePerQuintal;
    const cultivationCostPerAcre = crop.cultivationCostPerAcre;
    const netProfitPerAcre = grossRevenuePerAcre - cultivationCostPerAcre;
    const roiPercentage = Math.round((netProfitPerAcre / cultivationCostPerAcre) * 100);

    const totalGrossRevenue = Math.round(grossRevenuePerAcre * farmAreaAcre);
    const totalCultivationCost = Math.round(cultivationCostPerAcre * farmAreaAcre);
    const totalNetProfit = Math.round(netProfitPerAcre * farmAreaAcre);

    return {
      ...crop,
      suitabilityScore: finalScore,
      matchDetails,
      financials: {
        avgYield,
        unit: crop.yieldPerAcre.unit,
        marketPrice: crop.marketPricePerQuintal,
        grossRevenuePerAcre,
        cultivationCostPerAcre,
        netProfitPerAcre,
        roiPercentage,
        totalGrossRevenue,
        totalCultivationCost,
        totalNetProfit,
      },
    };
  });

  // Sort primarily by Suitability Score, secondarily by Net Profit
  return scoredCrops.sort((a, b) => {
    if (b.suitabilityScore !== a.suitabilityScore) {
      return b.suitabilityScore - a.suitabilityScore;
    }
    return b.financials.netProfitPerAcre - a.financials.netProfitPerAcre;
  });
}
