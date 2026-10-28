import { useState } from "react";
import { CITY_PRESETS } from "../utils/geo";
import { MapPin, Navigation, ChevronDown, ChevronUp } from "lucide-react";

function LocationPicker({
  locationName,
  coords,
  loading,
  error,
  onRequestLocation,
  onManualSelect,
}) {
  const [selectedCity, setSelectedCity] = useState("");
  const [showManual, setShowManual] = useState(false);

  const handleCitySelect = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    if (cityName) {
      onManualSelect(cityName);
    }
  };

  return (
    <div style={{
      background: "#F8FAFC",
      border: "1px solid #E2E8F0",
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "20px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#ECFDF5", color: "#15803D", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MapPin size={18} />
          </div>
          <div>
            <span style={{ fontSize: "0.8rem", color: "#64748B", display: "block" }}>Location Hub:</span>
            <strong style={{ color: coords ? "#15803D" : "#0F172A", fontSize: "0.92rem" }}>
              {locationName ? locationName : coords ? `Lat: ${coords.lat.toFixed(3)}, Lng: ${coords.lng.toFixed(3)}` : "Location unspecified"}
            </strong>
          </div>
        </div>

        <button
          type="button"
          onClick={onRequestLocation}
          disabled={loading}
          className="btn-primary"
          style={{
            padding: "8px 14px",
            fontSize: "0.84rem",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          <Navigation size={14} />
          {loading ? "Detecting GPS..." : "Detect My GPS"}
        </button>
      </div>

      {error && (
        <div style={{
          padding: "8px 12px",
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          borderRadius: "8px",
          color: "#991B1B",
          fontSize: "0.82rem",
          marginBottom: "10px"
        }}>
          {error}
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={() => setShowManual(!showManual)}
          style={{
            background: "transparent",
            color: "#15803D",
            border: "none",
            fontSize: "0.82rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: 0
          }}
        >
          {showManual ? "Hide preset cities" : "Or select city manually"}
          {showManual ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showManual && (
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <select
              value={selectedCity}
              onChange={handleCitySelect}
              style={{
                flex: 1,
                padding: "9px 12px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                background: "#FFFFFF",
                color: "#0F172A",
                fontSize: "0.88rem"
              }}
            >
              <option value="">-- Choose Major Scrap Cluster / City --</option>
              {CITY_PRESETS.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationPicker;
