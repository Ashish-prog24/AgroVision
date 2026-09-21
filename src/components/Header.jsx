import React from "react";
import { Sprout, Sun, Moon, CloudRain, Volume2, Award, Globe, Mic } from "lucide-react";
import { LANGUAGES } from "../data/translations";

export default function Header({
  language,
  setLanguage,
  theme,
  setTheme,
  t,
  onOpenSoilCard,
  onToggleVoiceWidget,
  isSpeaking,
  onStopVoice,
  weatherData,
  onDetectLocation,
  isLocating,
  locationMethod,
}) {
  return (
    <header className="app-header">
      {/* Brand */}
      <div className="brand-section">
        <div className="brand-logo-icon">
          <Sprout size={26} strokeWidth={2.4} />
        </div>
        <div className="brand-text">
          <h1>
            AgroVision<span style={{ fontSize: "0.85rem", color: "#10b981", verticalAlign: "super" }}>AI</span>
          </h1>
          <p>{t.appSubtitle || "Precision Soil Health & Agronomy Advisory"}</p>
        </div>
      </div>

      {/* Center Live Weather / Agro-Ecological Condition */}
      <button
        type="button"
        className="weather-badge"
        onClick={onDetectLocation}
        title="Click to re-detect your present GPS location and refresh local weather"
        style={{
          cursor: "pointer",
          border: isLocating ? "1px solid var(--accent-amber)" : "1px solid rgba(16, 185, 129, 0.3)",
          background: isLocating ? "rgba(245, 158, 11, 0.1)" : "rgba(16, 185, 129, 0.08)",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.45rem",
          transition: "all 0.2s ease",
        }}
      >
        <CloudRain size={16} color={isLocating ? "var(--accent-amber)" : "var(--accent-emerald)"} className={isLocating ? "animate-spin" : ""} />
        <span>
          {isLocating
            ? "Detecting your present location..."
            : weatherData
            ? `${weatherData.name} • ${weatherData.temp}°C • RH ${weatherData.humidity}% (${weatherData.season || "Agro-Zone"})`
            : "Live Weather Sensor • Connecting..."}
        </span>
        {locationMethod === "GPS" && (
          <span style={{ fontSize: "0.68rem", background: "#10b981", color: "#064e3b", padding: "1px 6px", borderRadius: "999px", fontWeight: "800" }}>
            GPS
          </span>
        )}
      </button>

      {/* Controls & Actions */}
      <div className="header-controls">
        {/* Language Picker */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <Globe size={16} color="var(--accent-emerald)" />
          <select
            className="custom-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Select Language"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>
        </div>

        {/* Voice Assistant Toggle */}
        <button
          className={`btn ${isSpeaking ? "btn-accent" : "btn-secondary"}`}
          onClick={onToggleVoiceWidget}
          title="Interactive Voice Assistant"
          style={{ padding: "0.45rem 0.9rem" }}
        >
          <Mic size={16} />
          <span>{t.voiceAssistant || "AgriBot Voice"}</span>
        </button>

        {/* Audio Stop Button (shown if speaking) */}
        {isSpeaking && (
          <button
            className="btn btn-secondary"
            onClick={onStopVoice}
            title="Stop Audio"
            style={{ color: "#f43f5e", borderColor: "#f43f5e", padding: "0.45rem 0.75rem" }}
          >
            <Volume2 size={16} />
            <span>Stop</span>
          </button>
        )}

        {/* Soil Health Card Certificate Modal Button */}
        <button
          className="btn btn-primary"
          onClick={onOpenSoilCard}
          style={{ padding: "0.45rem 1rem" }}
        >
          <Award size={16} />
          <span>{t.tabSoilHealthCard || "Soil Card"}</span>
        </button>

        {/* Dark/Light Theme Toggle */}
        <button
          className="btn-icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={`Switch to ${theme === "dark" ? "Daylight" : "Dark"} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
