import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  ShieldCheck,
  Save,
  CheckCircle2,
  Leaf,
  Bell,
  Scale
} from "lucide-react";

function Profile() {
  const { currentUser, userData, userRole, refreshUserData } = useAuth();

  const [name, setName] = useState(userData?.name || currentUser?.displayName || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState(userData?.phone || "");
  const [city, setCity] = useState(userData?.city || "New Delhi, Delhi");
  const [businessName, setBusinessName] = useState(userData?.businessName || "");
  const [selectedRole, setSelectedRole] = useState(userData?.role || userRole || "Seller");
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [rateDigest, setRateDigest] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userData) {
      if (userData.name) setName(userData.name);
      if (userData.phone) setPhone(userData.phone);
      if (userData.city) setCity(userData.city);
      if (userData.businessName) setBusinessName(userData.businessName);
      if (userData.role) setSelectedRole(userData.role);
    }
  }, [userData]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter your name.");

    setSaving(true);
    try {
      const updatedProfile = {
        uid: currentUser?.uid || "guest_profile",
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        city: city.trim(),
        businessName: businessName.trim(),
        role: selectedRole,
        smsAlerts,
        rateDigest,
        updatedAt: new Date().toISOString(),
      };

      // Save locally
      try {
        localStorage.setItem(`scrapx_user_${currentUser?.uid}`, JSON.stringify(updatedProfile));
      } catch { /* ignore */ }

      // Save in Firestore if authenticated
      if (currentUser?.uid) {
        try {
          await setDoc(doc(db, "users", currentUser.uid), {
            ...updatedProfile,
            serverUpdatedAt: serverTimestamp(),
          }, { merge: true });
        } catch (err) {
          console.warn("Firestore profile update notice:", err.message);
        }
      }

      await refreshUserData();
      toast.success("Profile and preferences saved successfully! 🎉");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "40px 20px 80px" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          
          {/* Header */}
          <div style={{ marginBottom: "28px" }}>
            <span className="badge badge-success" style={{ marginBottom: "8px" }}>
              Member Account Settings
            </span>
            <h1 style={{ fontSize: "2.3rem", fontWeight: "800", color: "#0F172A", margin: "4px 0 6px" }}>
              User Profile & Business Info
            </h1>
            <p style={{ color: "#64748B", margin: 0, fontSize: "0.95rem" }}>
              Manage your personal credentials, scrap dealer verification, and automated notification preferences.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "28px" }} className="profile-layout">
            {/* Main Form */}
            <form onSubmit={handleSaveProfile} className="premium-card" style={{ padding: "32px" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#0F172A", marginBottom: "20px" }}>
                Personal & Workshop Credentials
              </h3>

              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                  Full Name *
                </label>
                <div style={{ position: "relative" }}>
                  <User size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 40px",
                      borderRadius: "10px",
                      border: "1px solid #CBD5E1",
                      fontSize: "0.95rem",
                      color: "#0F172A"
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                    <input
                      type="email"
                      value={email}
                      disabled
                      style={{
                        width: "100%",
                        padding: "11px 14px 11px 40px",
                        borderRadius: "10px",
                        border: "1px solid #E2E8F0",
                        backgroundColor: "#F1F5F9",
                        fontSize: "0.92rem",
                        color: "#64748B"
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                    Phone Number (for Pickups & Offers)
                  </label>
                  <div style={{ position: "relative" }}>
                    <Phone size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      style={{
                        width: "100%",
                        padding: "11px 14px 11px 40px",
                        borderRadius: "10px",
                        border: "1px solid #CBD5E1",
                        fontSize: "0.92rem",
                        color: "#0F172A"
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                    Workshop / Business Name
                  </label>
                  <div style={{ position: "relative" }}>
                    <Building2 size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                    <input
                      type="text"
                      placeholder="e.g. Apex Auto Dismantlers"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "11px 14px 11px 40px",
                        borderRadius: "10px",
                        border: "1px solid #CBD5E1",
                        fontSize: "0.92rem",
                        color: "#0F172A"
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                    Operating City / Hub
                  </label>
                  <div style={{ position: "relative" }}>
                    <MapPin size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "11px 14px 11px 40px",
                        borderRadius: "10px",
                        border: "1px solid #CBD5E1",
                        fontSize: "0.92rem",
                        color: "#0F172A"
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                  Primary ScrapX Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "#FFFFFF",
                    fontSize: "0.92rem",
                    color: "#0F172A",
                    fontWeight: "600"
                  }}
                >
                  <option value="Seller">Seller (Sell spare parts & salvaged inventory)</option>
                  <option value="Customer">Customer (Browse & buy genuine spare parts)</option>
                  <option value="Scrap Dealer">Scrap Dealer (Bulk industrial scrap purchases)</option>
                  <option value="Mechanic">Mechanic (Roadside assistance provider)</option>
                  <option value="Admin">Platform Administrator</option>
                </select>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #E2E8F0", margin: "24px 0" }} />

              {/* Notification Toggles */}
              <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#0F172A", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Bell size={18} style={{ color: "#15803D" }} /> Communication & Alerts
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#334155", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: "#15803D" }}
                  />
                  <span>Receive instant SMS / WhatsApp updates on new buy offers and pickup arrivals</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#334155", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={rateDigest}
                    onChange={(e) => setRateDigest(e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: "#15803D" }}
                  />
                  <span>Receive weekly scrap rate updates and industrial recycling market movements</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
                style={{ width: "100%", padding: "13px", fontSize: "1rem" }}
              >
                <Save size={18} />
                {saving ? "Saving Changes..." : "Save Profile & Preferences"}
              </button>
            </form>

            {/* Right Card: Sustainability & Verification Badge */}
            <div>
              <div className="premium-card" style={{ padding: "24px", textAlign: "center", position: "sticky", top: "90px" }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "#ECFDF5",
                  color: "#15803D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px"
                }}>
                  <Leaf size={30} />
                </div>

                <h4 style={{ margin: "0 0 4px", fontSize: "1.1rem", fontWeight: "800", color: "#0F172A" }}>
                  Verified Recycler Score
                </h4>
                <span className="badge badge-success" style={{ marginBottom: "16px" }}>
                  Active Contributor
                </span>

                <div style={{
                  backgroundColor: "#F8FAFC",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid #E2E8F0",
                  textAlign: "left",
                  marginBottom: "16px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem" }}>
                    <span style={{ color: "#64748B" }}>Total Scrap Diverted:</span>
                    <strong style={{ color: "#15803D" }}>295 kg</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem" }}>
                    <span style={{ color: "#64748B" }}>CO₂ Offset:</span>
                    <strong style={{ color: "#15803D" }}>480 kg</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "#64748B" }}>Verification Tier:</span>
                    <strong style={{ color: "#0F172A" }}>Level 2 (ID & GST)</strong>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center", color: "#64748B", fontSize: "0.82rem" }}>
                  <ShieldCheck size={16} style={{ color: "#15803D" }} /> RTO Scrappage Compliant
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .profile-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Profile;
