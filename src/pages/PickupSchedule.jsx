import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { SCRAP_MATERIAL_RATES, calculateScrapValue } from "../services/ratesService";
import { createPickupBooking, getUserPickups, updatePickupStatus } from "../services/pickupService";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Truck,
  Scale,
  Sparkles,
  Phone,
  ShieldCheck,
  AlertCircle,
  XCircle,
  RotateCcw
} from "lucide-react";

function PickupSchedule() {
  const { currentUser, userData } = useAuth();
  const { coords, locationName, requestLocation } = useGeolocation();

  const [activeTab, setActiveTab] = useState("book"); // 'book' | 'list'
  const [pickups, setPickups] = useState([]);
  const [loadingPickups, setLoadingPickups] = useState(true);

  // Form states
  const [materialId, setMaterialId] = useState("iron");
  const [estimatedWeight, setEstimatedWeight] = useState(100);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState(locationName || userData?.city || "New Delhi");
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 01:00 PM");
  const [userName, setUserName] = useState(userData?.name || currentUser?.displayName || "");
  const [userPhone, setUserPhone] = useState(userData?.phone || "");
  const [instructions, setInstructions] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Calculated estimates
  const calculation = calculateScrapValue(materialId, estimatedWeight);

  // Load user pickups
  const loadPickups = async () => {
    setLoadingPickups(true);
    try {
      const data = await getUserPickups(currentUser?.uid || "guest_seller");
      setPickups(data);
    } catch (err) {
      console.warn("Error fetching pickups:", err);
    } finally {
      setLoadingPickups(false);
    }
  };

  useEffect(() => {
    loadPickups();
  }, [currentUser]);

  // Update address if geolocation detects locationName
  useEffect(() => {
    if (locationName && !address) {
      setCity(locationName);
    }
  }, [locationName]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!userName.trim()) {
      return toast.error("Please enter your contact name.");
    }
    if (!userPhone.trim()) {
      return toast.error("Please enter your phone number.");
    }
    if (!address.trim()) {
      return toast.error("Please enter pickup address.");
    }
    if (!estimatedWeight || Number(estimatedWeight) <= 0) {
      return toast.error("Please enter a valid estimated weight in kg.");
    }

    setSubmitting(true);
    try {
      const payload = {
        userId: currentUser?.uid || "guest_seller",
        userName: userName.trim(),
        userPhone: userPhone.trim(),
        userEmail: currentUser?.email || "unregistered@scrapx.in",
        address: address.trim(),
        city: city.trim(),
        date,
        timeSlot,
        materialId,
        materialName: calculation.material.name,
        estimatedWeight: Number(estimatedWeight),
        estimatedPrice: calculation.estimatedPrice,
        instructions: instructions.trim(),
      };

      const result = await createPickupBooking(payload);
      setConfirmedBooking(result);
      toast.success("Doorstep pickup booked successfully! 🎉");
      loadPickups();
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(err.message || "Failed to book pickup.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelPickup = async (pickupId) => {
    if (!window.confirm("Are you sure you want to cancel this scheduled pickup?")) return;
    try {
      await updatePickupStatus(pickupId, "Cancelled");
      toast.success("Pickup appointment cancelled.");
      loadPickups();
    } catch (err) {
      toast.error("Failed to cancel pickup.");
    }
  };

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "40px 20px 80px" }}>
        <div className="container" style={{ maxWidth: "1040px" }}>
          
          {/* Header Banner */}
          <div style={{
            background: "linear-gradient(135deg, #14532D 0%, #15803D 100%)",
            borderRadius: "20px",
            padding: "36px 32px",
            color: "white",
            marginBottom: "32px",
            boxShadow: "0 10px 25px -5px rgba(20, 83, 45, 0.25)",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ position: "relative", zIndex: 2, maxWidth: "680px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(255, 255, 255, 0.15)", padding: "4px 12px", borderRadius: "20px", fontSize: "0.82rem", fontWeight: "700", marginBottom: "14px" }}>
                <Truck size={14} /> Free Verified Doorstep Collection
              </div>
              <h1 style={{ fontSize: "2.3rem", fontWeight: "800", margin: "0 0 10px 0", letterSpacing: "-0.5px" }}>
                Schedule a Vehicle & Metal Scrap Pickup
              </h1>
              <p style={{ margin: 0, fontSize: "1rem", color: "#BBF7D0", lineHeight: "1.6" }}>
                Instant on-site digital weighing, transparent market price payout via UPI or Cash, and authorized RTO certificate for scrap vehicle disposal.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{
            display: "flex",
            gap: "12px",
            marginBottom: "28px",
            borderBottom: "1px solid #E2E8F0",
            paddingBottom: "12px"
          }}>
            <button
              onClick={() => { setActiveTab("book"); setConfirmedBooking(null); }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: "pointer",
                backgroundColor: activeTab === "book" ? "#15803D" : "transparent",
                color: activeTab === "book" ? "white" : "#475569",
                border: "none",
                transition: "all 0.15s ease"
              }}
            >
              <Calendar size={18} />
              Book New Pickup
            </button>

            <button
              onClick={() => setActiveTab("list")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: "pointer",
                backgroundColor: activeTab === "list" ? "#15803D" : "transparent",
                color: activeTab === "list" ? "white" : "#475569",
                border: "none",
                transition: "all 0.15s ease"
              }}
            >
              <Truck size={18} />
              My Pickups ({pickups.length})
            </button>
          </div>

          {/* TAB 1: Booking Form */}
          {activeTab === "book" && (
            confirmedBooking ? (
              /* Success Confirmation Card */
              <div className="premium-card" style={{ padding: "40px", textAlign: "center" }}>
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "#ECFDF5",
                  color: "#15803D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px"
                }}>
                  <CheckCircle2 size={36} />
                </div>
                <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#0F172A", margin: "0 0 8px" }}>
                  Pickup Appointment Confirmed!
                </h2>
                <p style={{ color: "#64748B", fontSize: "1rem", maxWidth: "480px", margin: "0 auto 24px" }}>
                  Your scrap collection has been assigned reference <strong style={{ color: "#15803D" }}>{confirmedBooking.bookingRef}</strong>. Our logistics truck will arrive with calibrated digital scales.
                </p>

                {/* Summary Table */}
                <div style={{
                  background: "#F8FAFC",
                  borderRadius: "14px",
                  padding: "20px",
                  maxWidth: "520px",
                  margin: "0 auto 28px",
                  border: "1px solid #E2E8F0",
                  textAlign: "left"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ color: "#64748B", fontSize: "0.9rem" }}>Material Category:</span>
                    <strong style={{ color: "#0F172A", fontSize: "0.9rem" }}>{confirmedBooking.materialName}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ color: "#64748B", fontSize: "0.9rem" }}>Estimated Weight:</span>
                    <strong style={{ color: "#0F172A", fontSize: "0.9rem" }}>{confirmedBooking.estimatedWeight} kg</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ color: "#64748B", fontSize: "0.9rem" }}>Estimated Payout:</span>
                    <strong style={{ color: "#15803D", fontSize: "1.1rem" }}>₹{confirmedBooking.estimatedPrice?.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ color: "#64748B", fontSize: "0.9rem" }}>Date & Time Slot:</span>
                    <strong style={{ color: "#0F172A", fontSize: "0.9rem" }}>{confirmedBooking.date} ({confirmedBooking.timeSlot})</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748B", fontSize: "0.9rem" }}>Pickup Address:</span>
                    <strong style={{ color: "#0F172A", fontSize: "0.9rem" }}>{confirmedBooking.address}, {confirmedBooking.city}</strong>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => setActiveTab("list")}
                    className="btn-primary"
                  >
                    View in My Pickups
                  </button>
                  <button
                    onClick={() => setConfirmedBooking(null)}
                    className="btn-secondary"
                  >
                    Book Another Pickup
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Form */
              <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "28px" }} className="booking-layout">
                {/* Form Fields */}
                <form onSubmit={handleBooking} className="premium-card" style={{ padding: "32px" }}>
                  
                  {/* Step 1: Material & Weight */}
                  <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#0F172A", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Scale size={18} style={{ color: "#15803D" }} /> Step 1: Select Scrap Material & Weight
                  </h3>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                      Material Type *
                    </label>
                    <select
                      value={materialId}
                      onChange={(e) => setMaterialId(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: "1px solid #CBD5E1",
                        backgroundColor: "#FFFFFF",
                        fontSize: "0.95rem",
                        color: "#0F172A"
                      }}
                    >
                      {SCRAP_MATERIAL_RATES.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} (Indicative Rate: ₹{item.pricePerKg}/kg)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <label style={{ fontSize: "0.88rem", fontWeight: "600", color: "#475569" }}>
                        Estimated Weight (kg) *
                      </label>
                      <span style={{ fontSize: "0.85rem", color: "#15803D", fontWeight: "700" }}>
                        Rate: ₹{calculation.material.pricePerKg} / kg
                      </span>
                    </div>
                    <input
                      type="number"
                      min="5"
                      step="5"
                      value={estimatedWeight}
                      onChange={(e) => setEstimatedWeight(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: "1px solid #CBD5E1",
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#0F172A"
                      }}
                      required
                    />
                  </div>

                  <hr style={{ border: "none", borderTop: "1px solid #E2E8F0", margin: "24px 0" }} />

                  {/* Step 2: Date & Slot */}
                  <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#0F172A", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Clock size={18} style={{ color: "#15803D" }} /> Step 2: Pickup Date & Time Window
                  </h3>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        value={date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setDate(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "11px 14px",
                          borderRadius: "10px",
                          border: "1px solid #CBD5E1",
                          color: "#0F172A",
                          fontSize: "0.92rem"
                        }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                        Time Slot *
                      </label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "11px 14px",
                          borderRadius: "10px",
                          border: "1px solid #CBD5E1",
                          color: "#0F172A",
                          fontSize: "0.92rem",
                          backgroundColor: "#FFFFFF"
                        }}
                      >
                        <option value="09:00 AM - 12:00 PM">Morning (09:00 AM - 12:00 PM)</option>
                        <option value="12:00 PM - 03:00 PM">Afternoon (12:00 PM - 03:00 PM)</option>
                        <option value="03:00 PM - 06:00 PM">Evening (03:00 PM - 06:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <hr style={{ border: "none", borderTop: "1px solid #E2E8F0", margin: "24px 0" }} />

                  {/* Step 3: Address & Contact */}
                  <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#0F172A", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <MapPin size={18} style={{ color: "#15803D" }} /> Step 3: Location & Contact Details
                  </h3>

                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <label style={{ fontSize: "0.88rem", fontWeight: "600", color: "#475569" }}>
                        Address / Landmark *
                      </label>
                      <button
                        type="button"
                        onClick={requestLocation}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#15803D",
                          fontSize: "0.82rem",
                          fontWeight: "700",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          cursor: "pointer"
                        }}
                      >
                        <MapPin size={13} /> Detect My GPS
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Workshop No. 12, Industrial Area, Near Metro Pillar 140"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: "1px solid #CBD5E1",
                        color: "#0F172A",
                        fontSize: "0.95rem"
                      }}
                      required
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "11px 14px",
                          borderRadius: "10px",
                          border: "1px solid #CBD5E1",
                          color: "#0F172A",
                          fontSize: "0.92rem"
                        }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "11px 14px",
                          borderRadius: "10px",
                          border: "1px solid #CBD5E1",
                          color: "#0F172A",
                          fontSize: "0.92rem"
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                      Special Pickup Notes (Optional)
                    </label>
                    <textarea
                      placeholder="e.g. Engine is unbolted; heavy hydraulic crane required; gate access password..."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      rows="2"
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        borderRadius: "10px",
                        border: "1px solid #CBD5E1",
                        color: "#0F172A",
                        fontSize: "0.92rem",
                        resize: "vertical"
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                    style={{
                      width: "100%",
                      padding: "14px",
                      fontSize: "1.05rem",
                      cursor: submitting ? "not-allowed" : "pointer"
                    }}
                  >
                    {submitting ? "Booking Collection Truck..." : "Confirm Doorstep Pickup Appointment →"}
                  </button>
                </form>

                {/* Sidebar: Real-Time Valuation & Ecological Impact Card */}
                <div>
                  <div className="premium-card" style={{ padding: "24px", position: "sticky", top: "90px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                      <Sparkles size={18} style={{ color: "#15803D" }} />
                      <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "700", color: "#0F172A" }}>
                        Live Estimated Value
                      </h4>
                    </div>

                    <div style={{
                      backgroundColor: "#F0FDF4",
                      border: "1px solid #BBF7D0",
                      borderRadius: "14px",
                      padding: "20px",
                      textAlign: "center",
                      marginBottom: "20px"
                    }}>
                      <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#166534", textTransform: "uppercase" }}>
                        Estimated Payout
                      </span>
                      <div style={{ fontSize: "2.2rem", fontWeight: "800", color: "#15803D", margin: "4px 0" }}>
                        ₹{calculation.estimatedPrice.toLocaleString()}
                      </div>
                      <span style={{ fontSize: "0.85rem", color: "#166534" }}>
                        Based on {estimatedWeight} kg of {calculation.material.name}
                      </span>
                    </div>

                    {/* Environmental Benefit */}
                    <div style={{ marginBottom: "20px" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Eco-Impact of This Pickup:
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
                          <span style={{ color: "#475569" }}>🌱 CO₂ Saved:</span>
                          <strong style={{ color: "#15803D" }}>{calculation.co2SavedKg} kg</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
                          <span style={{ color: "#475569" }}>💧 Water Conserved:</span>
                          <strong style={{ color: "#0284C7" }}>{calculation.waterSavedLiters} L</strong>
                        </div>
                      </div>
                    </div>

                    {/* Trust Guarantees */}
                    <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569", fontSize: "0.85rem", marginBottom: "8px" }}>
                        <ShieldCheck size={16} style={{ color: "#15803D" }} /> Calibrated Digital Weighing
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569", fontSize: "0.85rem", marginBottom: "8px" }}>
                        <CheckCircle2 size={16} style={{ color: "#15803D" }} /> Spot UPI / Bank Transfer
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569", fontSize: "0.85rem" }}>
                        <Phone size={16} style={{ color: "#15803D" }} /> Free Dispatch Support
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* TAB 2: Scheduled Pickups List */}
          {activeTab === "list" && (
            <div>
              {loadingPickups ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#64748B" }}>
                  <p>Loading scheduled collections...</p>
                </div>
              ) : pickups.length === 0 ? (
                <div className="premium-card" style={{ padding: "60px 20px", textAlign: "center" }}>
                  <Truck size={48} style={{ color: "#94A3B8", margin: "0 auto 16px" }} />
                  <h3 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#0F172A", marginBottom: "8px" }}>
                    No Scheduled Pickups Yet
                  </h3>
                  <p style={{ color: "#64748B", fontSize: "0.95rem", maxWidth: "420px", margin: "0 auto 20px" }}>
                    Book your first doorstep scrap collection to have your vehicle parts or metal scrap weighed and paid for instantly.
                  </p>
                  <button onClick={() => setActiveTab("book")} className="btn-primary">
                    Book a Doorstep Pickup Now
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {pickups.map((item) => {
                    const isCancelled = item.status === "Cancelled";
                    const isCompleted = item.status === "Completed";

                    return (
                      <div
                        key={item.id}
                        className="premium-card"
                        style={{
                          padding: "24px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "18px",
                          opacity: isCancelled ? 0.75 : 1
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                            <span style={{ fontSize: "0.82rem", fontWeight: "800", color: "#15803D", background: "#ECFDF5", padding: "3px 8px", borderRadius: "6px" }}>
                              {item.bookingRef}
                            </span>
                            <span className={`badge ${
                              item.status === "Confirmed" ? "badge-success" :
                              item.status === "Scheduled" ? "badge-info" :
                              item.status === "Completed" ? "badge-success" :
                              item.status === "Cancelled" ? "badge-neutral" : "badge-warning"
                            }`}>
                              {item.status}
                            </span>
                            <span style={{ fontSize: "0.85rem", color: "#64748B" }}>
                              Booked on {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#0F172A", margin: "4px 0 8px 0" }}>
                            {item.materialName} ({item.estimatedWeight} kg)
                          </h3>

                          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "0.9rem", color: "#475569" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <Calendar size={15} style={{ color: "#15803D" }} />
                              {item.date} ({item.timeSlot})
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <MapPin size={15} style={{ color: "#15803D" }} />
                              {item.address}, {item.city}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <Phone size={15} style={{ color: "#15803D" }} />
                              {item.userName} ({item.userPhone})
                            </span>
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                          <div style={{ textAlign: "right" }}>
                            <span style={{ fontSize: "0.78rem", color: "#64748B", textTransform: "uppercase", fontWeight: "700" }}>
                              Estimated Value
                            </span>
                            <div style={{ fontSize: "1.4rem", fontWeight: "800", color: isCancelled ? "#94A3B8" : "#15803D" }}>
                              ₹{item.estimatedPrice?.toLocaleString()}
                            </div>
                          </div>

                          {!isCancelled && !isCompleted && (
                            <button
                              onClick={() => handleCancelPickup(item.id)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 14px",
                                border: "1px solid #FECACA",
                                backgroundColor: "#FEF2F2",
                                color: "#DC2626",
                                borderRadius: "8px",
                                fontSize: "0.85rem",
                                fontWeight: "600",
                                cursor: "pointer"
                              }}
                            >
                              <XCircle size={15} /> Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 860px) {
          .booking-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default PickupSchedule;
