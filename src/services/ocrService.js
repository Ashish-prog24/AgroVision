import { createWorker } from "tesseract.js";

/**
 * Preprocesses an image on an HTML5 canvas to enhance text contrast for OCR
 */
export async function preprocessImageForOcr(fileOrUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      // Upscale if small for better character resolution
      const scale = Math.max(1, Math.min(2, 1800 / Math.max(img.width, img.height)));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;
      
      // Grayscale & high-contrast binarization thresholding
      for (let i = 0; i < d.length; i += 4) {
        const avg = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        // Contrast enhancement
        const contrasted = avg < 140 ? Math.max(0, avg * 0.7) : Math.min(255, avg * 1.25);
        d[i] = contrasted;
        d[i + 1] = contrasted;
        d[i + 2] = contrasted;
      }
      
      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = (err) => reject(err);
    
    if (typeof fileOrUrl === "string") {
      img.src = fileOrUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => (img.src = e.target.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(fileOrUrl);
    }
  });
}

/**
 * Parses raw text extracted from a soil report using NLP regex patterns
 */
export function extractSoilParametersFromText(rawText) {
  const text = rawText.replace(/\r\n/g, "\n");
  
  const params = {
    pH: 7.0,
    EC: 0.5,
    OC: 0.5,
    N: 100, // kg/acre
    P: 15,  // kg/acre
    K: 80,  // kg/acre
    Zn: 0.6,
    Fe: 4.5,
    S: 10.0,
    B: 0.5,
    Cu: 0.5,
    Mn: 2.5,
  };

  let extractedCount = 0;

  // 1. pH extraction
  const phMatch = text.match(/(?:pH|reaction)[\s:\-=|]+([0-9]+(?:\.[0-9]+)?)/i);
  if (phMatch && phMatch[1]) {
    const val = parseFloat(phMatch[1]);
    if (val >= 3.0 && val <= 11.0) {
      params.pH = Number(val.toFixed(2));
      extractedCount++;
    }
  }

  // 2. EC (Electrical Conductivity) extraction
  const ecMatch = text.match(/(?:EC|electrical\s*cond(?:uctivity)?|salinity)[\s:\-=|]+([0-9]+(?:\.[0-9]+)?)/i);
  if (ecMatch && ecMatch[1]) {
    const val = parseFloat(ecMatch[1]);
    if (val >= 0.01 && val <= 20.0) {
      params.EC = Number(val.toFixed(2));
      extractedCount++;
    }
  }

  // 3. Organic Carbon (OC %)
  const ocMatch = text.match(/(?:OC|organic\s*carbon)[\s:\-=|]+([0-9]+(?:\.[0-9]+)?)/i);
  if (ocMatch && ocMatch[1]) {
    const val = parseFloat(ocMatch[1]);
    if (val >= 0.05 && val <= 8.0) {
      params.OC = Number(val.toFixed(2));
      extractedCount++;
    }
  }

  // 4. Nitrogen (N)
  const nMatch = text.match(/(?:Available\s*)?Nitrogen[\s\(\)N]*[\s:\-=|]+([0-9]+(?:\.[0-9]+)?)/i) ||
                 text.match(/\bN\b[\s:\-=|]+([0-9]+(?:\.[0-9]+)?)/i);
  if (nMatch && nMatch[1]) {
    let val = parseFloat(nMatch[1]);
    // If given in kg/ha, convert to kg/acre (~divide by 2.47)
    if (val > 150) {
      val = val / 2.47;
    }
    params.N = Math.round(val);
    extractedCount++;
  }

  // 5. Phosphorus (P or P2O5)
  const pMatch = text.match(/(?:Available\s*)?Phosphorus[\s\(\)P2O5]*[\s:\-=|]+([0-9]+(?:\.[0-9]+)?)/i) ||
                 text.match(/\bP2O5\b[\s:\-=|]+([0-9]+(?:\.[0-9]+)?)/i);
  if (pMatch && pMatch[1]) {
    let val = parseFloat(pMatch[1]);
    if (val > 25) {
      val = val / 2.47;
    }
    params.P = Math.round(val);
    extractedCount++;
  }

  // 6. Potassium (K or K2O)
  const kMatch = text.match(/(?:Available\s*)?Potassium[\s\(\)K2O]*[\s:\-=|]+([0-9]+(?:\.[0-9]+)?)/i) ||
                 text.match(/\bK2O\b[\s:\-=|]+([0-9]+(?:\.[0-9]+)?)/i);
  if (kMatch && kMatch[1]) {
    let val = parseFloat(kMatch[1]);
    if (val > 150) {
      val = val / 2.47;
    }
    params.K = Math.round(val);
    extractedCount++;
  }

  // 7. Micronutrients (Zn, Fe, S, B, Cu, Mn) in ppm
  const znMatch = text.match(/(?:Zinc|Zn)[\s:\-=|]+([0-9]+(?:\.[0-9]+)?)/i);
  if (znMatch) { params.Zn = Number(parseFloat(znMatch[1]).toFixed(2)); extractedCount++; }

  const feMatch = text.match(/(?:Iron|Fe)[\s:\-=|]+([0-9]+(?:\.[0-9]+)?)/i);
  if (feMatch) { params.Fe = Number(parseFloat(feMatch[1]).toFixed(2)); extractedCount++; }

  const sMatch = text.match(/(?:Sulphur|Sulfur|S)[\s:\-=|]+([0-9]+(?:\.[0-9]+)?)/i);
  if (sMatch) { params.S = Number(parseFloat(sMatch[1]).toFixed(2)); extractedCount++; }

  const bMatch = text.match(/(?:Boron|B)[\s:\-=|]+([0-9]+(?:\.[0-9]+)?)/i);
  if (bMatch) { params.B = Number(parseFloat(bMatch[1]).toFixed(2)); extractedCount++; }

  const cuMatch = text.match(/(?:Copper|Cu)[\s:\-=|]+([0-9]+(?:\.[0-9]+)?)/i);
  if (cuMatch) { params.Cu = Number(parseFloat(cuMatch[1]).toFixed(2)); extractedCount++; }

  const mnMatch = text.match(/(?:Manganese|Mn)[\s:\-=|]+([0-9]+(?:\.[0-9]+)?)/i);
  if (mnMatch) { params.Mn = Number(parseFloat(mnMatch[1]).toFixed(2)); extractedCount++; }

  return {
    params,
    confidence: Math.min(99, Math.max(65, 50 + extractedCount * 7)),
    extractedCount,
  };
}

/**
 * Execute full OCR pipeline on an image or PDF file
 */
export async function runSoilReportOcr(fileOrUrl, onProgress = () => {}) {
  try {
    onProgress({ status: "Preprocessing image...", progress: 0.2 });
    const processedDataUrl = await preprocessImageForOcr(fileOrUrl);
    
    onProgress({ status: "Initializing OCR Engine...", progress: 0.4 });
    const worker = await createWorker("eng");
    
    onProgress({ status: "Extracting text from report...", progress: 0.7 });
    const ret = await worker.recognize(processedDataUrl);
    await worker.terminate();
    
    const rawText = ret.data.text;
    onProgress({ status: "Parsing agronomic parameters...", progress: 0.95 });
    
    const extractionResult = extractSoilParametersFromText(rawText);
    
    return {
      success: true,
      rawText,
      parameters: extractionResult.params,
      confidence: extractionResult.confidence,
    };
  } catch (err) {
    console.warn("Tesseract OCR fallback triggered:", err);
    // Graceful fallback for demo or network restricted environments
    return {
      success: false,
      error: err.message,
    };
  }
}
