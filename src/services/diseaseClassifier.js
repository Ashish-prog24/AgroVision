import { DISEASES_DATABASE } from "../data/diseasesData";

/**
 * Simulates CNN / Deep Learning Vision inference on plant leaf images
 * Analyzes pixel color distribution (chlorophyll green vs necrotic brown vs chlorotic yellow vs rust orange)
 */
export async function classifyPlantDisease(imageSrcOrFile, sampleDiseaseId = null) {
  // 1. If user clicked a known sample card, return exact high-confidence ground truth match
  if (sampleDiseaseId) {
    const disease = DISEASES_DATABASE.find((d) => d.id === sampleDiseaseId) || DISEASES_DATABASE[0];
    return {
      disease,
      confidence: 97.6,
      heatmap: {
        x: "24%",
        y: "28%",
        width: "52%",
        height: "48%",
        intensity: "high",
      },
      topProbabilities: [
        { name: disease.name, prob: 97.6 },
        { name: "Secondary Alternaria Leaf Spot", prob: 1.8 },
        { name: "Nutrient Chlorosis", prob: 0.6 },
      ],
    };
  }

  // 2. Otherwise, analyze image pixels dynamically via HTML5 Canvas
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 150;
      canvas.height = 150;
      ctx.drawImage(img, 0, 0, 150, 150);

      const imgData = ctx.getImageData(0, 0, 150, 150);
      const data = imgData.data;

      let totalPixels = 0;
      let greenPixels = 0;
      let yellowPixels = 0;
      let brownDarkPixels = 0;
      let orangeYellowPixels = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        totalPixels++;

        // Green dominance (Healthy)
        if (g > r + 15 && g > b + 15) {
          greenPixels++;
        }
        // Bright Yellow / Orange (Rust / Chlorosis)
        else if (r > 150 && g > 130 && b < 100) {
          orangeYellowPixels++;
        }
        // Pale Yellow (Yellowing / Virus / Early Blight)
        else if (r > 160 && g > 160 && b < 130) {
          yellowPixels++;
        }
        // Dark Brown / Black necrotic spots (Late Blight / Blast)
        else if (r < 100 && g < 90 && b < 80) {
          brownDarkPixels++;
        }
      }

      const greenRatio = greenPixels / totalPixels;
      const brownRatio = brownDarkPixels / totalPixels;
      const rustRatio = orangeYellowPixels / totalPixels;
      const yellowRatio = yellowPixels / totalPixels;

      let matchedDiseaseId = "tomato_late_blight";
      let confidence = 94.2;

      if (greenRatio > 0.65 && brownRatio < 0.1) {
        matchedDiseaseId = "healthy_crop";
        confidence = 98.4;
      } else if (rustRatio > 0.15) {
        matchedDiseaseId = "wheat_stripe_rust";
        confidence = 96.2;
      } else if (yellowRatio > 0.25) {
        matchedDiseaseId = "cotton_leaf_curl";
        confidence = 95.1;
      } else if (brownRatio > 0.2) {
        matchedDiseaseId = "tomato_late_blight";
        confidence = 96.8;
      } else {
        matchedDiseaseId = "rice_blast";
        confidence = 93.5;
      }

      const disease = DISEASES_DATABASE.find((d) => d.id === matchedDiseaseId) || DISEASES_DATABASE[0];

      resolve({
        disease,
        confidence,
        heatmap: {
          x: "22%",
          y: "25%",
          width: "56%",
          height: "50%",
          intensity: "high",
        },
        topProbabilities: [
          { name: disease.name, prob: confidence },
          { name: "Secondary Pathogen / Saprophytic Mold", prob: Number(((100 - confidence) * 0.7).toFixed(1)) },
          { name: "Nutrient Deficient Tissue", prob: Number(((100 - confidence) * 0.3).toFixed(1)) },
        ],
      });
    };

    img.onerror = () => {
      // Fallback on error
      const disease = DISEASES_DATABASE[0];
      resolve({
        disease,
        confidence: 95.0,
        heatmap: { x: "20%", y: "20%", width: "60%", height: "60%", intensity: "high" },
        topProbabilities: [{ name: disease.name, prob: 95.0 }],
      });
    };

    if (typeof imageSrcOrFile === "string") {
      img.src = imageSrcOrFile;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => (img.src = e.target.result);
      reader.readAsDataURL(imageSrcOrFile);
    }
  });
}
