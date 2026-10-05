import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./Login.css";
import { toast } from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if(!email || !password) return toast.error("Please fill both fields.");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully 🎉");
      navigate("/");
    } catch(error) {
      toast.error(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      // If user doesn't exist, create profile with default Customer role
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName || "Google User",
          email: user.email,
          role: "Customer", // Default role
          createdAt: serverTimestamp(),
        });
      }

      toast.success("Google Sign-In Successful 🎉");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", color: "#f8fafc" }}>
      <Navbar />

      <div className="login-container" style={{
        background: "#1e293b", 
        border: "1px solid #334155", 
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
        maxWidth: "400px",
        margin: "80px auto",
        padding: "40px",
        borderRadius: "16px",
        textAlign: "center"
      }}>

        <h2 style={{ marginBottom: "30px", fontSize: "2rem" }}>Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          style={{
            width: "100%", padding: "12px", marginBottom: "15px", 
            borderRadius: "8px", border: "1px solid #334155",
            background: "#0f172a", color: "white"
          }}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          style={{
            width: "100%", padding: "12px", marginBottom: "25px", 
            borderRadius: "8px", border: "1px solid #334155",
            background: "#0f172a", color: "white"
          }}
        />

        <button onClick={handleLogin} style={{
          width: "100%", padding: "12px", background: "#3b82f6", 
          color: "white", border: "none", borderRadius: "8px", 
          fontSize: "1.1rem", fontWeight: "600", cursor: "pointer",
          marginBottom: "15px"
        }}>
          Login 🚗
        </button>

        <div style={{ display: "flex", alignItems: "center", margin: "15px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "#334155" }}></div>
          <span style={{ margin: "0 10px", color: "#94a3b8" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "#334155" }}></div>
        </div>

        <button onClick={handleGoogleSignIn} style={{
          width: "100%", padding: "12px", background: "white", 
          color: "#1e293b", border: "none", borderRadius: "8px", 
          fontSize: "1.05rem", fontWeight: "600", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
        }}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: "20px" }} />
          Sign in with Google
        </button>

      </div>
    </div>
  );
}

export default Login;