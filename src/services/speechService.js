// Web Speech API Voice Synthesis (TTS) & Recognition (STT) Service

export const SpeechService = {
  synth: typeof window !== "undefined" ? window.speechSynthesis : null,
  recognition: null,
  currentUtterance: null,

  /**
   * Speaks text aloud in the specified language
   */
  speak(text, langCode = "en", onEnd = () => {}) {
    if (!this.synth) {
      console.warn("SpeechSynthesis not supported on this browser.");
      onEnd();
      return;
    }

    this.stop(); // Stop any ongoing speech

    // Clean text of markdown / symbols
    const cleanText = text
      .replace(/[*_#`~[\]()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Map langCode to standard BCP-47 language tags
    const langMap = {
      en: "en-US",
      hi: "hi-IN",
      pa: "pa-IN",
      bn: "bn-IN",
      te: "te-IN",
      ta: "ta-IN",
      mr: "mr-IN",
      gu: "gu-IN",
      kn: "kn-IN",
      es: "es-ES",
    };

    utterance.lang = langMap[langCode] || "en-US";
    utterance.rate = 0.95; // Slightly measured rate for clear agricultural numbers
    utterance.pitch = 1.0;

    // Pick best available voice for language
    if (this.synth.getVoices) {
      const voices = this.synth.getVoices();
      const matchedVoice = voices.find((v) => v.lang.startsWith(langCode) || v.lang === utterance.lang);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      onEnd();
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error:", e);
      this.currentUtterance = null;
      onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  },

  /**
   * Stop ongoing audio playback
   */
  stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  },

  /**
   * Checks if audio is currently speaking
   */
  isSpeaking() {
    return !!(this.synth && this.synth.speaking);
  },

  /**
   * Initialize and start Speech-to-Text Voice Recognition
   */
  startListening(langCode = "en", onResult = () => {}, onError = () => {}) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError("Speech recognition not supported in this browser. Please use text input.");
      return null;
    }

    const langMap = {
      en: "en-US",
      hi: "hi-IN",
      pa: "pa-IN",
      bn: "bn-IN",
      te: "te-IN",
      ta: "ta-IN",
      mr: "mr-IN",
      gu: "gu-IN",
      kn: "kn-IN",
      es: "es-ES",
    };

    const recognition = new SpeechRecognition();
    recognition.lang = langMap[langCode] || "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event) => {
      onError(event.error);
    };

    try {
      recognition.start();
      this.recognition = recognition;
      return recognition;
    } catch (e) {
      onError(e.message);
      return null;
    }
  },

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.recognition = null;
    }
  },
};

/**
 * Intelligent Agricultural Voice Q&A Assistant
 */
export function answerAgronomyQuestion(query, context = {}) {
  const q = query.toLowerCase();
  const { cropName = "Wheat", area = 1, soilParams = {} } = context;

  if (q.includes("urea") || q.includes("nitrogen") || q.includes("यूरिया")) {
    return `For ${cropName} on ${area} acre(s), apply Urea in 3 split doses: 1/3rd basal dose at sowing, 1/3rd at 25-30 days during tillering, and 1/3rd at 50-60 days during flowering for maximum nitrogen efficiency.`;
  }
  
  if (q.includes("dap") || q.includes("phosphorus") || q.includes("डीएपी")) {
    return `Apply DAP strictly as a basal dose at sowing, placing it 4 to 5 cm below the seed. Do not top-dress DAP as phosphorus is immobile in soil and needs root contact.`;
  }
  
  if (q.includes("ph") || q.includes("acid") || q.includes("alkaline") || q.includes("पीएच")) {
    const ph = soilParams.pH || 7.0;
    if (ph < 6.0) {
      return `Your soil pH is ${ph} (Acidic). Apply Agricultural Lime (Calcium Carbonate) @ 400-500 kg per acre 15 days before sowing to neutralize acidity.`;
    } else if (ph > 8.0) {
      return `Your soil pH is ${ph} (Alkaline/Sodic). Apply Agricultural Gypsum @ 400 kg per acre with deep irrigation to replace excess sodium ions.`;
    }
    return `Your soil pH is ${ph}, which is in the optimal neutral range (6.5 to 7.5). Nutrient absorption is at peak efficiency.`;
  }

  if (q.includes("profit") || q.includes("crop") || q.includes("munafa") || q.includes("फसल") || q.includes("मुनाफा")) {
    return `Based on current soil parameters, high-return crops include Mustard, Wheat, and Vegetables like Tomato or Potato with net profits ranging from ₹35,000 to ₹75,000 per acre depending on season and water availability.`;
  }

  if (q.includes("organic") || q.includes("carbon") || q.includes("vermicompost") || q.includes("जैविक")) {
    return `To boost soil organic carbon, incorporate 1.5 tonnes of enriched Vermicompost per acre and sow Dhaincha (Sesbania) green manure during summer fallow.`;
  }

  if (q.includes("disease") || q.includes("pest") || q.includes("spray") || q.includes("दवा") || q.includes("कीट")) {
    return `Use our Pest AI Vision camera scanner to take a photo of the infected leaf. The AI will detect the exact pathogen and prescribe targeted chemical dosages or neem-based bio-fungicides.`;
  }

  return `Based on your soil testing profile for ${cropName} (${area} acre), follow the 3-stage fertilizer timetable and maintain soil organic carbon with biofertilizers for high yields.`;
}
