import { useState } from "react";
import Navbar from "../components/Navbar";

function NearbyMap() {
  const [searchType, setSearchType] = useState("car+mechanic+near+me");

  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", color: "#f8fafc", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "30px 5%", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#f8fafc", margin: 0 }}>
              Discover <span style={{ color: "#3b82f6" }}>Nearby Services</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "1rem", marginTop: "10px" }}>
              Find trusted mechanics and verified scrap markets based on your real-time location.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", background: "#1e293b", padding: "6px", borderRadius: "12px", border: "1px solid #334155" }}>
            <button
              onClick={() => setSearchType("car+mechanic+near+me")}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                fontWeight: "600",
                cursor: "pointer",
                background: searchType === "car+mechanic+near+me" ? "#3b82f6" : "transparent",
                color: searchType === "car+mechanic+near+me" ? "white" : "#94a3b8",
                transition: "all 0.2s"
              }}
            >
              👨‍🔧 Mechanics
            </button>
            <button
              onClick={() => setSearchType("automobile+scrap+market+near+me")}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                fontWeight: "600",
                cursor: "pointer",
                background: searchType === "automobile+scrap+market+near+me" ? "#10b981" : "transparent",
                color: searchType === "automobile+scrap+market+near+me" ? "white" : "#94a3b8",
                transition: "all 0.2s"
              }}
            >
              ♻️ Scrap Markets
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div style={{ 
          flex: 1, 
          background: "#1e293b", 
          borderRadius: "20px", 
          overflow: "hidden", 
          border: "1px solid #334155",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
          minHeight: "600px"
        }}>
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${searchType}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
          ></iframe>
        </div>

      </div>
    </div>
  );
}

export default NearbyMap;
