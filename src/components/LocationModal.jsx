import React, { useState, useEffect, useRef } from "react";
import {
  X,
  MapPin,
  Navigation,
  Globe,
  Search,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Sun,
  CloudRain,
  Droplets,
  Compass,
  ArrowRight,
} from "lucide-react";
import {
  detectLocationByGps,
  detectLocationByIp,
  searchLocations,
  fetchAgroWeather,
  saveLocation,
  KNOWN_AGRO_LOCATIONS,
} from "../services/weatherService";

const REGIONAL_QUICK_PICKS = [
  {
    region: "Odisha",
    locations: [
      { name: "Bhubaneswar, Odisha", lat: 20.2961, lon: 85.8245 },
      { name: "Cuttack, Odisha", lat: 20.4625, lon: 85.883 },
      { name: "Sambalpur, Odisha", lat: 21.4669, lon: 83.9812 },
      { name: "Bargarh, Odisha", lat: 21.33, lon: 83.62 },
      { name: "Kalahandi, Odisha", lat: 19.9075, lon: 83.1644 },
      { name: "Balasore, Odisha", lat: 21.4934, lon: 86.9135 },
    ],
  },
  {
    region: "North & Central India",
    locations: [
      { name: "Ludhiana, Punjab", lat: 30.90, lon: 75.85 },
      { name: "Karnal, Haryana", lat: 29.68, lon: 76.98 },
      { name: "Varanasi, UP", lat: 25.31, lon: 82.97 },
      { name: "Patna, Bihar", lat: 25.5941, lon: 85.1376 },
      { name: "Ranchi, Jharkhand", lat: 23.3441, lon: 85.3096 },
      { name: "Raipur, Chhattisgarh", lat: 21.2514, lon: 81.6296 },
      { name: "Indore, MP", lat: 22.71, lon: 75.85 },
    ],
  },
  {
    region: "West & South India",
    locations: [
      { name: "Nagpur, Maharashtra", lat: 21.14, lon: 79.08 },
      { name: "Pune, Maharashtra", lat: 18.52, lon: 73.85 },
      { name: "Rajkot, Gujarat", lat: 22.30, lon: 70.80 },
      { name: "Jaipur, Rajasthan", lat: 26.91, lon: 75.78 },
      { name: "Guntur, Andhra Pradesh", lat: 16.30, lon: 80.43 },
      { name: "Warangal, Telangana", lat: 17.96, lon: 79.59 },
      { name: "Mandya, Karnataka", lat: 12.52, lon: 76.89 },
    ],
  },
];

