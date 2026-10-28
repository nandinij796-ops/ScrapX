import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  Recycle,
  Package,
  Calendar,
  TrendingUp,
  Compass,
  AlertTriangle,
  Bell,
  User,
  PlusCircle,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ShoppingBag
} from "lucide-react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userDropdown, setUserDropdown] = useState(false);
  const { currentUser, userData, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser) return;

    try {
      const q = query(
        collection(db, "buyRequests"),
        where("sellerId", "==", currentUser.uid),
        where("status", "==", "Pending")
      );

      const unsubscribe = onSnapshot(
        q,
        (snap) => {
          setUnreadCount(snap.size);
        },
        (err) => {
          console.warn("Unread notifications notice:", err.message);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn("Notification query setup notice:", err);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      backgroundColor: "#FFFFFF",
      borderBottom: "1px solid #E2E8F0",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      boxShadow: "0 1px 3px 0 rgba(15, 23, 42, 0.05)"
    }}>
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "72px"
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px" }} aria-label="ScrapX Home">
          <div style={{
            background: "linear-gradient(135deg, #22C55E 0%, #15803D 100%)",
            borderRadius: "12px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            boxShadow: "0 2px 8px rgba(21, 128, 61, 0.3)"
          }}>
            <Recycle size={22} />
          </div>
          <div>
            <span style={{ fontSize: "1.45rem", fontWeight: "800", color: "#0F172A", letterSpacing: "-0.5px" }}>
              Scrap<span style={{ color: "#15803D" }}>X</span>
            </span>
            <span style={{ display: "block", fontSize: "0.68rem", color: "#64748B", fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase", marginTop: "-3px" }}>
              Circular Auto Tech
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{
          display: "none",
          alignItems: "center",
          gap: "6px",
          "@media (min-width: 992px)": { display: "flex" }
        }} className="desktop-nav">
          <Link
            to="/scraps"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "0.92rem",
              fontWeight: isActive("/scraps") ? "700" : "500",
              color: isActive("/scraps") ? "#15803D" : "#475569",
              backgroundColor: isActive("/scraps") ? "#ECFDF5" : "transparent",
              transition: "all 0.15s ease"
            }}
          >
            <Package size={17} />
            Marketplace
          </Link>

          <Link
            to="/pickups"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "0.92rem",
              fontWeight: isActive("/pickups") ? "700" : "500",
              color: isActive("/pickups") ? "#15803D" : "#475569",
              backgroundColor: isActive("/pickups") ? "#ECFDF5" : "transparent",
              transition: "all 0.15s ease"
            }}
          >
            <Calendar size={17} />
            Doorstep Pickup
          </Link>

          <Link
            to="/rates"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "0.92rem",
              fontWeight: isActive("/rates") ? "700" : "500",
              color: isActive("/rates") ? "#15803D" : "#475569",
              backgroundColor: isActive("/rates") ? "#ECFDF5" : "transparent",
              transition: "all 0.15s ease"
            }}
          >
            <TrendingUp size={17} />
            Scrap Rates
          </Link>

          <Link
            to="/nearby"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "0.92rem",
              fontWeight: isActive("/nearby") ? "700" : "500",
              color: isActive("/nearby") ? "#15803D" : "#475569",
              backgroundColor: isActive("/nearby") ? "#ECFDF5" : "transparent",
              transition: "all 0.15s ease"
            }}
          >
            <Compass size={17} />
            Radar
          </Link>

          <Link
            to="/emergency"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "0.92rem",
              fontWeight: "700",
              color: "#DC2626",
              backgroundColor: isActive("/emergency") ? "#FEF2F2" : "transparent",
              transition: "all 0.15s ease"
            }}
          >
            <AlertTriangle size={17} />
            Roadside 24/7
          </Link>
        </div>

        {/* Right Action Area */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {currentUser ? (
            <>
              {/* Primary "Sell Scrap" action button */}
              <Link
                to="/addscrap"
                className="btn-primary"
                style={{
                  padding: "9px 18px",
                  fontSize: "0.88rem",
                  boxShadow: "0 2px 6px rgba(21, 128, 61, 0.25)"
                }}
              >
                <PlusCircle size={17} />
                <span className="hide-on-mobile">Sell Scrap</span>
              </Link>

              {/* Orders Link */}
              <Link
                to="/orders"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                  color: "#475569",
                  backgroundColor: "#FFFFFF",
                  transition: "all 0.15s ease"
                }}
                title="My Orders & Offers"
              >
                <ShoppingBag size={18} />
              </Link>

              {/* Notification icon with unread badge */}
              <Link
                to="/notification"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                  color: "#475569",
                  backgroundColor: "#FFFFFF",
                  transition: "all 0.15s ease"
                }}
                title="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    background: "#EF4444",
                    color: "white",
                    fontSize: "0.65rem",
                    fontWeight: "800",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #FFFFFF"
                  }}>
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown / Profile */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 12px",
                    borderRadius: "10px",
                    border: "1px solid #E2E8F0",
                    backgroundColor: "#F8FAFC",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                  aria-expanded={userDropdown}
                  aria-label="User Account Menu"
                >
                  <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#15803D",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: "700"
                  }}>
                    {(userData?.name || currentUser.displayName || currentUser.email || "U")[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#0F172A" }} className="hide-on-mobile">
                    {userData?.name?.split(" ")[0] || currentUser.email?.split("@")[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 8px)",
                      width: "220px",
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.1)",
                      padding: "8px",
                      zIndex: 1100
                    }}
                    onClick={() => setUserDropdown(false)}
                  >
                    <div style={{ padding: "8px 12px 10px", borderBottom: "1px solid #F1F5F9", marginBottom: "6px" }}>
                      <p style={{ margin: 0, fontSize: "0.88rem", fontWeight: "700", color: "#0F172A" }}>
                        {userData?.name || currentUser.email?.split("@")[0]}
                      </p>
                      <span className="badge badge-success" style={{ marginTop: "4px", fontSize: "0.7rem", padding: "2px 8px" }}>
                        {userRole || "Member"}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "0.88rem",
                        color: "#334155",
                        fontWeight: "500",
                        transition: "background 0.15s ease"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8FAFC")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <LayoutDashboard size={16} style={{ color: "#15803D" }} />
                      Command Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "0.88rem",
                        color: "#334155",
                        fontWeight: "500",
                        transition: "background 0.15s ease"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8FAFC")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <User size={16} style={{ color: "#15803D" }} />
                      Profile & Settings
                    </Link>

                    <Link
                      to="/orders"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "0.88rem",
                        color: "#334155",
                        fontWeight: "500",
                        transition: "background 0.15s ease"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8FAFC")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <ShoppingBag size={16} style={{ color: "#15803D" }} />
                      My Orders & Offers
                    </Link>

                    <div style={{ height: "1px", background: "#F1F5F9", margin: "6px 0" }} />

                    <button
                      onClick={handleLogout}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "0.88rem",
                        color: "#DC2626",
                        fontWeight: "600",
                        background: "transparent",
                        textAlign: "left"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FEF2F2")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <Link to="/login" className="btn-secondary" style={{ padding: "8px 16px", fontSize: "0.88rem" }}>
                Log In
              </Link>
              <Link to="/signup" className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.88rem" }}>
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "10px",
              color: "#334155",
              cursor: "pointer"
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {menuOpen && (
        <div style={{
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #E2E8F0",
          padding: "16px 20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
        }}>
          <Link
            to="/scraps"
            onClick={() => setMenuOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "8px", color: "#1E293B", fontWeight: "600" }}
          >
            <Package size={18} style={{ color: "#15803D" }} /> Marketplace
          </Link>
          <Link
            to="/pickups"
            onClick={() => setMenuOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "8px", color: "#1E293B", fontWeight: "600" }}
          >
            <Calendar size={18} style={{ color: "#15803D" }} /> Doorstep Scrap Pickup
          </Link>
          <Link
            to="/rates"
            onClick={() => setMenuOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "8px", color: "#1E293B", fontWeight: "600" }}
          >
            <TrendingUp size={18} style={{ color: "#15803D" }} /> Scrap Rate Sheet & Calculator
          </Link>
          <Link
            to="/nearby"
            onClick={() => setMenuOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "8px", color: "#1E293B", fontWeight: "600" }}
          >
            <Compass size={18} style={{ color: "#15803D" }} /> Nearby Radar
          </Link>
          <Link
            to="/emergency"
            onClick={() => setMenuOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "8px", color: "#DC2626", fontWeight: "700" }}
          >
            <AlertTriangle size={18} /> 🚨 24/7 Roadside Assistance
          </Link>

          {currentUser && (
            <>
              <div style={{ height: "1px", background: "#E2E8F0", margin: "8px 0" }} />
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "8px", color: "#15803D", fontWeight: "700" }}
              >
                <LayoutDashboard size={18} /> Command Dashboard
              </Link>
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "8px", color: "#1E293B", fontWeight: "600" }}
              >
                <ShoppingBag size={18} style={{ color: "#15803D" }} /> Orders & Buy Requests
              </Link>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "8px", color: "#1E293B", fontWeight: "600" }}
              >
                <User size={18} style={{ color: "#15803D" }} /> Profile & Settings
              </Link>
            </>
          )}
        </div>
      )}

      {/* Embedded CSS for responsive visibility */}
      <style>{`
        @media (min-width: 992px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 640px) {
          .hide-on-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
