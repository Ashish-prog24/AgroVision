// Sample Disease Visual Cards with SVG Leaf Renderers for 1-Click CNN Inspection
export const SAMPLE_DISEASE_CARDS = [
  {
    id: "sample_tomato_lb",
    diseaseId: "tomato_late_blight",
    title: "Tomato Leaf - Late Blight",
    crop: "Tomato",
    severityRating: "High (Critical)",
    confidence: 97.4,
    leafPreviewColor: "#2b4022",
    lesionColor: "#1a120b",
    svgVisual: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="leaf-svg">
      <path d="M100 15 C40 40, 10 100, 30 160 C50 190, 80 185, 100 195 C120 185, 150 190, 170 160 C190 100, 160 40, 100 15 Z" fill="#3c6e47" stroke="#254d2e" stroke-width="2"/>
      <path d="M100 15 Q100 100 100 195" stroke="#234a2c" stroke-width="2" fill="none"/>
      <!-- Water-soaked necrotic black-brown late blight lesions -->
      <path d="M40 70 Q60 50 85 75 Q70 105 35 95 Z" fill="#26170d" opacity="0.88" stroke="#d4a373" stroke-width="1.5" stroke-dasharray="3,2"/>
      <path d="M110 110 Q145 90 160 120 Q135 155 105 135 Z" fill="#1e130a" opacity="0.92" stroke="#d4a373" stroke-width="1.5"/>
      <circle cx="65" cy="80" r="14" fill="#150a04" opacity="0.95"/>
      <circle cx="130" cy="125" r="18" fill="#120803" opacity="0.95"/>
      <!-- Downy fungal white bloom edge -->
      <ellipse cx="65" cy="92" rx="10" ry="4" fill="#eae8e1" opacity="0.65"/>
      <ellipse cx="140" cy="140" rx="12" ry="5" fill="#eae8e1" opacity="0.65"/>
    </svg>`,
    boundingCoords: { x: "18%", y: "26%", width: "68%", height: "55%" },
  },
  {
    id: "sample_rice_blast",
    diseaseId: "rice_blast",
    title: "Rice Leaf - Blast Lesions",
    crop: "Rice",
    severityRating: "Critical",
    confidence: 98.8,
    leafPreviewColor: "#395b36",
    lesionColor: "#6c584c",
    svgVisual: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="leaf-svg">
      <!-- Narrow long blade of rice paddy leaf -->
      <path d="M100 10 C75 60, 70 140, 85 195 C115 195, 130 140, 125 60 C120 25, 105 10, 100 10 Z" fill="#4d7c0f" stroke="#365314" stroke-width="2"/>
      <line x1="100" y1="10" x2="100" y2="195" stroke="#365314" stroke-width="1.5"/>
      <!-- Spindle diamond shaped eye-spots -->
      <path d="M100 50 C90 60, 90 75, 100 85 C110 75, 110 60, 100 50 Z" fill="#8d734a" stroke="#4a1505" stroke-width="1.5"/>
      <circle cx="100" cy="67" r="4" fill="#f5f5f4"/>
      
      <path d="M96 110 C82 122, 82 140, 96 152 C110 140, 110 122, 96 110 Z" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
      <circle cx="96" cy="131" r="5" fill="#e7e5e4"/>
      
      <path d="M104 165 C96 172, 96 182, 104 190 C112 182, 112 172, 104 165 Z" fill="#78350f" stroke="#451a03" stroke-width="1"/>
    </svg>`,
    boundingCoords: { x: "32%", y: "22%", width: "36%", height: "66%" },
  },
  {
    id: "sample_wheat_rust",
    diseaseId: "wheat_stripe_rust",
    title: "Wheat Flag Leaf - Yellow Rust",
    crop: "Wheat",
    severityRating: "Critical (Airborne)",
    confidence: 96.5,
    leafPreviewColor: "#455938",
    lesionColor: "#eab308",
    svgVisual: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="leaf-svg">
      <path d="M100 5 C75 50, 75 150, 85 195 C115 195, 125 150, 125 50 Z" fill="#4d7c0f" stroke="#365314" stroke-width="2"/>
      <line x1="100" y1="5" x2="100" y2="195" stroke="#365314" stroke-width="1.5"/>
      <!-- Linear parallel yellow stripe rust pustules -->
      <g fill="#eab308" stroke="#ca8a04" stroke-width="0.5">
        <rect x="88" y="35" width="4" height="28" rx="2"/>
        <rect x="88" y="70" width="4" height="35" rx="2"/>
        <rect x="88" y="115" width="4" height="40" rx="2"/>
        <rect x="94" y="50" width="3" height="45" rx="1.5"/>
        <rect x="94" y="105" width="3" height="35" rx="1.5"/>
        <rect x="105" y="40" width="3.5" height="50" rx="1.5"/>
        <rect x="105" y="100" width="3.5" height="45" rx="1.5"/>
        <rect x="112" y="60" width="4" height="30" rx="2"/>
        <rect x="112" y="98" width="4" height="40" rx="2"/>
      </g>
    </svg>`,
    boundingCoords: { x: "36%", y: "15%", width: "28%", height: "72%" },
  },
  {
    id: "sample_cotton_clcuv",
    diseaseId: "cotton_leaf_curl",
    title: "Cotton Leaf - Leaf Curl Virus",
    crop: "Cotton",
    severityRating: "High",
    confidence: 95.2,
    leafPreviewColor: "#3d5a32",
    lesionColor: "#84cc16",
    svgVisual: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="leaf-svg">
      <!-- Palmately lobed crinkled cotton leaf -->
      <path d="M100 20 Q120 50 150 40 Q145 75 180 90 Q145 115 150 150 Q120 140 100 185 Q80 140 50 150 Q55 115 20 90 Q55 75 50 40 Q80 50 100 20 Z" fill="#4d7c0f" stroke="#3f6212" stroke-width="2"/>
      <!-- Upward cupping & yellowed thickened vein network -->
      <path d="M100 185 Q100 100 100 30" stroke="#bef264" stroke-width="3" fill="none"/>
      <path d="M100 110 Q140 90 170 90" stroke="#bef264" stroke-width="2.5" fill="none"/>
      <path d="M100 110 Q60 90 30 90" stroke="#bef264" stroke-width="2.5" fill="none"/>
      <path d="M100 135 Q135 130 145 145" stroke="#bef264" stroke-width="2" fill="none"/>
      <path d="M100 135 Q65 130 55 145" stroke="#bef264" stroke-width="2" fill="none"/>
      <ellipse cx="140" cy="85" rx="10" ry="15" fill="#facc15" opacity="0.3"/>
      <ellipse cx="60" cy="85" rx="10" ry="15" fill="#facc15" opacity="0.3"/>
    </svg>`,
    boundingCoords: { x: "12%", y: "15%", width: "76%", height: "70%" },
  },
  {
    id: "sample_maize_faw",
    diseaseId: "maize_fall_armyworm",
    title: "Maize Whorl - Fall Armyworm",
    crop: "Maize",
    severityRating: "Severe Pest Infestation",
    confidence: 98.2,
    leafPreviewColor: "#36592d",
    lesionColor: "#a16207",
    svgVisual: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="leaf-svg">
      <path d="M30 190 Q60 80 100 20 Q140 80 170 190 Q100 160 30 190 Z" fill="#4d7c0f" stroke="#365314" stroke-width="2"/>
      <line x1="100" y1="20" x2="100" y2="180" stroke="#365314" stroke-width="1.5"/>
      <!-- Window-pane tears and frass pellets -->
      <ellipse cx="75" cy="90" rx="12" ry="7" fill="#1c1917" opacity="0.8"/>
      <ellipse cx="125" cy="110" rx="15" ry="9" fill="#1c1917" opacity="0.8"/>
      <ellipse cx="85" cy="140" rx="10" ry="5" fill="#1c1917" opacity="0.8"/>
      <!-- Yellow-brown frass / fecal sawdust particles -->
      <circle cx="100" cy="120" r="3" fill="#ca8a04"/>
      <circle cx="106" cy="124" r="2.5" fill="#ca8a04"/>
      <circle cx="94" cy="128" r="3.5" fill="#ca8a04"/>
      <circle cx="102" cy="134" r="2" fill="#ca8a04"/>
      <circle cx="90" cy="115" r="2.5" fill="#ca8a04"/>
      <circle cx="112" cy="118" r="3" fill="#ca8a04"/>
      <!-- Armyworm larva outline -->
      <path d="M88 135 Q105 130 115 145" stroke="#713f12" stroke-width="5" stroke-linecap="round" fill="none"/>
    </svg>`,
    boundingCoords: { x: "28%", y: "30%", width: "45%", height: "50%" },
  },
  {
    id: "sample_healthy",
    diseaseId: "healthy_crop",
    title: "Healthy Leaf - Optimal Vigor",
    crop: "All Crops",
    severityRating: "None (Healthy)",
    confidence: 99.4,
    leafPreviewColor: "#15803d",
    lesionColor: "#22c55e",
    svgVisual: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="leaf-svg">
      <path d="M100 15 C50 45, 20 95, 35 155 C50 185, 80 180, 100 195 C120 180, 150 185, 165 155 C180 95, 150 45, 100 15 Z" fill="#16a34a" stroke="#15803d" stroke-width="2"/>
      <path d="M100 15 Q100 100 100 195" stroke="#14532d" stroke-width="2.5" fill="none"/>
      <path d="M100 60 Q130 50 145 55" stroke="#14532d" stroke-width="1.5" fill="none"/>
      <path d="M100 60 Q70 50 55 55" stroke="#14532d" stroke-width="1.5" fill="none"/>
      <path d="M100 100 Q140 85 155 95" stroke="#14532d" stroke-width="1.5" fill="none"/>
      <path d="M100 100 Q60 85 45 95" stroke="#14532d" stroke-width="1.5" fill="none"/>
      <path d="M100 140 Q135 125 150 135" stroke="#14532d" stroke-width="1.5" fill="none"/>
      <path d="M100 140 Q65 125 50 135" stroke="#14532d" stroke-width="1.5" fill="none"/>
    </svg>`,
    boundingCoords: { x: "15%", y: "15%", width: "70%", height: "70%" },
  },
];
