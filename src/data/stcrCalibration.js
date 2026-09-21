// ICAR Certified Soil Test Crop Response (STCR) Equations Database

export const STCR_EQUATIONS = {
  rice: {
    name: "Rice / Paddy",
    targetYieldDefault: 26, // Quintals / acre
    equations: {
      // FN, FP, FK in kg/acre
      fn: (targetYield, soilN) => Math.max(15, Math.min(75, 2.15 * targetYield - 0.28 * soilN)),
      fp: (targetYield, soilP) => Math.max(10, Math.min(45, 1.35 * targetYield - 1.45 * soilP)),
      fk: (targetYield, soilK) => Math.max(10, Math.min(45, 1.12 * targetYield - 0.15 * soilK)),
    },
    standardSource: "ICAR-AICRP on STCR / OUAT / PAU Guidelines",
  },
  wheat: {
    name: "Wheat",
    targetYieldDefault: 24,
    equations: {
      fn: (targetYield, soilN) => Math.max(20, Math.min(70, 2.20 * targetYield - 0.25 * soilN)),
      fp: (targetYield, soilP) => Math.max(12, Math.min(40, 1.55 * targetYield - 1.62 * soilP)),
      fk: (targetYield, soilK) => Math.max(10, Math.min(35, 1.05 * targetYield - 0.12 * soilK)),
    },
    standardSource: "ICAR-Indian Institute of Wheat and Barley Research (IIWBR)",
  },
  cotton: {
    name: "Cotton",
    targetYieldDefault: 14,
    equations: {
      fn: (targetYield, soilN) => Math.max(25, Math.min(85, 3.85 * targetYield - 0.32 * soilN)),
      fp: (targetYield, soilP) => Math.max(15, Math.min(50, 2.10 * targetYield - 1.85 * soilP)),
      fk: (targetYield, soilK) => Math.max(15, Math.min(45, 1.80 * targetYield - 0.18 * soilK)),
    },
    standardSource: "ICAR-Central Institute for Cotton Research (CICR)",
  },
  maize: {
    name: "Maize / Corn",
    targetYieldDefault: 30,
    equations: {
      fn: (targetYield, soilN) => Math.max(20, Math.min(70, 1.95 * targetYield - 0.26 * soilN)),
      fp: (targetYield, soilP) => Math.max(12, Math.min(40, 1.28 * targetYield - 1.50 * soilP)),
      fk: (targetYield, soilK) => Math.max(10, Math.min(35, 1.02 * targetYield - 0.14 * soilK)),
    },
    standardSource: "ICAR-Indian Institute of Maize Research (IIMR)",
  },
  mustard: {
    name: "Mustard",
    targetYieldDefault: 11,
    equations: {
      fn: (targetYield, soilN) => Math.max(15, Math.min(50, 2.80 * targetYield - 0.24 * soilN)),
      fp: (targetYield, soilP) => Math.max(10, Math.min(30, 1.70 * targetYield - 1.40 * soilP)),
      fk: (targetYield, soilK) => Math.max(8, Math.min(25, 1.15 * targetYield - 0.11 * soilK)),
    },
    standardSource: "ICAR-Directorate of Rapeseed-Mustard Research (DRMR)",
  },
};
