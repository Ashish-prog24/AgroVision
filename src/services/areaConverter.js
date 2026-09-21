// Land Area Measurement & Multi-Unit Conversion Utility

export const AREA_UNITS = [
  { id: "acres", name: "Acres (एकड़ / ଏକର)", factorToAcres: 1.0, symbol: "ac" },
  { id: "hectares", name: "Hectares (हेक्टेयर / ହେକ୍ଟର)", factorToAcres: 2.47105, symbol: "ha" },
  { id: "sqft", name: "Square Feet (वर्ग फीट / ବର୍ଗ ଫୁଟ)", factorToAcres: 1 / 43560, symbol: "sq ft" },
  { id: "guntha", name: "Guntha (गुंठा)", factorToAcres: 1 / 40, symbol: "guntha" },
  { id: "bigha", name: "Bigha (बीघा / ବିଘା)", factorToAcres: 0.4, symbol: "bigha" },
  { id: "cent", name: "Cent (डिसमिल / ସେଣ୍ଟ)", factorToAcres: 1 / 100, symbol: "cent" },
];

/**
 * Converts any value in a given unit into standard acres, hectares, and square feet
 */
export function convertLandArea(value, unitId = "acres") {
  const val = Math.max(0.01, parseFloat(value) || 1.0);
  const unit = AREA_UNITS.find((u) => u.id === unitId) || AREA_UNITS[0];
  
  // Standardize to acres
  const totalAcres = val * unit.factorToAcres;
  
  // Compute equivalent representations
  const totalHectares = totalAcres / 2.47105;
  const totalSqFt = totalAcres * 43560;
  const totalGuntha = totalAcres * 40;
  const totalBigha = totalAcres / 0.4;

  return {
    inputValue: val,
    inputUnit: unit,
    acres: Number(totalAcres.toFixed(3)),
    hectares: Number(totalHectares.toFixed(3)),
    sqFt: Math.round(totalSqFt),
    guntha: Number(totalGuntha.toFixed(2)),
    bigha: Number(totalBigha.toFixed(2)),
    formattedSummary: `${val} ${unit.name} = ${totalAcres.toFixed(2)} Acres (${totalHectares.toFixed(2)} Ha / ${Math.round(totalSqFt).toLocaleString()} sq ft)`,
  };
}