export default function LocationModal({
  isOpen,
  onClose,
  currentLocationName,
  currentWeather,
  currentMethod,
  onLocationSelected,
  t,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [isLocatingIp, setIsLocatingIp] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'info'|'success'|'error', text }
  const [activeTab, setActiveTab] = useState("Odisha");
  const searchTimeoutRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle Search Input with Debounce
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setStatusMessage(null);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!val || val.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchLocations(val);
        setSearchResults(results);
      } catch (err) {
        console.warn("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  };

  // Select a location from search results or quick picks
  const handleSelectLocation = async (item) => {
    setStatusMessage({ type: "info", text: `Fetching live weather & agronomy data for ${item.name}...` });
    try {
      const weather = await fetchAgroWeather(item.displayName || item.name, item.latitude || item.lat, item.longitude || item.lon);
      const locName = item.displayName || item.name;
      const lat = item.latitude || item.lat || weather.lat;
      const lon = item.longitude || item.lon || weather.lon;

      saveLocation({
        name: locName,
        lat,
        lon,
        method: "MANUAL",
      });

      if (onLocationSelected) {
        onLocationSelected({
          locationName: locName,
          latitude: lat,
          longitude: lon,
          weather,
          method: "MANUAL",
        });
      }

      setStatusMessage({ type: "success", text: `Location set to ${locName}!` });
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (e) {
      console.warn("Failed to set location:", e);
      setStatusMessage({ type: "error", text: "Failed to fetch weather for selected location. Please try again." });
    }
  };

  // Detect GPS
  const handleDetectGps = async () => {
    setIsLocatingGps(true);
    setStatusMessage({ type: "info", text: "Requesting high-accuracy GPS coordinates from your device..." });
    try {
      const res = await detectLocationByGps();
      if (res && res.success) {
        if (onLocationSelected) {
          onLocationSelected(res);
        }
        setStatusMessage({
          type: "success",
          text: `Exact GPS Detected: ${res.locationName} (Accuracy: ±${res.accuracy}m)`,
        });
        setTimeout(() => {
          onClose();
        }, 800);
      }
    } catch (err) {
      console.warn("GPS error:", err);
      let errMsg = "Could not access device GPS.";
      if (err.code === 1) {
        errMsg = "Location permission denied. Please allow location access in your browser address bar.";
      } else if (err.code === 2) {
        errMsg = "GPS position unavailable. Try network detection or search by city name below.";
      } else if (err.code === 3) {
        errMsg = "GPS request timed out. Please search your city or use network detection.";
      }
      setStatusMessage({ type: "error", text: errMsg });
    } finally {
      setIsLocatingGps(false);
    }
  };

  // Detect via IP
  const handleDetectIp = async () => {
    setIsLocatingIp(true);
    setStatusMessage({ type: "info", text: "Detecting location via network ISP gateway..." });
    try {
      const res = await detectLocationByIp();
      if (res && res.success) {
        if (onLocationSelected) {
          onLocationSelected(res);
        }
        setStatusMessage({ type: "success", text: `Network Detected: ${res.locationName}` });
        setTimeout(() => {
          onClose();
        }, 800);
      }
    } catch (err) {
      console.warn("IP error:", err);
      setStatusMessage({
        type: "error",
        text: "Could not auto-detect via network. Please type your city/district in the search box below.",
      });
    } finally {
      setIsLocatingIp(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-card-inner"
        style={{ maxWidth: "680px", padding: "1.75rem" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <span className="badge badge-success">📍 AgroVision™ Location Service</span>
              {currentMethod && (
                <span className="badge badge-info">
                  {currentMethod === "GPS" ? "🟢 GPS Verified" : currentMethod === "IP" ? "🌐 Network" : "📌 Selected"}
                </span>
              )}
            </div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--text-primary)", margin: 0 }}>
              Set Your Farm / Field Location
            </h2>
            <p style={{ fontSize: "0.82rem", color: "var(--text-dim)", marginTop: "0.25rem", margin: 0 }}>
              AgroVision calibrates real-time rainfall, temperature, fertilizer volatility, and local mandi prices for your exact district.
            </p>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            title="Close"
            style={{ width: "36px", height: "36px" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Status Toast / Alert */}
        {statusMessage && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              marginBottom: "1rem",
              fontSize: "0.83rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              background:
                statusMessage.type === "success"
                  ? "rgba(16, 185, 129, 0.15)"
                  : statusMessage.type === "error"
                  ? "rgba(244, 63, 94, 0.15)"
                  : "rgba(6, 182, 212, 0.15)",
              border:
                statusMessage.type === "success"
                  ? "1px solid rgba(16, 185, 129, 0.3)"
                  : statusMessage.type === "error"
                  ? "1px solid rgba(244, 63, 94, 0.3)"
                  : "1px solid rgba(6, 182, 212, 0.3)",
              color:
                statusMessage.type === "success"
                  ? "#34d399"
                  : statusMessage.type === "error"
                  ? "#fb7185"
                  : "#38bdf8",
            }}
          >
            {statusMessage.type === "error" ? (
              <AlertCircle size={17} />
            ) : statusMessage.type === "success" ? (
              <CheckCircle2 size={17} />
            ) : (
              <RefreshCw size={17} className="animate-spin" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Current Active Location Card */}
        {currentWeather && (
          <div
            style={{
              padding: "0.85rem 1.1rem",
              borderRadius: "var(--radius-md)",
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Current Active Location
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: "800", color: "var(--text-primary)" }}>
                📍 {currentLocationName || currentWeather.name}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.2rem" }}>
                Coordinates: {currentWeather.lat?.toFixed(4)}, {currentWeather.lon?.toFixed(4)} • Soil Zone:{" "}
                <span style={{ color: "#34d399", fontWeight: "600" }}>{currentWeather.soilAffinity || "Regional Loam"}</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "#34d399", fontFamily: "var(--font-mono)" }}>
                  {currentWeather.temp}°C
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                  RH {currentWeather.humidity}% • {currentWeather.season || "Kharif"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 1-Click Detection Buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleDetectGps}
            disabled={isLocatingGps || isLocatingIp}
            style={{
              padding: "0.7rem 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontSize: "0.88rem",
            }}
          >
            <Navigation size={17} className={isLocatingGps ? "animate-spin" : ""} />
            <span>{isLocatingGps ? "Detecting GPS..." : "🛰️ Detect Precise GPS"}</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleDetectIp}
            disabled={isLocatingGps || isLocatingIp}
            style={{
              padding: "0.7rem 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontSize: "0.88rem",
            }}
          >
            <Globe size={17} className={isLocatingIp ? "animate-spin" : ""} />
            <span>{isLocatingIp ? "Querying Network..." : "🌐 Auto-Detect via IP"}</span>
          </button>
        </div>

        {/* Or Search Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            margin: "0.5rem 0 1rem",
            color: "var(--text-dim)",
            fontSize: "0.78rem",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "var(--border-card)" }} />
          <span>OR SEARCH ANY CITY, TOWN OR DISTRICT</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border-card)" }} />
        </div>

        {/* Live Search Input */}
        <div style={{ position: "relative", marginBottom: "1rem" }}>
          <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }}>
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Type city, district or village (e.g., Bhubaneswar, Sambalpur, Kalahandi, Ludhiana...)"
            style={{
              width: "100%",
              padding: "0.8rem 2.8rem 0.8rem 2.8rem",
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-card)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-primary)",
              fontSize: "0.95rem",
              outline: "none",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
              style={{
                position: "absolute",
                right: "0.8rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "var(--text-dim)",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Real-time Search Suggestions */}
        {isSearching && (
          <div style={{ padding: "0.75rem", textAlign: "center", color: "var(--text-dim)", fontSize: "0.85rem" }}>
            <RefreshCw size={15} className="animate-spin" style={{ display: "inline-block", marginRight: "6px" }} />
            Searching agricultural zones & cities...
          </div>
        )}

        {searchResults.length > 0 && (
          <div
            style={{
              maxHeight: "220px",
              overflowY: "auto",
              border: "1px solid var(--border-glow)",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-tertiary)",
              marginBottom: "1.25rem",
            }}
          >
            {searchResults.map((item, idx) => (
              <button
                key={`${item.name}-${item.latitude}-${idx}`}
                type="button"
                onClick={() => handleSelectLocation(item)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "0.75rem 1rem",
                  background: "transparent",
                  border: "none",
                  borderBottom: idx < searchResults.length - 1 ? "1px solid var(--border-card)" : "none",
                  color: "var(--text-primary)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(16, 185, 129, 0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div>
                  <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "var(--text-primary)" }}>
                    📍 {item.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                    {[item.admin2, item.admin1, item.country].filter(Boolean).join(", ")}
                  </div>
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--accent-emerald)", fontFamily: "var(--font-mono)" }}>
                  {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}° ➔
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Quick-Pick Tabs for Major Agricultural Districts */}
        <div style={{ marginTop: "0.5rem" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            🌾 Select from Popular Agricultural Districts:
          </div>

          <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
            {REGIONAL_QUICK_PICKS.map((tab) => (
              <button
                key={tab.region}
                type="button"
                onClick={() => setActiveTab(tab.region)}
                style={{
                  padding: "0.35rem 0.75rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.78rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  border: activeTab === tab.region ? "1px solid var(--accent-emerald)" : "1px solid var(--border-card)",
                  background: activeTab === tab.region ? "rgba(16, 185, 129, 0.2)" : "var(--bg-tertiary)",
                  color: activeTab === tab.region ? "#34d399" : "var(--text-dim)",
                }}
              >
                {tab.region}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {REGIONAL_QUICK_PICKS.find((tab) => tab.region === activeTab)?.locations.map((loc) => {
              const isCurrent = currentLocationName && currentLocationName.toLowerCase().includes(loc.name.split(",")[0].toLowerCase());
              return (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => handleSelectLocation(loc)}
                  style={{
                    padding: "0.45rem 0.85rem",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.82rem",
                    fontWeight: isCurrent ? "700" : "500",
                    cursor: "pointer",
                    border: isCurrent ? "1px solid var(--accent-emerald)" : "1px solid var(--border-card)",
                    background: isCurrent ? "rgba(16, 185, 129, 0.15)" : "var(--bg-tertiary)",
                    color: isCurrent ? "#34d399" : "var(--text-primary)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent-emerald)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = isCurrent ? "var(--accent-emerald)" : "var(--border-card)")}
                >
                  <MapPin size={13} color={isCurrent ? "var(--accent-emerald)" : "var(--text-dim)"} />
                  <span>{loc.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            marginTop: "1.5rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border-card)",
          }}
        >
          <button type="button" className="btn btn-secondary" onClick={onClose} style={{ padding: "0.5rem 1.25rem" }}>
            Done / Close
          </button>
        </div>
      </div>
    </div>
  );
}
