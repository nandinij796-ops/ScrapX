import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Customer");

  const handleSignup = async () => {
    if (!name || !email || !password || !role) {
      alert("Please fill all fields.");
      return;
    }
    try {
      // 1. Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Save profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        role,
        createdAt: serverTimestamp(),
      });

      alert("Signup Successful 🎉");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar />

      <div className="login-container">
        <h2>Sign Up for ScrapX</h2>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: "10px", marginBottom: "20px", width: "100%", maxWidth: "400px" }}
        >
          <option value="Customer">Vehicle Owner / Customer</option>
          <option value="Mechanic">Mechanic</option>
          <option value="Scrap Dealer">Scrap Dealer</option>
          <option value="Seller">Spare Parts Seller</option>
        </select>

        <input
          type="text"
          placeholder="Enter Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSignup}>Sign Up</button>
      </div>
    </>
  );
}

export default Signup;
