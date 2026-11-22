import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { subscribeToScraps } from "../services/scrapService";
import { SCRAP_MATERIAL_RATES, calculateScrapValue } from "../services/ratesService";
import { lookupVehicleByPlate } from "../services/vahanService";
import VehicleLookupModal from "../components/VehicleLookupModal";
import { toast } from "react-hot-toast";
import {
  Search,
  Truck,
  Package,
  Compass,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Star,
  Wrench,
  Cpu,
  Car,
  Disc,
  Layers,
  ThermometerSnowflake,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Scale,
  Loader2
} from "lucide-react";

// Real automotive vehicle data for the 4-step selector
const CAR_DATABASE = {
  "Maruti Suzuki": {
    models: ["Swift", "Baleno", "Brezza", "Dzire", "Ertiga", "WagonR", "Grand Vitara", "Alto K10"],
    years: ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016"],
    modifications: ["1.2L DualJet Petrol", "1.5L K-Series Petrol", "Factory CNG", "1.3L DDiS Diesel"]
  },
  "Hyundai": {
    models: ["Creta", "Venue", "i20", "Verna", "Grand i10 Nios", "Tucson", "Exter", "Alcazar"],
    years: ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"],
    modifications: ["1.5L CRDi Diesel", "1.5L MPi Petrol", "1.0L Turbo GDi", "1.2L Kappa Petrol"]
  },
  "Tata Motors": {
    models: ["Nexon", "Punch", "Harrier", "Safari", "Tiago", "Altroz", "Curvv", "Tigor"],
    years: ["2024", "2023", "2022", "2021", "2020", "2019", "2018"],
    modifications: ["1.5L Revotorq Diesel", "1.2L Turbo Revotron", "EV Long Range", "iCNG Dual Cylinder"]
  },
  "Mahindra": {
    models: ["Thar", "Scorpio-N", "XUV700", "Bolero Neo", "XUV300", "Scorpio Classic"],
    years: ["2024", "2023", "2022", "2021", "2020", "2019", "2018"],
    modifications: ["2.2L mHawk Diesel", "2.0L mStallion Turbo Petrol", "1.5L Diesel"]
  },
  "Toyota": {
    models: ["Innova Crysta", "Fortuner", "Urban Cruiser Hyryder", "Glanza", "Innova Hycross", "Hilux"],
    years: ["2024", "2023", "2022", "2021", "2020", "2019", "2018"],
    modifications: ["2.4L Diesel", "2.8L 4x4 Diesel", "1.5L Strong Hybrid EV", "2.0L Petrol"]
  },
  "Honda": {
    models: ["City (5th Gen)", "Amaze", "Elevate", "WR-V", "Jazz", "Civic"],
    years: ["2024", "2023", "2022", "2021", "2020", "2019", "2018"],
    modifications: ["1.5L i-VTEC Petrol", "1.5L e:HEV Strong Hybrid", "1.5L i-DTEC Diesel"]
  },
  "Kia": {
    models: ["Seltos", "Sonet", "Carens", "EV6", "Carnival"],
    years: ["2024", "2023", "2022", "2021", "2020"],
    modifications: ["1.5L CRDi VGT", "1.5L Smartstream Petrol", "1.5L Turbo GDi"]
  },
  "Volkswagen & Skoda": {
    models: ["Taigun", "Virtus", "Kushaq", "Slavia", "Polo GT", "Vento", "Octavia"],
    years: ["2024", "2023", "2022", "2021", "2020", "2019"],
    modifications: ["1.0L TSI Petrol", "1.5L TSI EVO", "1.5L TDI Diesel", "2.0L TSI Petrol"]
  }
};

const POPULAR_BRANDS = [
  { name: "MARUTI", query: "Maruti" },
  { name: "HYUNDAI", query: "Hyundai" },
  { name: "MAHINDRA", query: "Mahindra" },
  { name: "TATA", query: "Tata" },
  { name: "CHEVROLET", query: "Chevrolet" },
  { name: "HONDA", query: "Honda" },
  { name: "SKODA", query: "Skoda" },
  { name: "MAHINDRA COMMERCIAL", query: "Mahindra Commercial" },
  { name: "VW", query: "Volkswagen" },
  { name: "TOYOTA", query: "Toyota" },
  { name: "NISSAN", query: "Nissan" },
  { name: "RENAULT", query: "Renault" },
  { name: "FORD", query: "Ford" },
  { name: "FIAT", query: "Fiat" },
  { name: "KIA", query: "Kia" }
];

