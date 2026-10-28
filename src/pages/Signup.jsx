import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";
import "./Auth.css";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Recycle, 
  Wrench,
  Eye,
  EyeOff,
  Car,
  AlertCircle
} from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState("Customer");
  const [adminCode, setAdminCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e?.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (role === "Admin" && adminCode !== "SCRAPX-ADMIN-2026") {
      toast.error("Invalid Administrator Access Code. (Use 'SCRAPX-ADMIN-2026' for testing)");
      return;
    }

    setLoading(true);
    try {
      // 1. Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Update Firebase Auth profile displayName
      await updateProfile(user, { displayName: name.trim() });

      const profileData = {
        uid: user.uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || "",
        city: city.trim() || "",
        role,
      };

      try {
        localStorage.setItem(`scrapx_user_${user.uid}`, JSON.stringify(profileData));
      } catch { /* ignore */ }

      // 2. Save profile in Firestore (NEVER STORE PASSWORD)
      try {
        await setDoc(doc(db, "users", user.uid), {
          ...profileData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn("Firestore profile save notice (saved locally):", err.message);
      }

      toast.success("Account created successfully! Welcome to ScrapX 🎉");
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      let errorMsg = error.message;
      if (error.code === "auth/email-already-in-use") {
        errorMsg = "An account with this email already exists. Please log in instead.";
      } else if (error.code === "auth/weak-password") {
        errorMsg = "Password is too weak. Please use at least 6 characters.";
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { id: "Customer", label: "Car Owner / Buyer", icon: Car, desc: "Buy parts & book doorstep scrap pickups" },
    { id: "Seller", label: "Scrap Yard / Recycler", icon: Recycle, desc: "List dismantled parts & bid on scrap" },
    { id: "Mechanic", label: "Workshop / Mechanic", icon: Wrench, desc: "Receive roadside SOS dispatch alerts" },
    { id: "Admin", label: "Administrator", icon: ShieldCheck, desc: "Platform oversight & compliance" },
  ];

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="auth-wrapper">
        <div className="auth-card auth-card-wide">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-logo-badge">
              <Recycle size={28} />
            </div>
            <h1 className="auth-title">Create Your ScrapX Account</h1>
            <p className="auth-subtitle">
              Join India's premier circular automotive salvage & recycling ecosystem
            </p>
          </div>

          <form onSubmit={handleSignup}>
            {/* Role Selector Grid */}
            <div className="auth-role-section">
              <label className="auth-role-label">Select Your Platform Role *</label>
              <div className="auth-role-grid">
                {roleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = role === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setRole(opt.id)}
                      className={`auth-role-card ${isSelected ? "active" : ""}`}
                    >
                      <div className="auth-role-icon">
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="auth-role-title">{opt.label}</div>
                        <div className="auth-role-desc">{opt.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Admin Verification Code if Admin selected */}
            {role === "Admin" && (
              <div className="auth-admin-box">
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <AlertCircle size={15} color="#92400E" />
                  <span className="auth-admin-label">Administrator Authorization Key *</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter secret admin key (demo: SCRAPX-ADMIN-2026)"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="auth-admin-input"
                />
              </div>
            )}

            {/* Inputs Row 1: Name and Email */}
            <div className="auth-form-row">
              <div className="auth-form-group">
                <label className="auth-label">Full Name / Enterprise *</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="auth-input"
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Email Address *</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                  />
                </div>
              </div>
            </div>

            {/* Inputs Row 2: Phone and City */}
            <div className="auth-form-row">
              <div className="auth-form-group">
                <label className="auth-label">Phone Number *</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <Phone size={18} />
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="auth-input"
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label className="auth-label">City / Industrial Hub *</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <MapPin size={18} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mayapuri, New Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="auth-input"
                  />
                </div>
              </div>
            </div>

            {/* Inputs Row 3: Password */}
            <div className="auth-form-group">
              <label className="auth-label">Password (min 6 characters) *</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  style={{ paddingRight: "42px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-password-toggle"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Trust and Compliance Banner */}
            <div className="auth-trust-badge">
              <ShieldCheck size={18} color="#15803D" style={{ flexShrink: 0 }} />
              <span>
                MoRTH registered recycling protocol. User credentials are cryptographically salted and hashed via Firebase Authentication.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
              style={{ marginTop: "16px" }}
            >
              <span>{loading ? "Registering Account..." : "Create ScrapX Account"}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Footer Link */}
          <div className="auth-footer">
            Already registered on ScrapX?{" "}
            <Link to="/login" className="auth-footer-link">
              Sign In here
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
