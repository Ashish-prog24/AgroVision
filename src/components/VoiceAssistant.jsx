import React, { useState } from "react";
import { Mic, MicOff, Volume2, VolumeX, Send, Bot, Sparkles, X } from "lucide-react";
import { SpeechService, answerAgronomyQuestion } from "../services/speechService";

export default function VoiceAssistant({
  language,
  t,
  soilParams,
  selectedCrop,
  farmAreaAcre,
  fertilizerPrescription,
  onClose,
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "bot",
      text: `Namaste! I am your AI Agronomist Voice Assistant. You can speak or type in any language to ask about fertilizer doses, soil pH amendments, profitable crops, or pest treatments!`,
    },
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Handle Speech Recognition Voice Input
  const handleToggleListening = () => {
    if (isListening) {
      SpeechService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      SpeechService.startListening(
        language,
        (spokenText) => {
          setIsListening(false);
          setTranscript(spokenText);
          handleProcessQuery(spokenText);
        },
        (error) => {
          setIsListening(false);
          console.warn("Speech recognition notice:", error);
        }
      );
    }
  };

  // Process Query & Synthesize Answer
  const handleProcessQuery = (queryText) => {
    if (!queryText.trim()) return;

    const userMessage = { sender: "user", text: queryText };
    const answerText = answerAgronomyQuestion(queryText, {
      cropName: selectedCrop?.name || "Wheat",
      area: farmAreaAcre,
      soilParams,
      fertilizerPrescription,
    });

    const botMessage = { sender: "bot", text: answerText };
    setChatHistory((prev) => [...prev, userMessage, botMessage]);
    setTranscript("");

    // Speak answer aloud
    setIsSpeaking(true);
    SpeechService.speak(answerText, language, () => {
      setIsSpeaking(false);
    });
  };

  // Read entire Fertilizer & Soil Advisory summary
  const handleNarrateFullAdvisory = () => {
    const summary = `Soil Health Report Summary: Soil pH is ${soilParams.pH || 7.0}, Organic carbon is ${soilParams.OC || 0.5} percent. For ${farmAreaAcre} acre of ${selectedCrop?.name || "Wheat"}, our recommendation is: Apply ${fertilizerPrescription?.totalFarm?.ureaKg || 0} kg of Urea, ${fertilizerPrescription?.totalFarm?.dapKg || 0} kg of DAP, and ${fertilizerPrescription?.totalFarm?.mopKg || 0} kg of MOP in three split doses. First dose at sowing, second at tillering, and third at flowering.`;
    
    setIsSpeaking(true);
    SpeechService.speak(summary, language, () => {
      setIsSpeaking(false);
    });
  };

  const handleStopSpeech = () => {
    SpeechService.stop();
    setIsSpeaking(false);
  };

  return (
    <div className="glass-panel voice-widget-card" style={{ marginBottom: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <Bot size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-primary)" }}>
              {t.voiceAssistant || "AgriBot Voice Assistant"}
            </h3>
            <span style={{ fontSize: "0.75rem", color: "var(--accent-emerald)" }}>
              ● Multilingual Speech-to-Text & Narration Active ({language.toUpperCase()})
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button
            className="btn btn-secondary"
            onClick={handleNarrateFullAdvisory}
            style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem" }}
            title="Read out fertilizer and soil advice"
          >
            <Volume2 size={15} />
            <span>{t.voiceSpeakSummary || "Listen to Advisory"}</span>
          </button>

          {isSpeaking && (
            <button
              className="btn btn-secondary"
              onClick={handleStopSpeech}
              style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem", color: "#f43f5e", borderColor: "#f43f5e" }}
            >
              <VolumeX size={15} />
              <span>{t.voiceStop || "Stop"}</span>
            </button>
          )}

          {onClose && (
            <button className="btn-icon" onClick={onClose} style={{ width: "32px", height: "32px" }}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div
        style={{
          maxHeight: "180px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          padding: "0.75rem",
          background: "var(--bg-tertiary)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-card)",
          marginBottom: "1rem",
        }}
      >
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              background: msg.sender === "user" ? "rgba(16, 185, 129, 0.25)" : "rgba(255, 255, 255, 0.05)",
              border: msg.sender === "user" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid var(--border-card)",
              borderRadius: "12px",
              padding: "0.6rem 0.9rem",
              maxWidth: "85%",
              fontSize: "0.85rem",
              color: "var(--text-primary)",
            }}
          >
            <strong>{msg.sender === "user" ? "🧑🌾 You: " : "🤖 AgriBot: "}</strong>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Voice Input & Query Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleProcessQuery(transcript);
        }}
        style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}
      >
        <button
          type="button"
          onClick={handleToggleListening}
          className={`btn ${isListening ? "btn-accent voice-mic-active" : "btn-primary"}`}
          style={{ width: "44px", height: "44px", padding: 0, borderRadius: "50%", flexShrink: 0 }}
          title={isListening ? "Listening... Click to stop" : "Speak your question"}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <input
          type="text"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={isListening ? (t.voiceListening || "Listening...") : (t.voiceAskPlaceholder || "Ask a question in your language...")}
          style={{
            flex: 1,
            padding: "0.75rem 1.1rem",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-card)",
            borderRadius: "var(--radius-full)",
            color: "var(--text-primary)",
            fontSize: "0.88rem",
            outline: "none",
          }}
        />

        <button type="submit" className="btn btn-secondary" style={{ padding: "0.7rem 1.1rem" }}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
