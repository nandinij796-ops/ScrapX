import { Link, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);


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
    <nav className="navbar">

      <h2>ScrapX</h2>

      <div className="nav-links">

        <Link to="/">Home</Link>

        <Link to="/scraps">
          Scrap List
        </Link>

        <Link to="/addscrap">
          Add Scrap
        </Link>

        <Link to="/notifications">
          🔔 Notifications
        </Link>

        <Link to="/contact">
          Contact
        </Link>

        <Link to="/emergency-list">
          Emergency List
        </Link>

        <Link to="/emergency">
          Emergency
        </Link>

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/services">
          Services
        </Link>

        <Link to="/about">
          About
        </Link>


        {user ? (
          <>
            <span className="welcome">
              Welcome {user.email}
            </span>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/signup">
              Signup
            </Link>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;