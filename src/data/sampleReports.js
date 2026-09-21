// Realistic Laboratory Soil Testing Reports for Instant Demo & Testing
export const SAMPLE_SOIL_REPORTS = [
  {
    id: "odisha_bargarh",
    title: "Odisha Hirakud Basin Soil Report",
    location: "Barpali, Dist: Bargarh, Odisha",
    soilType: "Red & Yellow Loam",
    labName: "District Soil Testing Laboratory, Bargarh (Dept of Agriculture, Govt of Odisha)",
    reportNumber: "ST-OD-2026-5512",
    date: "2026-08-10",
    farmerName: "Bishnu Prasad Meher",
    farmAreaAcre: 3.0,
    targetCrop: "rice",
    extractedText: `=====================================================
DISTRICT SOIL TESTING LABORATORY, BARGARH
DEPARTMENT OF AGRICULTURE, GOVT OF ODISHA
Sample No: ST-OD-2026-5512    Date: 10-08-2026
Farmer: Bishnu Prasad Meher   Block: Barpali, Dist: Bargarh
Canal Command: Hirakud System  GPS: 21.1833° N, 83.5833° E
=====================================================
PARAMETER                   VALUE       UNIT       RATING
-----------------------------------------------------
pH (1:2.5 Suspension)       5.80        --        Slightly Acidic (<6.5)
EC (Total Soluble Salts)    0.32        dS/m       Normal (<1.0)
Organic Carbon (OC)         0.52        %          Medium (0.50 - 0.75%)
Available Nitrogen (N)      240.0       kg/ha      Low (<280)
Available Phosphorus (P2O5)  15.8        kg/ha      Low (<23.0)
Available Potassium (K2O)   175.0       kg/ha      Medium (140-280)
Available Sulphur (S)       11.2        ppm        Medium
Available Zinc (Zn)         0.45        ppm        Deficient (<0.60)
Available Iron (Fe)          8.40        ppm        Sufficient (>4.5)
Available Boron (B)         0.42        ppm        Low (<0.50)
=====================================================
Remarks: Rice-wheat/rice-pulse tract. Low Nitrogen, Phosphorus, and Zinc. Lime application @ 250 kg/acre recommended.`,
    parameters: {
      pH: 5.8,
      EC: 0.32,
      OC: 0.52,
      N: 97, // kg/acre (~240 kg/ha)
      P: 6.4, // kg/acre (~15.8 kg/ha)
      K: 71, // kg/acre (~175 kg/ha)
      Zn: 0.45,
      Fe: 8.4,
      S: 11.2,
      B: 0.42,
      Cu: 0.6,
      Mn: 3.5,
    },
    recommendationsSummary: "Hirakud canal basin: Slightly acidic soil; requires DAP, split Urea, and Zinc Sulphate for high paddy yield.",
  },
  {
    id: "punjab_alluvial",
    title: "Indo-Gangetic Alluvial Soil Report",
    location: "Ludhiana, Punjab (Zone IV)",
    soilType: "Alluvial Loam",
    labName: "ICAR Regional Soil & Agronomy Testing Laboratory",
    reportNumber: "ST-PB-2026-8942",
    date: "2026-07-18",
    farmerName: "Gurpreet Singh",
    farmAreaAcre: 5.0,
    targetCrop: "wheat",
    extractedText: `=====================================================
ICAR REGIONAL SOIL HEALTH & AGRONOMY LABORATORY
GOVERNMENT OF INDIA - SOIL HEALTH SCHEME
Sample No: ST-PB-2026-8942    Date of Report: 18-07-2026
Farmer: Gurpreet Singh         Village: Jagraon, Dist: Ludhiana
Soil Texture: Alluvial Loam    GPS: 30.9010° N, 75.8573° E
=====================================================
PARAMETER                   VALUE       UNIT       RATING
-----------------------------------------------------
pH (1:2.5 Soil-Water)        7.20        --        Neutral / Normal
EC (Electrical Cond.)       0.45        dS/m       Safe / Normal (<1.0)
Organic Carbon (OC)         0.48        %          Low (<0.50%)
Available Nitrogen (N)      320.0       kg/ha      Medium (280-560)
Available Phosphorus (P2O5)  18.5        kg/ha      Low (<23.0)
Available Potassium (K2O)   190.0       kg/ha      Medium (140-280)
Available Sulphur (S)       12.4        ppm        Medium (10-20)
Available Zinc (Zn)         0.48        ppm        Deficient (<0.60)
Available Iron (Fe)          5.20        ppm        Sufficient (>4.5)
Available Manganese (Mn)    3.80        ppm        Sufficient (>2.0)
Available Copper (Cu)       0.65        ppm        Sufficient (>0.2)
Available Boron (B)         0.55        ppm        Sufficient (>0.5)
=====================================================
Remarks: Soil is neutral and free of salinity. Phosphorus and Zinc are deficient. Organic matter is low.`,
    parameters: {
      pH: 7.2,
      EC: 0.45,
      OC: 0.48,
      N: 130,
      P: 7.5,
      K: 77,
      Zn: 0.48,
      Fe: 5.2,
      S: 12.4,
      B: 0.55,
      Cu: 0.65,
      Mn: 3.8,
    },
    recommendationsSummary: "Deficient in P and Zn. Needs DAP + Zinc Sulphate with split Urea schedule.",
  },
  {
    id: "maharashtra_black",
    title: "Deccan Black Cotton Vertisol Report",
    location: "Nagpur / Vidarbha, Maharashtra",
    soilType: "Black Vertisol",
    labName: "Maharashtra State Agricultural Soil Testing Lab",
    reportNumber: "ST-MH-2026-3190",
    date: "2026-06-25",
    farmerName: "Rameshwar Patil",
    farmAreaAcre: 4.0,
    targetCrop: "cotton",
    extractedText: `=====================================================
MAHARASHTRA AGRI RESEARCH & SOIL TESTING CENTER
SOIL HEALTH CARD SCHEME (SHC)
Sample ID: ST-MH-2026-3190    Date: 25-06-2026
Farmer: Rameshwar Patil       Tehsil: Katol, Dist: Nagpur
Soil Type: Deep Black Clay    Zone: Central Vidarbha
=====================================================
PARAMETER                   VALUE       UNIT       RATING
-----------------------------------------------------
pH (Reaction)               8.25        --        Moderately Alkaline
EC (Salinity)               0.68        dS/m       Normal
Organic Carbon (OC)         0.38        %          Low (<0.50%)
Available Nitrogen (N)      210.0       kg/ha      Low (<280)
Available Phosphorus (P2O5)  14.2        kg/ha      Low (<23.0)
Available Potassium (K2O)   380.0       kg/ha      High (>280)
Available Sulphur (S)       8.50        ppm        Deficient (<10.0)
Available Zinc (Zn)         0.42        ppm        Deficient (<0.60)
Available Iron (Fe)          3.10        ppm        Deficient (<4.5)
Available Manganese (Mn)    4.20        ppm        Sufficient (>2.0)
Available Copper (Cu)       0.70        ppm        Sufficient (>0.2)
Available Boron (B)         0.40        ppm        Low (<0.5)
=====================================================
Remarks: High clay content with excellent moisture retention. Alkaline pH causes fixation of P, Fe, and Zn. Heavy in Potash.`,
    parameters: {
      pH: 8.25,
      EC: 0.68,
      OC: 0.38,
      N: 85,
      P: 5.7,
      K: 154,
      Zn: 0.42,
      Fe: 3.1,
      S: 8.5,
      B: 0.4,
      Cu: 0.7,
      Mn: 4.2,
    },
    recommendationsSummary: "High Potash reserve; requires high Nitrogen, Phosphorus, Zinc Sulphate, and Ferrous Sulphate foliar.",
  },
  {
    id: "andhra_red_loam",
    title: "South India Red Laterite Loam Report",
    location: "Guntur / Amaravati, Andhra Pradesh",
    soilType: "Red Loam",
    labName: "Acharya N.G. Ranga Agri University Soil Lab",
    reportNumber: "ST-AP-2026-6412",
    date: "2026-08-05",
    farmerName: "Venkata Rao",
    farmAreaAcre: 3.5,
    targetCrop: "chickpea",
    extractedText: `=====================================================
ANGRAU KRISHI VIGYAN KENDRA SOIL TESTING LAB
Sample No: ST-AP-2026-6412    Date: 05-08-2026
Farmer: Venkata Rao           District: Guntur, AP
Soil Texture: Red Sandy Loam  Drainage: Well Drained
=====================================================
PARAMETER                   VALUE       UNIT       RATING
-----------------------------------------------------
pH (1:2.5)                  5.65        --        Moderately Acidic (<6.0)
EC                          0.22        dS/m       Low / Normal
Organic Carbon (OC)         0.55        %          Medium (0.50 - 0.75%)
Available Nitrogen (N)      265.0       kg/ha      Low (<280)
Available Phosphorus (P2O5)  16.0        kg/ha      Low (<23)
Available Potassium (K2O)   135.0       kg/ha      Low (<140)
Available Sulphur (S)       15.0        ppm        Medium
Available Zinc (Zn)         0.75        ppm        Sufficient (>0.60)
Available Iron (Fe)          14.5        ppm        High (>4.5)
Available Manganese (Mn)    8.20        ppm        High
Available Copper (Cu)       0.55        ppm        Sufficient
Available Boron (B)         0.35        ppm        Deficient (<0.50)
=====================================================
Remarks: Acidic red soil with high iron/aluminum. Low in available Phosphorus and Potash. Lime amendment recommended.`,
    parameters: {
      pH: 5.65,
      EC: 0.22,
      OC: 0.55,
      N: 107,
      P: 6.5,
      K: 54,
      Zn: 0.75,
      Fe: 14.5,
      S: 15.0,
      B: 0.35,
      Cu: 0.55,
      Mn: 8.2,
    },
    recommendationsSummary: "Acidic soil: Apply 300-500 kg agricultural lime/acre with SSP and MOP to fix low P and K.",
  },
  {
    id: "rajasthan_sandy_arid",
    title: "Western Sandy Arid Soil Report",
    location: "Bikaner / Thar Basin, Rajasthan",
    soilType: "Sandy Arid",
    labName: "Rajasthan Arid Agriculture Research Centre",
    reportNumber: "ST-RJ-2026-1108",
    date: "2026-07-30",
    farmerName: "Kishore Dan",
    farmAreaAcre: 6.0,
    targetCrop: "mustard",
    extractedText: `=====================================================
RAJASTHAN STATE SOIL TESTING & CONSERVATION LAB
Sample ID: ST-RJ-2026-1108    Date: 30-07-2026
Farmer: Kishore Dan           District: Bikaner, Rajasthan
Soil Classification: Sandy Entisol / Desert Arid
=====================================================
PARAMETER                   VALUE       UNIT       RATING
-----------------------------------------------------
pH                          8.60        --        Highly Alkaline
EC (Salinity)               2.85        dS/m       Saline (>2.0 dS/m)
Organic Carbon (OC)         0.22        %          Very Low (<0.30%)
Available Nitrogen (N)      160.0       kg/ha      Very Low (<200)
Available Phosphorus (P2O5)  11.5        kg/ha      Very Low (<15)
Available Potassium (K2O)   240.0       kg/ha      Medium
Available Sulphur (S)       7.20        ppm        Deficient (<10.0)
Available Zinc (Zn)         0.35        ppm        Deficient (<0.60)
Available Iron (Fe)          2.40        ppm        Deficient (<4.5)
Available Manganese (Mn)    2.10        ppm        Sufficient
Available Copper (Cu)       0.30        ppm        Sufficient
Available Boron (B)         0.90        ppm        High / Saline
=====================================================
Remarks: Light sandy soil with high salinity and very low organic matter. Low water retention. Requires Gypsum and FYM.`,
    parameters: {
      pH: 8.6,
      EC: 2.85,
      OC: 0.22,
      N: 64,
      P: 4.6,
      K: 97,
      Zn: 0.35,
      Fe: 2.4,
      S: 7.2,
      B: 0.9,
      Cu: 0.3,
      Mn: 2.1,
    },
    recommendationsSummary: "Saline & alkaline sandy soil. Apply Farmyard Manure (FYM 2t/acre) + Gypsum and Zinc Sulphate.",
  },
];
