import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.jpg";
import "./Navbar.css";

function Navbar() {
  const { currentUser, userData } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="ScrapX Logo" />
          ScrapX
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? "✖" : "☰"}
        </div>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

          {currentUser ? (
            <>
              {/* Unified Marketplace & Seller Hub */}
              <Link to="/scraps" onClick={() => setMenuOpen(false)}>Marketplace (Buy)</Link>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Seller Hub (Sell)</Link>
              
              {/* Specialized roles */}
              {userData?.role === "Mechanic" && (
                <Link to="/emergency-list" onClick={() => setMenuOpen(false)}>Service Requests</Link>
              )}
              
              <Link to="/emergency" onClick={() => setMenuOpen(false)}>Emergency Help</Link>
              <Link to="/notification" onClick={() => setMenuOpen(false)}>🔔</Link>
              
              <div className="user-section">
                <span className="welcome">
                  Hi, {userData?.name || currentUser.email?.split('@')[0]}
                  {userData?.role && <span style={{fontSize: "12px", color: "#6b7280", marginLeft: "5px"}}>({userData.role})</span>}
                </span>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="signup-btn" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;