const VISUAL_CATEGORIES = [
  {
    id: "Engine Parts",
    title: "Engine & Drivetrain",
    desc: "Turbos, Alternators, Gearboxes, Starters",
    icon: Wrench,
    badge: "Most Demanded",
    color: "#15803D",
    bg: "#ECFDF5",
    img: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "Body Parts",
    title: "Body Panels & Bumpers",
    desc: "Steel Bumpers, Bonnets, Fenders, Grilles",
    icon: Car,
    badge: "OEM Salvage",
    color: "#2563EB",
    bg: "#EFF6FF",
    img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "Electronics",
    title: "Lighting & Electricals",
    desc: "Headlamps, LED Taillights, ECUs, Sensors",
    icon: Cpu,
    badge: "Load Tested",
    color: "#7C3AED",
    bg: "#F5F3FF",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "Suspension",
    title: "Brakes & Suspension",
    desc: "Brake Calipers, Shock Absorbers, Axles",
    icon: Disc,
    badge: "Verified OEM",
    color: "#D97706",
    bg: "#FEF3C7",
    img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "Wheels",
    title: "Alloy Wheels & Tires",
    desc: "Diamond Cut Alloys, Rims, Spare Wheels",
    icon: Layers,
    badge: "Zero Bend",
    color: "#0891B2",
    bg: "#ECFEFF",
    img: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "Other",
    title: "AC & Interior Comfort",
    desc: "Compressors, Condensers, Seat Sets",
    icon: ThermometerSnowflake,
    badge: "100% Fitment",
    color: "#059669",
    bg: "#F0FDF4",
    img: "https://images.unsplash.com/photo-1530906358829-e84b2769270f?auto=format&fit=crop&q=80&w=400"
  }
];

const GUIDES = [
  {
    title: "Engine Air Filter and Cabin Filter: When to Replace?",
    category: "Maintenance Guide",
    time: "4 min read",
    img: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Headlight Not Working: How to Diagnose Relay vs Bulb",
    category: "Electrical Repair",
    time: "3 min read",
    img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Car Window Won't Go Up: Power Window Switch Troubleshooting",
    category: "DIY Troubleshooting",
    time: "5 min read",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600"
  }
];

