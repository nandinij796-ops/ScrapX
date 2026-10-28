import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { SCRAP_MATERIAL_RATES, calculateScrapValue } from "../services/ratesService";
import {
  TrendingUp,
  Sparkles,
  Truck,
  Leaf,
  Droplets,
  ArrowRight
} from "lucide-react";

function ScrapRates() {
  const [selectedMaterialId, setSelectedMaterialId] = useState("aluminium");
  const [weightKg, setWeightKg] = useState(120);

  const calc = calculateScrapValue(selectedMaterialId, weightKg);

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "40px 20px 80px" }}>
        <div className="container" style={{ maxWidth: "1140px" }}>
          
          {/* Header */}
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 40px" }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#ECFDF5",
              color: "#15803D",
              padding: "4px 14px",
              borderRadius: "20px",
              fontSize: "0.82rem",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "12px"
            }}>
              <TrendingUp size={15} /> Daily Transparent Scrap Rates
            </span>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#0F172A", margin: "0 0 12px", letterSpacing: "-0.5px" }}>
              Automotive & Metal Scrap <span style={{ color: "#15803D" }}>Rate Card</span>
            </h1>
            <p style={{ color: "#64748B", fontSize: "1.05rem", lineHeight: "1.6", margin: 0 }}>
              Live indicative scrap metal prices per kilogram benchmarked across licensed recycling yards in India. No hidden broker deductions.
            </p>
          </div>

          {/* Interactive Calculator Section */}
          <div className="premium-card" style={{
            padding: "36px",
            marginBottom: "48px",
            background: "linear-gradient(to right, #FFFFFF, #F0FDF4)",
            border: "1px solid #BBF7D0"
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "36px", alignItems: "center" }} className="calc-layout">
              {/* Left Controls */}
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#0F172A", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Sparkles size={20} style={{ color: "#15803D" }} /> Instant Value & Impact Estimator
                </h3>
                <p style={{ color: "#64748B", fontSize: "0.92rem", marginBottom: "24px" }}>
                  Select the scrap category and slide the estimated weight to calculate instant payout.
                </p>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                    Select Material Category:
                  </label>
                  <select
                    value={selectedMaterialId}
                    onChange={(e) => setSelectedMaterialId(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: "1px solid #CBD5E1",
                      backgroundColor: "#FFFFFF",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      color: "#0F172A"
                    }}
                  >
                    {SCRAP_MATERIAL_RATES.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} — ₹{m.pricePerKg} / kg
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <label style={{ fontSize: "0.88rem", fontWeight: "600", color: "#334155" }}>
                      Estimated Scrap Weight:
                    </label>
                    <span style={{ fontSize: "1rem", fontWeight: "800", color: "#15803D" }}>
                      {weightKg} kg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    style={{
                      width: "100%",
                      accentColor: "#15803D",
                      cursor: "pointer",
                      height: "8px"
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#94A3B8", marginTop: "4px" }}>
                    <span>10 kg</span>
                    <span>500 kg</span>
                    <span>1,000 kg</span>
                  </div>
                </div>
              </div>

              {/* Right Output Card */}
              <div style={{
                background: "#FFFFFF",
                borderRadius: "16px",
                padding: "28px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 10px 15px -3px rgba(15, 23, 42, 0.05)"
              }}>
                <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#15803D", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Total Estimated Payout
                </span>
                <div style={{ fontSize: "2.8rem", fontWeight: "800", color: "#0F172A", margin: "6px 0 12px" }}>
                  ₹{calc.estimatedPrice.toLocaleString()}
                </div>
                <p style={{ color: "#64748B", fontSize: "0.88rem", marginBottom: "20px" }}>
                  Rate applied: <strong>₹{calc.material.pricePerKg} / kg</strong> for {calc.material.name}
                </p>

                {/* Ecological Counter */}
                <div style={{
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "10px",
                  padding: "14px",
                  marginBottom: "20px"
                }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "#475569", marginBottom: "8px" }}>
                    🌍 Environmental Benefit of this Lot:
                  </div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "0.88rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "#15803D", fontWeight: "600" }}>
                      <Leaf size={15} /> {calc.co2SavedKg} kg CO₂ Saved
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "#0284C7", fontWeight: "600" }}>
                      <Droplets size={15} /> {calc.waterSavedLiters} L Water Conserved
                    </span>
                  </div>
                </div>

                <Link
                  to="/pickups"
                  className="btn-primary"
                  style={{ width: "100%", padding: "12px", fontSize: "0.95rem" }}
                >
                  <Truck size={17} />
                  Book Doorstep Pickup for this Material →
                </Link>
              </div>
            </div>
          </div>

          {/* Full Rate Sheet Table */}
          <div style={{ marginBottom: "48px" }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#0F172A", marginBottom: "20px" }}>
              Comprehensive Category Scrap Rate Sheet
            </h2>

            <div className="premium-card" style={{ overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.92rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                      <th style={{ padding: "14px 20px", fontWeight: "700", color: "#475569" }}>Material Category</th>
                      <th style={{ padding: "14px 20px", fontWeight: "700", color: "#475569" }}>Indicative Rate</th>
                      <th style={{ padding: "14px 20px", fontWeight: "700", color: "#475569" }}>Typical Vehicle Components</th>
                      <th style={{ padding: "14px 20px", fontWeight: "700", color: "#475569" }}>Eco Impact Tier</th>
                      <th style={{ padding: "14px 20px", fontWeight: "700", color: "#475569", textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SCRAP_MATERIAL_RATES.map((item, idx) => (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: idx === SCRAP_MATERIAL_RATES.length - 1 ? "none" : "1px solid #F1F5F9",
                          transition: "background-color 0.15s ease"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8FAFC")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <td style={{ padding: "16px 20px", fontWeight: "700", color: "#0F172A" }}>
                          {item.name}
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#15803D" }}>
                            ₹{item.pricePerKg}
                          </span>
                          <span style={{ color: "#64748B", fontSize: "0.85rem", marginLeft: "4px" }}>
                            / {item.unit}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px", color: "#64748B", maxWidth: "340px" }}>
                          {item.description}
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <span className="badge badge-success" style={{ fontSize: "0.75rem" }}>
                            🌱 High Circularity
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "right" }}>
                          <Link
                            to="/pickups"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              color: "#15803D",
                              fontWeight: "700",
                              fontSize: "0.88rem"
                            }}
                          >
                            Sell <ArrowRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Transparent Valuation FAQ */}
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0F172A", marginBottom: "20px", textAlign: "center" }}>
              Frequently Asked Questions About Scrap Valuation
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="premium-card" style={{ padding: "20px" }}>
                <h4 style={{ margin: "0 0 6px 0", fontSize: "1rem", fontWeight: "700", color: "#0F172A" }}>
                  How is the scrap weight verified on site?
                </h4>
                <p style={{ margin: 0, color: "#64748B", fontSize: "0.9rem", lineHeight: "1.5" }}>
                  Our collection logistics trucks carry government-certified digital platform scales. You inspect the weight reading in real time before signing off on the collection receipt.
                </p>
              </div>

              <div className="premium-card" style={{ padding: "20px" }}>
                <h4 style={{ margin: "0 0 6px 0", fontSize: "1rem", fontWeight: "700", color: "#0F172A" }}>
                  When and how do I receive payment?
                </h4>
                <p style={{ margin: 0, color: "#64748B", fontSize: "0.9rem", lineHeight: "1.5" }}>
                  Payment is made immediately on the spot upon weighing. You can choose Instant UPI transfer, direct IMPS Bank Transfer, or Cash upon receipt.
                </p>
              </div>

              <div className="premium-card" style={{ padding: "20px" }}>
                <h4 style={{ margin: "0 0 6px 0", fontSize: "1rem", fontWeight: "700", color: "#0F172A" }}>
                  Do I receive an official RTO Certificate of Deposit / Destruction?
                </h4>
                <p style={{ margin: 0, color: "#64748B", fontSize: "0.9rem", lineHeight: "1.5" }}>
                  Yes! For end-of-life scrap vehicles, ScrapX provides an official digital Certificate of Vehicle Scrapping (CoVS) enabling you to legally deregister the chassis with the Ministry of Road Transport.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 820px) {
          .calc-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ScrapRates;
