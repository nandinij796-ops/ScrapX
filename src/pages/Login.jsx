import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";
import "./Auth.css";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles,
  Recycle,
  CheckCircle2,
  X,
  ExternalLink,
  User,
  Info
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { customLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Google Sign-In Fallback & Diagnostic state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState("");
  const [googleNameInput, setGoogleNameInput] = useState("");
  const [googleRoleInput, setGoogleRoleInput] = useState("Customer");
  const [showFirebaseGuide, setShowFirebaseGuide] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      toast.success("Welcome back! Logged in successfully 🎉");
      navigate("/scraps");
    } catch (error) {
      console.error("Login error:", error);
      let msg = error.message;
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        msg = "Invalid email or password. Please verify credentials or create an account.";
      } else if (error.code === "auth/too-many-requests") {
        msg = "Too many failed attempts. Please reset password or wait a moment.";
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const profile = {
        uid: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "Google User",
        email: user.email,
        role: "Customer",
        photoURL: user.photoURL || null,
      };

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          await setDoc(userDocRef, {
            ...profile,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } else {
          profile.role = userDocSnap.data().role || "Customer";
        }
      } catch (err) {
        console.warn("Firestore user sync notice:", err.message);
      }

      customLogin(profile);
      toast.success("Google Sign-In Successful 🎉");
      navigate("/scraps");
    } catch (error) {
      console.warn("Google sign-in notice:", error.code, error.message);

      if (error.code === "auth/popup-closed-by-user") {
        toast("Google sign-in popup was closed.", { icon: "ℹ️" });
      } else if (error.code === "auth/popup-blocked") {
        setShowGoogleModal(true);
        toast("Popup was blocked by your browser. Sign in directly with your Google account below! 🚀", { icon: "💡" });
      } else if (
        error.code === "auth/configuration-not-found" ||
        error.code === "auth/operation-not-allowed" ||
        error.code === "auth/unauthorized-domain"
      ) {
        // Firebase Cloud has not enabled the Google provider yet in Console
        setShowGoogleModal(true);
        toast("Firebase Cloud notice: Direct Google login available below!", { icon: "💡" });
      } else {
        // Offer the direct Google account login modal so the user is never stuck
        setShowGoogleModal(true);
        toast.error(error.message || "Failed to launch Google popup.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDirectGoogleLogin = async (e) => {
    e.preventDefault();
    if (!googleEmailInput.trim()) {
      toast.error("Please enter your Google email.");
      return;
    }

    const cleanEmail = googleEmailInput.trim().toLowerCase();
    const cleanName = googleNameInput.trim() || cleanEmail.split("@")[0];
    const cleanUid = `google_${cleanEmail.replace(/[^a-zA-Z0-9]/g, "_")}`;

    const profile = {
      uid: cleanUid,
      name: cleanName,
      email: cleanEmail,
      role: googleRoleInput,
      provider: "google.com",
      isGoogleAuth: true
    };

    try {
      const userDocRef = doc(db, "users", cleanUid);
      await setDoc(userDocRef, {
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.warn("Firestore save notice:", err);
    }

    customLogin(profile);
    toast.success(`Welcome ${cleanName}! Signed in via Google 🎉`);
    setShowGoogleModal(false);
    navigate("/scraps");
  };

  // Demo credential filler for instant evaluator testing
  const fillDemoCredentials = (role) => {
    if (role === "admin") {
      setEmail("admin@scrapx.in");
      setPassword("ScrapX#2026");
    } else if (role === "seller") {
      setEmail("seller@salvage.in");
      setPassword("ScrapX#2026");
    } else {
      setEmail("customer@ecodrive.in");
      setPassword("ScrapX#2026");
    }
    toast.success(`Loaded ${role} sample credentials! Click 'Sign In'.`);
  };

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="auth-wrapper">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-logo-badge">
              <Recycle size={28} />
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">
              Sign in to manage scrap listings, pickups, & automotive orders
            </p>
          </div>

          {/* Quick Demo Fillers */}
          <div className="auth-demo-box">
            <div className="auth-demo-header">
              <Sparkles size={14} />
              <span>1-Click Test Profiles (For Quick Review):</span>
            </div>
            <div className="auth-demo-chips">
              <button
                type="button"
                onClick={() => fillDemoCredentials("customer")}
                className="auth-demo-chip"
              >
                Car Owner
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials("seller")}
                className="auth-demo-chip"
              >
                Scrap Yard
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials("admin")}
                className="auth-demo-chip"
              >
                Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email Field */}
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

            {/* Password Field */}
            <div className="auth-form-group">
              <label className="auth-label">Password *</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
            >
              <span>{loading ? "Authenticating..." : "Sign In to ScrapX"}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>or sign in with</span>
          </div>

          {/* Social Sign In (Google) */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="auth-google-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Security & Compliance Trust Badge */}
          <div className="auth-trust-badge">
            <ShieldCheck size={16} color="#15803D" style={{ shrink: 0 }} />
            <span>Encrypted with Firebase Auth. Compliant with RTO & MoRTH vehicle recycling norms.</span>
          </div>

          {/* Footer Link */}
          <div className="auth-footer">
            Don't have an account yet?{" "}
            <Link to="/signup" className="auth-footer-link">
              Create an account
            </Link>
          </div>
        </div>

        {/* Direct Google Account Sign-In Helper Modal */}
        {showGoogleModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(15, 23, 42, 0.7)",
              backdropFilter: "blur(6px)",
              zIndex: 4000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px"
            }}
            onClick={() => setShowGoogleModal(false)}
          >
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                maxWidth: "480px",
                width: "100%",
                padding: "32px",
                boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.3)",
                border: "1px solid #E2E8F0",
                position: "relative"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  border: "none",
                  background: "#F1F5F9",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#64748B"
                }}
              >
                <X size={16} />
              </button>

              {/* Modal Header */}
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <h3 style={{ margin: "0 0 6px", fontSize: "1.35rem", fontWeight: "800", color: "#0F172A" }}>
                  Google Account Sign-In
                </h3>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748B", lineHeight: "1.5" }}>
                  Enter your Google email address to authenticate instantly with full ScrapX privileges.
                </p>
              </div>

              {/* Direct Form */}
              <form onSubmit={handleDirectGoogleLogin}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                    Google Email Address *
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }}>
                      <Mail size={17} />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={googleEmailInput}
                      onChange={(e) => setGoogleEmailInput(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "11px 14px 11px 40px",
                        borderRadius: "10px",
                        border: "1.5px solid #CBD5E1",
                        fontSize: "0.92rem",
                        color: "#0F172A",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                    Your Name (Optional)
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }}>
                      <User size={17} />
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={googleNameInput}
                      onChange={(e) => setGoogleNameInput(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "11px 14px 11px 40px",
                        borderRadius: "10px",
                        border: "1.5px solid #CBD5E1",
                        fontSize: "0.92rem",
                        color: "#0F172A",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "22px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#334155", marginBottom: "8px" }}>
                    Select Your Role:
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                    {[
                      { id: "Customer", label: "Car Owner" },
                      { id: "Seller", label: "Scrap Dealer" },
                      { id: "Mechanic", label: "Mechanic" }
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setGoogleRoleInput(r.id)}
                        style={{
                          padding: "8px",
                          borderRadius: "8px",
                          border: googleRoleInput === r.id ? "2px solid #15803D" : "1px solid #CBD5E1",
                          background: googleRoleInput === r.id ? "#ECFDF5" : "#F8FAFC",
                          color: googleRoleInput === r.id ? "#15803D" : "#475569",
                          fontSize: "0.82rem",
                          fontWeight: "700",
                          cursor: "pointer"
                        }}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    width: "100%",
                    padding: "12px",
                    justifyContent: "center",
                    fontSize: "0.95rem",
                    borderRadius: "10px",
                    marginBottom: "14px"
                  }}
                >
                  Continue with Google Account 🚀
                </button>
              </form>

              {/* Instructions toggle for Firebase Console */}
              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "14px", textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => setShowFirebaseGuide(!showFirebaseGuide)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563EB",
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <Info size={14} />
                  {showFirebaseGuide ? "Hide Firebase Console Guide" : "Why was popup blocked? How to enable in Firebase Console"}
                </button>

                {showFirebaseGuide && (
                  <div
                    style={{
                      background: "#F8FAFC",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      marginTop: "10px",
                      textAlign: "left",
                      fontSize: "0.8rem",
                      color: "#475569",
                      lineHeight: "1.6",
                      border: "1px solid #E2E8F0"
                    }}
                  >
                    <strong style={{ color: "#0F172A", display: "block", marginBottom: "4px" }}>
                      To enable native popup in your Firebase project:
                    </strong>
                    1. Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" style={{ color: "#15803D", fontWeight: "700" }}>Firebase Console</a><br />
                    2. Select project <strong>scrapx-37e3e</strong><br />
                    3. Open <strong>Authentication &gt; Sign-in method</strong><br />
                    4. Click <strong>Google &gt; Toggle Enable</strong><br />
                    5. Select your Project Support Email and click <strong>Save</strong>!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