function Home() {
  const navigate = useNavigate();

  // Keyword search state
  const [partSearchText, setPartSearchText] = useState("");

  // Boodmo-style Vehicle Selector States
  const [maker, setMaker] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [modification, setModification] = useState("");

  // Number plate input state
  const [plateNumber, setPlateNumber] = useState("");
  const [isLookingUpPlate, setIsLookingUpPlate] = useState(false);
  const [lookedUpVehicle, setLookedUpVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Live scrap estimator
  const [material, setMaterial] = useState("aluminium");
  const [weight, setWeight] = useState(75);
  const quickCalc = calculateScrapValue(material, weight);

  // Available options derived from maker
  const availableModels = maker && CAR_DATABASE[maker] ? CAR_DATABASE[maker].models : [];
  const availableYears = maker && CAR_DATABASE[maker] ? CAR_DATABASE[maker].years : [];
  const availableMods = maker && CAR_DATABASE[maker] ? CAR_DATABASE[maker].modifications : [];

  // Scraps from unified repository
  const [featuredScraps, setFeaturedScraps] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToScraps((scraps) => {
      const available = scraps.filter((s) => s.status === "Available").slice(0, 4);
      setFeaturedScraps(available);
    });
    return () => unsubscribe();
  }, []);

  const handleQuickKeywordSearch = (e) => {
    e.preventDefault();
    if (partSearchText.trim()) {
      navigate(`/scraps?q=${encodeURIComponent(partSearchText.trim())}`);
    } else {
      navigate("/scraps");
    }
  };

  const handleVehicleSearch = (e) => {
    e.preventDefault();
    const query = [maker, model, year, modification].filter(Boolean).join(" ");
    if (query) {
      navigate(`/scraps?q=${encodeURIComponent(query)}`);
    } else {
      navigate("/scraps");
    }
  };

  const performPlateLookup = async (plateToQuery) => {
    const raw = plateToQuery || plateNumber;
    if (!raw.trim()) {
      toast.error("Please enter a vehicle registration number (e.g., DL01AB1234)");
      return;
    }

    try {
      setIsLookingUpPlate(true);
      const vehicleData = await lookupVehicleByPlate(raw);
      setLookedUpVehicle(vehicleData);
      setIsModalOpen(true);

      // Auto-populate 4-step cascading dropdowns if maker exists in database
      if (vehicleData.maker && CAR_DATABASE[vehicleData.maker]) {
        setMaker(vehicleData.maker);
        setModel(vehicleData.model);
        setYear(vehicleData.year);
        if (vehicleData.modification) {
          setModification(vehicleData.modification);
        }
      }

      toast.success(`Verified: ${vehicleData.maker} ${vehicleData.model} (${vehicleData.year})`, {
        icon: "🚗"
      });
    } catch (err) {
      toast.error(err.message || "Failed to look up registration details.");
    } finally {
      setIsLookingUpPlate(false);
    }
  };

  const handlePlateSearch = (e) => {
    e.preventDefault();
    performPlateLookup(plateNumber);
  };

  const popularPills = ["Nexon Turbocharger", "Thar Front Bumper", "Swift Alternator", "Creta Alloy Wheels", "i20 Headlight Assembly", "Brake Calipers"];

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Vehicle RC Lookup Modal */}
      <VehicleLookupModal
        vehicle={lookedUpVehicle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApplyToSelector={(v) => {
          if (v.maker && CAR_DATABASE[v.maker]) {
            setMaker(v.maker);
            setModel(v.model);
            setYear(v.year);
            if (v.modification) setModification(v.modification);
          }
        }}
      />

      {/* Main Container */}
      <main style={{ flex: 1, padding: "28px 20px 70px" }}>
        <div className="container" style={{ maxWidth: "1280px" }}>

          {/* Quick Keyword Search Bar at Top */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "14px",
            padding: "8px 12px",
            marginBottom: "28px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)"
          }}>
            <form onSubmit={handleQuickKeywordSearch} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", paddingLeft: "8px", color: "#94A3B8" }}>
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search across 10,000+ spare parts by keyword, part name, or OEM code..."
                value={partSearchText}
                onChange={(e) => setPartSearchText(e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: "0.95rem",
                  padding: "8px 6px",
                  color: "#0F172A",
                  backgroundColor: "transparent",
                  fontWeight: "500"
                }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: "10px 22px", borderRadius: "8px", fontSize: "0.9rem", fontWeight: "700" }}
              >
                Search
              </button>
            </form>
          </div>

          {/* ========================================================================= */}
          {/* USER REQUESTED EXACT SECTION: SEARCH BY VEHICLE (Pixel-Perfect Boodmo Bar) */}
          {/* ========================================================================= */}
          <section style={{ marginBottom: "40px" }}>
            
            {/* Header Row: "Search by Vehicle" + HSRP License Plate on Right */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "12px",
              flexWrap: "wrap",
              gap: "12px"
            }}>
              {/* Title */}
              <h2 style={{
                fontSize: "2.1rem",
                fontWeight: "800",
                color: "#0B3B60",
                margin: 0,
                letterSpacing: "-0.5px"
              }}>
                Search by <span style={{ color: "#00A8E8" }}>Vehicle</span>
              </h2>

              {/* Number Plate Search (Indian HSRP plate styling - Fully Workable) */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                <form onSubmit={handlePlateSearch} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "0.85rem", color: "#475569", fontWeight: "600" }}>
                    Search by number plate:
                  </span>
                  
                  {/* Plate Card Box */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    border: "2px solid #64748B",
                    borderRadius: "8px",
                    background: "linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 100%)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.18), inset 0 1px 2px rgba(255,255,255,0.9)",
                    overflow: "hidden"
                  }}>
                    {/* Left IND Blue Hologram */}
                    <div style={{
                      padding: "4px 8px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRight: "1.5px solid #CBD5E1",
                      background: "rgba(255,255,255,0.7)"
                    }}>
                      <span style={{ fontSize: "0.6rem", color: "#2563EB", lineHeight: 1 }}>🇮🇳</span>
                      <span style={{ fontSize: "0.55rem", fontWeight: "900", color: "#1E3A8A", lineHeight: 1, marginTop: "2px" }}>IND</span>
                    </div>

                    {/* License Plate Input */}
                    <input
                      type="text"
                      placeholder="DL01AB1234"
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                      style={{
                        border: "none",
                        outline: "none",
                        padding: "8px 12px",
                        fontSize: "1.05rem",
                        fontWeight: "900",
                        color: "#1E293B",
                        backgroundColor: "transparent",
                        letterSpacing: "1.5px",
                        width: "145px",
                        textTransform: "uppercase"
                      }}
                    />

                    {/* Attached Cyan Search Button */}
                    <button
                      type="submit"
                      disabled={isLookingUpPlate}
                      style={{
                        backgroundColor: isLookingUpPlate ? "#00B4D8" : "#48CAE4",
                        border: "none",
                        padding: "10px 14px",
                        cursor: isLookingUpPlate ? "wait" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        minWidth: "44px",
                        transition: "background 0.15s ease"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#00B4D8")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isLookingUpPlate ? "#00B4D8" : "#48CAE4")}
                      title="Look up vehicle RC details"
                    >
                      {isLookingUpPlate ? (
                        <div style={{ width: "16px", height: "16px", border: "2px solid #FFF", borderTopColor: "transparent", borderRadius: "50%", animation: "plateSpin 0.6s linear infinite" }} />
                      ) : (
                        <Search size={17} />
                      )}
                    </button>
                  </div>
                </form>

                {/* Quick Sample Clickable Plates */}
                <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: "600" }}>
                    Try sample plates:
                  </span>
                  {[
                    { label: "Swift", plate: "DL01AB1234" },
                    { label: "Thar", plate: "HR26DQ5555" },
                    { label: "Creta", plate: "MH12DE1432" },
                    { label: "Nexon", plate: "UP16BZ9081" },
                    { label: "City", plate: "KA05MN7890" }
                  ].map((item) => (
                    <button
                      key={item.plate}
                      type="button"
                      onClick={() => {
                        setPlateNumber(item.plate);
                        performPlateLookup(item.plate);
                      }}
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #CBD5E1",
                        borderRadius: "5px",
                        padding: "2px 7px",
                        fontSize: "0.7rem",
                        fontWeight: "700",
                        color: "#0B3B60",
                        cursor: "pointer",
                        transition: "all 0.12s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#00A8E8";
                        e.currentTarget.style.color = "#00A8E8";
                        e.currentTarget.style.backgroundColor = "#F0F9FF";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#CBD5E1";
                        e.currentTarget.style.color = "#0B3B60";
                        e.currentTarget.style.backgroundColor = "#FFFFFF";
                      }}
                    >
                      {item.label} ({item.plate})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Signature Dark Navy Full-Width Bar with 4 Dropdowns + Cyan Button */}
            <form
              onSubmit={handleVehicleSearch}
              style={{
                backgroundColor: "#0B3B60",
                borderRadius: "8px",
                padding: "14px 18px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr)) auto",
                gap: "12px",
                alignItems: "center",
                boxShadow: "0 6px 20px rgba(11, 59, 96, 0.25)"
              }}
            >
              {/* Dropdown 1: Select Car Maker */}
              <select
                value={maker}
                onChange={(e) => {
                  setMaker(e.target.value);
                  setModel("");
                  setYear("");
                  setModification("");
                }}
                style={{
                  padding: "11px 14px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#FFFFFF",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#0F172A",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                <option value="">Select Car Maker</option>
                {Object.keys(CAR_DATABASE).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              {/* Dropdown 2: Select Model Line */}
              <select
                value={model}
                onChange={(e) => {
                  setModel(e.target.value);
                  setYear("");
                  setModification("");
                }}
                disabled={!maker}
                style={{
                  padding: "11px 14px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: maker ? "#FFFFFF" : "#E2E8F0",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: maker ? "#0F172A" : "#94A3B8",
                  outline: "none",
                  cursor: maker ? "pointer" : "not-allowed"
                }}
              >
                <option value="">{maker ? "Select Model Line" : "Select Model Line"}</option>
                {availableModels.map((mod) => (
                  <option key={mod} value={mod}>{mod}</option>
                ))}
              </select>

              {/* Dropdown 3: Select Year */}
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled={!model}
                style={{
                  padding: "11px 14px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: model ? "#FFFFFF" : "#E2E8F0",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: model ? "#0F172A" : "#94A3B8",
                  outline: "none",
                  cursor: model ? "pointer" : "not-allowed"
                }}
              >
                <option value="">Select Year</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>

              {/* Dropdown 4: Select Modification */}
              <select
                value={modification}
                onChange={(e) => setModification(e.target.value)}
                disabled={!year}
                style={{
                  padding: "11px 14px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: year ? "#FFFFFF" : "#E2E8F0",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: year ? "#0F172A" : "#94A3B8",
                  outline: "none",
                  cursor: year ? "pointer" : "not-allowed"
                }}
              >
                <option value="">Select Modification</option>
                {availableMods.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              {/* Cyan Button: SEARCH PARTS */}
              <button
                type="submit"
                style={{
                  backgroundColor: "#48CAE4",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "11px 24px",
                  fontSize: "0.92rem",
                  fontWeight: "800",
                  letterSpacing: "0.6px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                  boxShadow: "0 2px 8px rgba(72, 202, 228, 0.4)"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#00B4D8")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#48CAE4")}
              >
                SEARCH PARTS
              </button>
            </form>
          </section>

          {/* ========================================================================= */}
          {/* SECTION: SEARCH BY CATEGORY (Boodmo Category Section, elevated) */}
          {/* ========================================================================= */}
          <section style={{ marginBottom: "48px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "#0B3B60", margin: 0 }}>
                Search by <span style={{ color: "#00A8E8" }}>Category</span>
              </h2>
              <Link to="/scraps" style={{ color: "#00A8E8", fontWeight: "700", fontSize: "0.88rem", textDecoration: "none" }}>
                VIEW ALL →
              </Link>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "18px"
            }}>
              {VISUAL_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.id}
                    onClick={() => navigate(`/scraps?q=${encodeURIComponent(cat.id)}`)}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "14px",
                      border: "1px solid #E2E8F0",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
                      display: "flex",
                      flexDirection: "column"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = "0 10px 22px rgba(0, 168, 232, 0.15)";
                      e.currentTarget.style.borderColor = "#00A8E8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(15, 23, 42, 0.03)";
                      e.currentTarget.style.borderColor = "#E2E8F0";
                    }}
                  >
                    <div style={{ height: "130px", position: "relative", overflow: "hidden", backgroundColor: "#0F172A" }}>
                      <img
                        src={cat.img}
                        alt={cat.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
                      />
                      <span style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        background: "rgba(15, 23, 42, 0.85)",
                        color: "white",
                        fontSize: "0.72rem",
                        fontWeight: "800",
                        padding: "3px 8px",
                        borderRadius: "6px"
                      }}>
                        {cat.badge}
                      </span>
                    </div>

                    <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                      <div style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "10px",
                        backgroundColor: cat.bg,
                        color: cat.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}>
                        <Icon size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: "0 0 2px 0", fontSize: "1rem", fontWeight: "800", color: "#0F172A" }}>
                          {cat.title}
                        </h3>
                        <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748B", lineHeight: "1.3" }}>
                          {cat.desc}
                        </p>
                      </div>
                      <ChevronRight size={17} style={{ color: "#94A3B8" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION: POPULAR CAR MAKERS (Exact Boodmo Brand Grid) */}
          {/* ========================================================================= */}
          <section style={{ marginBottom: "48px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "#0B3B60", margin: 0 }}>
                Popular <span style={{ color: "#00A8E8" }}>Car Makers</span>
              </h2>
              <Link to="/scraps" style={{ color: "#00A8E8", fontWeight: "700", fontSize: "0.88rem", textDecoration: "none" }}>
                VIEW ALL
              </Link>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(135px, 1fr))",
              gap: "12px"
            }}>
              {POPULAR_BRANDS.map((brand) => (
                <div
                  key={brand.name}
                  onClick={() => navigate(`/scraps?q=${encodeURIComponent(brand.query)}`)}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    padding: "16px 10px",
                    textAlign: "center",
                    fontWeight: "800",
                    fontSize: "0.82rem",
                    color: "#0B3B60",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.04)",
                    transition: "all 0.15s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "54px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#00A8E8";
                    e.currentTarget.style.color = "#00A8E8";
                    e.currentTarget.style.boxShadow = "0 6px 14px rgba(0, 168, 232, 0.18)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#E5E7EB";
                    e.currentTarget.style.color = "#0B3B60";
                    e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.04)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {brand.name}
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION: LIVE SALVAGE PARTS SHOWCASE */}
          {/* ========================================================================= */}
          <section style={{ marginBottom: "50px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <span className="badge badge-success" style={{ marginBottom: "4px" }}>
                  Verified Salvage Inventory
                </span>
                <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "#0F172A", margin: 0 }}>
                  Featured Salvaged <span style={{ color: "#15803D" }}>Spare Parts</span>
                </h2>
                <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: "0.9rem" }}>
                  Tested and verified components ready for immediate dispatch with 7-day fitment warranty.
                </p>
              </div>
              <Link to="/scraps" className="btn-primary" style={{ padding: "10px 20px" }}>
                Browse Full Inventory →
              </Link>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "22px"
            }}>
              {featuredScraps.map((item) => (
                <div
                  key={item.id}
                  className="premium-card"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid #E2E8F0",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ height: "190px", backgroundColor: "#0F172A", position: "relative" }}>
                    <img
                      src={item.image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=600"}
                      alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                  </div>

                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "0.75rem", color: "#15803D", fontWeight: "700", textTransform: "uppercase" }}>
                        {item.category}
                      </span>
                      <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "3px",
                        backgroundColor: "#FEF3C7",
                        color: "#92400E",
                        padding: "2px 7px",
                        borderRadius: "12px",
                        fontSize: "0.74rem",
                        fontWeight: "800"
                      }}>
                        <Star size={11} fill="#F59E0B" color="#F59E0B" />
                        <span>{item.rating ? item.rating.toFixed(1) : "4.8"}</span>
                        <span style={{ color: "#B45309", fontWeight: "500", fontSize: "0.68rem" }}>
                          ({item.reviewsCount || 14})
                        </span>
                      </div>
                    </div>

                    <h4 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0F172A", margin: "4px 0 6px" }}>
                      {item.name}
                    </h4>

                    <p style={{ color: "#64748B", fontSize: "0.84rem", margin: "0 0 10px 0" }}>
                      {item.compatibility ? `Fits: ${item.compatibility}` : "Universal Fitment"}
                    </p>

                    <div style={{ marginBottom: "14px" }}>
                      <span style={{
                        fontSize: "0.74rem",
                        fontWeight: "700",
                        color: (item.quantity || 1) > 1 ? "#166534" : "#9A3412",
                        backgroundColor: (item.quantity || 1) > 1 ? "#DCFCE7" : "#FFEDD5",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        border: (item.quantity || 1) > 1 ? "1px solid #BBF7D0" : "1px solid #FED7AA"
                      }}>
                        {(item.quantity || 1) > 1 ? `📦 In Stock: ${item.quantity} units` : "🔥 Only 1 unit left"}
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E2E8F0", paddingTop: "14px", marginTop: "auto" }}>
                      <div>
                        <span style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: "600" }}>
                          Asking Price
                        </span>
                        <div style={{ fontSize: "1.35rem", fontWeight: "800", color: "#15803D" }}>
                          ₹{item.price?.toLocaleString()}
                        </div>
                      </div>
                      <Link
                        to="/scraps"
                        className="btn-primary"
                        style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                      >
                        Inspect Part
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION: LIVE SCRAP METAL VALUE ESTIMATOR */}
          {/* ========================================================================= */}
          <section style={{ marginBottom: "50px" }}>
            <div style={{
              background: "linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 50%, #FFFFFF 100%)",
              borderRadius: "20px",
              border: "1.5px solid #BBF7D0",
              padding: "36px",
              boxShadow: "0 10px 30px rgba(21, 128, 61, 0.08)",
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gap: "36px",
              alignItems: "center"
            }} className="estimator-grid">
              <div>
                <span className="badge badge-success" style={{ marginBottom: "8px" }}>
                  Live Scrap Calculator
                </span>
                <h3 style={{ fontSize: "1.85rem", fontWeight: "800", color: "#0F172A", margin: "0 0 10px 0" }}>
                  Calculate Your Scrap Vehicle or Metal Value
                </h3>
                <p style={{ fontSize: "0.95rem", color: "#475569", lineHeight: "1.6", margin: "0 0 24px 0" }}>
                  Official market benchmark rates updated daily. Book doorstep collection with calibrated digital scales & immediate spot UPI payout.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                      Select Material:
                    </label>
                    <select
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1px solid #CBD5E1",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        color: "#0F172A",
                        background: "white"
                      }}
                    >
                      {SCRAP_MATERIAL_RATES.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} (₹{m.pricePerKg}/kg)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#334155" }}>
                        Weight:
                      </label>
                      <strong style={{ fontSize: "0.95rem", color: "#15803D" }}>{weight} kg</strong>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="5"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#15803D", cursor: "pointer", marginTop: "10px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <Link to="/pickups" className="btn-primary" style={{ padding: "12px 24px" }}>
                    <Truck size={17} /> Schedule Doorstep Pickup
                  </Link>
                  <Link to="/rates" className="btn-secondary" style={{ padding: "12px 20px" }}>
                    View All Rate Benchmarks
                  </Link>
                </div>
              </div>

              {/* Calculated Payout Card */}
              <div style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                border: "1.5px solid #A7F3D0",
                padding: "28px",
                textAlign: "center",
                boxShadow: "0 8px 24px rgba(21, 128, 61, 0.1)"
              }}>
                <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#15803D", textTransform: "uppercase" }}>
                  Estimated Instant Payout
                </span>
                <div style={{ fontSize: "2.8rem", fontWeight: "900", color: "#15803D", margin: "6px 0 10px 0" }}>
                  ₹{quickCalc.estimatedPrice.toLocaleString()}
                </div>
                <div style={{
                  backgroundColor: "#F0FDF4",
                  borderRadius: "10px",
                  padding: "10px",
                  fontSize: "0.82rem",
                  color: "#166534",
                  display: "flex",
                  justifyContent: "space-around"
                }}>
                  <span>🌱 <strong>{quickCalc.co2SavedKg} kg</strong> CO₂ Saved</span>
                  <span>💧 <strong>{quickCalc.waterSavedLiters} L</strong> Water Saved</span>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION: ARTICLES & REVIEWS (Exact Boodmo Screenshot Replica) */}
          {/* ========================================================================= */}
          <section style={{ marginBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "#0B3B60", margin: 0 }}>
                  Articles & <span style={{ color: "#00A8E8" }}>Reviews</span>
                </h2>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button style={{ border: "1px solid #CBD5E1", background: "white", borderRadius: "4px", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <ChevronLeft size={14} color="#64748B" />
                  </button>
                  <button style={{ border: "1px solid #CBD5E1", background: "white", borderRadius: "4px", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <ChevronRight size={14} color="#64748B" />
                  </button>
                </div>
              </div>
              <Link to="/about" style={{ color: "#00A8E8", fontWeight: "700", fontSize: "0.88rem", textDecoration: "none" }}>
                VIEW ALL
              </Link>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px"
            }}>
              {GUIDES.map((article, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.04)",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#00A8E8")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                >
                  <div style={{ height: "150px", overflow: "hidden" }}>
                    <img
                      src={article.img}
                      alt={article.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#00A8E8", fontWeight: "700", marginBottom: "6px" }}>
                      <span>{article.category}</span>
                      <span style={{ color: "#94A3B8" }}>{article.time}</span>
                    </div>
                    <h4 style={{ fontSize: "0.98rem", fontWeight: "800", color: "#0F172A", margin: 0, lineHeight: "1.4" }}>
                      {article.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Emergency SOS & Radar Quick Access Banner */}
          <section style={{
            backgroundColor: "#0F172A",
            borderRadius: "16px",
            color: "white",
            padding: "24px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "18px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "46px",
                height: "46px",
                borderRadius: "12px",
                backgroundColor: "#FEF2F2",
                color: "#DC2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h4 style={{ margin: "0 0 2px 0", fontSize: "1.1rem", fontWeight: "800" }}>
                  Vehicle Breakdown or Need Emergency Towing?
                </h4>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#94A3B8" }}>
                  1-Click SOS Roadside dispatch & nearby mechanic GPS locator available 24/7 across India.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                to="/nearby"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontSize: "0.88rem",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Compass size={16} /> Mechanics Radar
              </Link>
              <Link
                to="/emergency"
                style={{
                  backgroundColor: "#DC2626",
                  color: "#FFFFFF",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontSize: "0.88rem",
                  fontWeight: "800",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 4px 14px rgba(220, 38, 38, 0.4)"
                }}
              >
                <AlertTriangle size={16} /> 24/7 Roadside SOS
              </Link>
            </div>
          </section>

        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes plateSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .estimator-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;