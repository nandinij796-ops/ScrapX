import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { subscribeToScraps } from "../services/scrapService";
import { SCRAP_MATERIAL_RATES, calculateScrapValue } from "../services/ratesService";
import {
  Recycle,
  Search,
  Truck,
  Package,
  Compass,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Leaf,
  Scale,
  MapPin,
  Clock
} from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredScraps, setFeaturedScraps] = useState([]);

  // Quick estimator state
  const [estimateMaterial, setEstimateMaterial] = useState("aluminium");
  const [estimateWeight, setEstimateWeight] = useState(80);
  const quickCalc = calculateScrapValue(estimateMaterial, estimateWeight);

  useEffect(() => {
    const unsubscribe = subscribeToScraps((scraps) => {
      // Filter for available listings and show top 4
      const available = scraps.filter((s) => s.status === "Available").slice(0, 4);
      setFeaturedScraps(available);
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/scraps?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/scraps");
    }
  };

  const quickPills = ["Turbocharger", "Bumper", "Alloy Wheels", "Alternator", "Headlight", "Batteries"];

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        background: "radial-gradient(circle at 10% 20%, rgba(236, 253, 245, 0.8) 0%, rgba(248, 250, 252, 1) 90%)",
        borderBottom: "1px solid #E2E8F0",
        padding: "70px 20px 80px"
      }}>
        <div className="container" style={{ maxWidth: "1240px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "48px", alignItems: "center" }} className="hero-grid">
            
            {/* Left Hero Content */}
            <div>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#ECFDF5",
                color: "#15803D",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "0.84rem",
                fontWeight: "700",
                border: "1px solid #A7F3D0",
                marginBottom: "20px"
              }}>
                <Leaf size={15} /> India's Premier Automotive Scrap & Spare Parts Platform
              </div>

              <h1 style={{
                fontSize: "3.4rem",
                fontWeight: "800",
                color: "#0F172A",
                lineHeight: "1.15",
                letterSpacing: "-1px",
                marginBottom: "20px"
              }}>
                Turn Vehicle Scrap Into <span style={{ color: "#15803D" }}>Instant Payouts</span> & Recycled Parts.
              </h1>

              <p style={{
                fontSize: "1.12rem",
                color: "#475569",
                lineHeight: "1.65",
                marginBottom: "32px",
                maxWidth: "560px"
              }}>
                Book certified doorstep scrap vehicle collection or buy authentic salvaged spare parts directly from verified workshops with zero brokerage.
              </p>

              {/* Live Search Box */}
              <form onSubmit={handleSearch} style={{
                display: "flex",
                backgroundColor: "#FFFFFF",
                borderRadius: "14px",
                border: "2px solid #E2E8F0",
                padding: "6px",
                boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.08)",
                marginBottom: "18px",
                maxWidth: "540px"
              }}>
                <div style={{ display: "flex", alignItems: "center", paddingLeft: "14px", color: "#94A3B8" }}>
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Search spare parts (e.g. Swift Alternator, Thar Bumper, Nexon Turbo)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    padding: "12px 14px",
                    fontSize: "0.95rem",
                    color: "#0F172A",
                    backgroundColor: "transparent"
                  }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: "12px 24px", borderRadius: "10px" }}
                >
                  Search
                </button>
              </form>

              {/* Quick Filter Pills */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.82rem", color: "#64748B", fontWeight: "600" }}>Popular:</span>
                {quickPills.map((pill) => (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => navigate(`/scraps?q=${encodeURIComponent(pill)}`)}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "20px",
                      padding: "4px 12px",
                      fontSize: "0.8rem",
                      color: "#475569",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#15803D"; e.currentTarget.style.color = "#15803D"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#475569"; }}
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Hero: Instant Estimator Widget */}
            <div>
              <div className="premium-card" style={{
                padding: "32px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #BBF7D0",
                boxShadow: "0 20px 30px -10px rgba(21, 128, 61, 0.15)",
                position: "relative"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#ECFDF5", color: "#15803D", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Scale size={18} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#0F172A" }}>
                        Instant Scrap Quote
                      </h3>
                      <span style={{ fontSize: "0.78rem", color: "#64748B" }}>Official Live Market Benchmarks</span>
                    </div>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: "0.72rem" }}>Live Payout</span>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                    Select Vehicle / Scrap Material:
                  </label>
                  <select
                    value={estimateMaterial}
                    onChange={(e) => setEstimateMaterial(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid #CBD5E1",
                      backgroundColor: "#F8FAFC",
                      fontSize: "0.92rem",
                      fontWeight: "600",
                      color: "#0F172A"
                    }}
                  >
                    {SCRAP_MATERIAL_RATES.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} (₹{m.pricePerKg}/kg)
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>
                      Estimated Scrap Weight:
                    </label>
                    <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#15803D" }}>
                      {estimateWeight} kg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="5"
                    value={estimateWeight}
                    onChange={(e) => setEstimateWeight(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#15803D", cursor: "pointer" }}
                  />
                </div>

                {/* Live Value Box */}
                <div style={{
                  backgroundColor: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px"
                }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#166534", textTransform: "uppercase" }}>
                      Calculated Payout
                    </span>
                    <div style={{ fontSize: "1.85rem", fontWeight: "800", color: "#15803D" }}>
                      ₹{quickCalc.estimatedPrice.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: "0.8rem", color: "#166534" }}>
                    <div>🌱 <strong>{quickCalc.co2SavedKg} kg</strong> CO₂ Saved</div>
                    <div>💧 <strong>{quickCalc.waterSavedLiters} L</strong> Water Saved</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Link
                    to="/pickups"
                    className="btn-primary"
                    style={{ padding: "11px", fontSize: "0.88rem" }}
                  >
                    <Truck size={16} /> Book Pickup
                  </Link>
                  <Link
                    to="/rates"
                    className="btn-secondary"
                    style={{ padding: "11px", fontSize: "0.88rem" }}
                  >
                    View All Rates
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Platform Statistics Ribbon */}
      <section style={{ backgroundColor: "#14532D", color: "#FFFFFF", padding: "28px 20px" }}>
        <div className="container" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "24px",
          textAlign: "center"
        }}>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#34D399" }}>18,400+ kg</div>
            <div style={{ fontSize: "0.88rem", color: "#D1FAE5", marginTop: "2px" }}>Automotive Metal Recycled</div>
          </div>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#34D399" }}>1,240+</div>
            <div style={{ fontSize: "0.88rem", color: "#D1FAE5", marginTop: "2px" }}>Verified Workshops & Garages</div>
          </div>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#34D399" }}>₹4.2 Cr+</div>
            <div style={{ fontSize: "0.88rem", color: "#D1FAE5", marginTop: "2px" }}>Salvage Payouts Distributed</div>
          </div>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#34D399" }}>100% RTO</div>
            <div style={{ fontSize: "0.88rem", color: "#D1FAE5", marginTop: "2px" }}>Compliant Vehicle Destruction</div>
          </div>
        </div>
      </section>

      {/* Core Services Grid */}
      <section style={{ padding: "80px 20px" }}>
        <div className="container" style={{ maxWidth: "1200px" }}>
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px" }}>
            <span className="badge badge-success" style={{ marginBottom: "10px" }}>
              Circular Solutions
            </span>
            <h2 style={{ fontSize: "2.3rem", fontWeight: "800", color: "#0F172A", margin: "4px 0 10px" }}>
              End-to-End Automotive Lifecycle
            </h2>
            <p style={{ color: "#64748B", fontSize: "1rem" }}>
              Comprehensive infrastructure for vehicle owners, fleet managers, independent mechanics, and certified recyclers.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            {/* Card 1: Marketplace */}
            <div className="premium-card" style={{ padding: "30px", display: "flex", flexDirection: "column" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#ECFDF5", color: "#15803D", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <Package size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0F172A", marginBottom: "10px" }}>
                Spare Parts Marketplace
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.92rem", lineHeight: "1.6", flex: 1, marginBottom: "20px" }}>
                Browse tested OEM engines, body panels, alloy wheels, and electrical components pulled from certified salvage vehicles.
              </p>
              <Link to="/scraps" style={{ color: "#15803D", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                Explore Inventory <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 2: Doorstep Pickup */}
            <div className="premium-card" style={{ padding: "30px", display: "flex", flexDirection: "column" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <Truck size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0F172A", marginBottom: "10px" }}>
                Doorstep Scrap Collection
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.92rem", lineHeight: "1.6", flex: 1, marginBottom: "20px" }}>
                Book calibrated truck collection from your home or workshop with live on-site digital weighing and instant UPI payout.
              </p>
              <Link to="/pickups" style={{ color: "#2563EB", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                Schedule a Pickup <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 3: Live Radar */}
            <div className="premium-card" style={{ padding: "30px", display: "flex", flexDirection: "column" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#F5F3FF", color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <Compass size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0F172A", marginBottom: "10px" }}>
                Nearby Mechanics Radar
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.92rem", lineHeight: "1.6", flex: 1, marginBottom: "20px" }}>
                Locate certified mechanics, scrap yards, and spare parts suppliers near your GPS location with real-time distance calculations.
              </p>
              <Link to="/nearby" style={{ color: "#7C3AED", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                Launch Radar <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 4: Roadside Emergency */}
            <div className="premium-card" style={{ padding: "30px", display: "flex", flexDirection: "column" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#FEF2F2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <AlertTriangle size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0F172A", marginBottom: "10px" }}>
                24/7 Roadside Rescue
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.92rem", lineHeight: "1.6", flex: 1, marginBottom: "20px" }}>
                1-click emergency SOS dispatch for flat tires, battery jumpstarts, mechanical breakdowns, or accident towing across India.
              </p>
              <Link to="/emergency" style={{ color: "#DC2626", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                Emergency Assist <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Scrap & Parts Showcase */}
      <section style={{ backgroundColor: "#F1F5F9", padding: "80px 20px" }}>
        <div className="container" style={{ maxWidth: "1200px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "36px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: "8px" }}>
                Verified Inventory
              </span>
              <h2 style={{ fontSize: "2.2rem", fontWeight: "800", color: "#0F172A", margin: "4px 0 0" }}>
                Featured Recovered Spare Parts
              </h2>
            </div>
            <Link to="/scraps" className="btn-secondary">
              View All Parts Inventory →
            </Link>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
            gap: "24px"
          }}>
            {featuredScraps.map((item) => (
              <div
                key={item.id}
                className="premium-card"
                style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
              >
                <div style={{ position: "relative", height: "190px", backgroundColor: "#0F172A" }}>
                  <img
                    src={item.image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=600"}
                    alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=600";
                    }}
                  />
                  <span style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    backgroundColor: "#15803D",
                    color: "white",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    fontSize: "0.72rem",
                    fontWeight: "700"
                  }}>
                    {item.condition || "Used - Good"}
                  </span>
                  {item.images && item.images.length > 1 && (
                    <span style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "rgba(15, 23, 42, 0.8)",
                      color: "white",
                      padding: "2px 7px",
                      borderRadius: "6px",
                      fontSize: "0.72rem",
                      fontWeight: "600"
                    }}>
                      📷 {item.images.length}
                    </span>
                  )}
                </div>

                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <span style={{ fontSize: "0.78rem", color: "#15803D", fontWeight: "700", textTransform: "uppercase" }}>
                    {item.category}
                  </span>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0F172A", margin: "4px 0 8px" }}>
                    {item.name}
                  </h3>
                  <p style={{ color: "#64748B", fontSize: "0.85rem", margin: "0 0 16px 0", flex: 1 }}>
                    {item.compatibility ? `Fits: ${item.compatibility}` : "Universal Fitment"}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E2E8F0", paddingTop: "14px" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Asking Price</span>
                      <div style={{ fontSize: "1.35rem", fontWeight: "800", color: "#15803D" }}>
                        ₹{item.price?.toLocaleString()}
                      </div>
                    </div>
                    <Link
                      to="/scraps"
                      className="btn-primary"
                      style={{ padding: "8px 14px", fontSize: "0.85rem" }}
                    >
                      Inspect Part
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: "80px 20px", backgroundColor: "#FFFFFF" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 50px" }}>
            <span className="badge badge-success" style={{ marginBottom: "10px" }}>
              Simple 4-Step Process
            </span>
            <h2 style={{ fontSize: "2.3rem", fontWeight: "800", color: "#0F172A", margin: "4px 0 10px" }}>
              How the ScrapX Circular Network Works
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "28px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#15803D", color: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: "1.2rem", fontWeight: "800" }}>
                1
              </div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0F172A", marginBottom: "8px" }}>
                List Part or Schedule Pickup
              </h4>
              <p style={{ color: "#64748B", fontSize: "0.9rem", lineHeight: "1.5" }}>
                Upload photos of your automotive spare part or select a scrap category with your preferred collection slot.
              </p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#15803D", color: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: "1.2rem", fontWeight: "800" }}>
                2
              </div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0F172A", marginBottom: "8px" }}>
                Digital Scale Inspection
              </h4>
              <p style={{ color: "#64748B", fontSize: "0.9rem", lineHeight: "1.5" }}>
                Our logistics partner verifies component functionality or weighs metal scrap with certified digital scales.
              </p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#15803D", color: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: "1.2rem", fontWeight: "800" }}>
                3
              </div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0F172A", marginBottom: "8px" }}>
                Instant Spot Payout
              </h4>
              <p style={{ color: "#64748B", fontSize: "0.9rem", lineHeight: "1.5" }}>
                Receive full payment on the spot via UPI or direct bank transfer with zero commission cuts.
              </p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#15803D", color: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: "1.2rem", fontWeight: "800" }}>
                4
              </div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0F172A", marginBottom: "8px" }}>
                RTO Certificate of Scrappage
              </h4>
              <p style={{ color: "#64748B", fontSize: "0.9rem", lineHeight: "1.5" }}>
                For total scrap vehicles, receive government-compliant digital de-registration papers and green tax rebate tokens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{
        background: "linear-gradient(135deg, #14532D 0%, #15803D 100%)",
        color: "white",
        padding: "60px 20px",
        textAlign: "center"
      }}>
        <div className="container" style={{ maxWidth: "720px" }}>
          <h2 style={{ fontSize: "2.4rem", fontWeight: "800", margin: "0 0 16px", letterSpacing: "-0.5px" }}>
            Ready to Recycle or Source Spare Parts?
          </h2>
          <p style={{ fontSize: "1.08rem", color: "#BBF7D0", lineHeight: "1.6", margin: "0 0 32px" }}>
            Join over 1,200 automotive garages, scrap recyclers, and car owners turning unused metal into circular value today.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link to="/addscrap" className="btn-primary" style={{ backgroundColor: "#FFFFFF", color: "#15803D", padding: "14px 28px", fontSize: "1rem" }}>
              List Your Spare Parts Now
            </Link>
            <Link to="/pickups" className="btn-secondary" style={{ backgroundColor: "rgba(255, 255, 255, 0.15)", color: "white", borderColor: "rgba(255, 255, 255, 0.3)", padding: "14px 28px", fontSize: "1rem" }}>
              Schedule Doorstep Scrap Pickup
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
