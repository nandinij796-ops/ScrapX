
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

function Navbar() {
  const [user, setUser] = useState(null);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return () => unsubscribe();
}, []);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged Out Successfully");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        backgroundColor: "#333",
      }}
    >
      <h2 style={{ color: "white" }}>ScrapX</h2>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Home
        </Link>
        <Link
  to="/scraps"
  style={{ color: "white", textDecoration: "none" }}
>
  Scrap List
</Link>

        <Link to="/about" style={{ color: "white", textDecoration: "none" }}>
          About
        </Link>

        <Link to="/services" style={{ color: "white", textDecoration: "none" }}>
          Services
        </Link>

        <Link to="/contact" style={{ color: "white", textDecoration: "none" }}>
          Contact
        </Link>
        <Link
  to="/addscrap"
  style={{ color: "white", textDecoration: "none" }}
>
  Add Scrap
</Link>

        {user ? (
  <>
    <span style={{ color: "white" }}>
      Welcome {user.email}
    </span>

    <button
      onClick={handleLogout}
      style={{
        background: "red",
        color: "white",
        border: "none",
        padding: "8px 15px",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  </>
) : (
  <>
    <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
      Login
    </Link>

    <Link to="/signup" style={{ color: "white", textDecoration: "none" }}>
      Signup
    </Link>
  </>
)}

        
        
      </div>
    </nav>
  );
}

export default Navbar;