import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import InstagramNotificationPopup from "./InstagramNotificationPopup";
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
  ShoppingBag,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Info,
  PhoneCall,
  ShieldCheck
} from "lucide-react";

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(() => {
    const allSeen = localStorage.getItem("scrapx_notifications_all_seen") === "true";
    const welcomeSeen = localStorage.getItem("scrapx_welcome_notification_seen") === "true";
    if (allSeen || welcomeSeen) return 0;
    return 1;
  });
  const [userDropdown, setUserDropdown] = useState(false);
  const { currentUser, userData, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleSeen = () => {
      setUnreadCount(0);
    };
    window.addEventListener("notifications_seen", handleSeen);
    return () => window.removeEventListener("notifications_seen", handleSeen);
  }, []);

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
          if (!snap.empty) {
            const seenIds = JSON.parse(localStorage.getItem("scrapx_seen_notification_ids") || "[]");
            const unread = snap.docs.filter((doc) => !seenIds.includes(doc.id)).length;
            setUnreadCount(unread);
          } else {
            setUnreadCount(0);
          }
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

  const handleNotificationClick = () => {
    setUnreadCount(0);
    localStorage.setItem("scrapx_notifications_all_seen", "true");
    localStorage.setItem("scrapx_welcome_notification_seen", "true");
    window.dispatchEvent(new Event("notifications_seen"));
  };

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

  const moreFeaturesList = [
    {
      to: "/scraps",
      icon: <Package size={18} style={{ color: "#15803D" }} />,
      title: "Spare Parts Marketplace",
      desc: "Buy & sell certified OEM salvage parts",
      badge: "Featured"
    },
    {
      to: "/pickups",
      icon: <Calendar size={18} style={{ color: "#2563EB" }} />,
      title: "Doorstep Scrap Pickup",
      desc: "Book digital weighing & instant UPI payout",
      badge: "Popular"
    },
    {
      to: "/rates",
      icon: <TrendingUp size={18} style={{ color: "#059669" }} />,
      title: "Scrap Rates & Calculator",
      desc: "Official live scrap metal price benchmarks",
      badge: null
    },
    {
      to: "/nearby",
      icon: <Compass size={18} style={{ color: "#7C3AED" }} />,
      title: "Nearby Mechanics Radar",
      desc: "Find certified workshops & scrap yards",
      badge: "GPS"
    },
    {
      to: "/emergency",
      icon: <AlertTriangle size={18} style={{ color: "#DC2626" }} />,
      title: "24/7 Roadside Rescue",
      desc: "Emergency breakdown, towing & jumpstart",
      badge: "SOS"
    },
    {
      to: "/chat",
      icon: <MessageSquare size={18} style={{ color: "#0284C7" }} />,
      title: "Encrypted Secure Chat",
      desc: "Direct buyer-seller private negotiation",
      badge: "E2E"
    },
    {
      to: "/orders",
      icon: <ShoppingBag size={18} style={{ color: "#D97706" }} />,
      title: "Orders & Buy Requests",
      desc: "Track active salvage offers & status",
      badge: null
    },
    {
      to: "/dashboard",
      icon: <LayoutDashboard size={18} style={{ color: "#15803D" }} />,
      title: "Command Dashboard",
      desc: "Inventory management & analytics",
      badge: "Admin"
    },
    {
      to: "/services",
      icon: <Sparkles size={18} style={{ color: "#475569" }} />,
      title: "All Solutions & Services",
      desc: "Full overview of circular auto infrastructure",
      badge: null
    },
    {
      to: "/about",
      icon: <Info size={18} style={{ color: "#475569" }} />,
      title: "About ScrapX",
      desc: "Our mission, green compliance & team",
      badge: null
    },
    {
      to: "/contact",
      icon: <PhoneCall size={18} style={{ color: "#475569" }} />,
      title: "Contact & Help Center",
      desc: "24/7 customer care & partner support",
      badge: null
    }
  ];

  return (
    <>
      {/* Instagram Push Notification Pop-up */}
      <InstagramNotificationPopup />

      <nav
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0 1px 3px 0 rgba(15, 23, 42, 0.05)"
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "72px"
          }}
        >
          {/* Brand Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px" }} aria-label="ScrapX Home">
            <div
              style={{
                background: "linear-gradient(135deg, #22C55E 0%, #15803D 100%)",
                borderRadius: "12px",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                boxShadow: "0 2px 8px rgba(21, 128, 61, 0.3)"
              }}
            >
              <Recycle size={22} />
            </div>
            <div>
              <span style={{ fontSize: "1.45rem", fontWeight: "800", color: "#0F172A", letterSpacing: "-0.5px" }}>
                Scrap<span style={{ color: "#15803D" }}>X</span>
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "0.68rem",
                  color: "#64748B",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  marginTop: "-3px"
                }}
              >
                Circular Auto Tech
              </span>
            </div>
          </Link>

          {/* Center Navigation: ONLY Marketplace + ☰ More Features */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* ONLY Marketplace link remains directly visible */}
            <Link
              to="/scraps"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 18px",
                borderRadius: "10px",
                fontSize: "0.94rem",
                fontWeight: isActive("/scraps") ? "800" : "600",
                color: isActive("/scraps") ? "#15803D" : "#1E293B",
                backgroundColor: isActive("/scraps") ? "#ECFDF5" : "#F8FAFC",
                border: isActive("/scraps") ? "1.5px solid #A7F3D0" : "1px solid #E2E8F0",
                transition: "all 0.15s ease",
                boxShadow: isActive("/scraps") ? "0 2px 8px rgba(21, 128, 61, 0.12)" : "none"
              }}
            >
              <Package size={18} style={{ color: "#15803D" }} />
              <span>Marketplace</span>
            </Link>

            {/* Three-line icon for ALL other features */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 16px",
                borderRadius: "10px",
                fontSize: "0.92rem",
                fontWeight: "700",
                color: "#1E293B",
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F1F5F9";
                e.currentTarget.style.borderColor = "#CBD5E1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#F8FAFC";
                e.currentTarget.style.borderColor = "#E2E8F0";
              }}
              aria-label="Open More Features Menu"
            >
              <Menu size={19} style={{ color: "#15803D" }} />
              <span className="hide-on-mobile">More Features</span>
            </button>
          </div>

          {/* Right Action Area */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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

                {/* Notification icon with Instagram-style unread badge number */}
                <Link
                  to="/notification"
                  onClick={handleNotificationClick}
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
                    <span
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        background: "#EF4444",
                        color: "white",
                        fontSize: "0.68rem",
                        fontWeight: "800",
                        minWidth: "19px",
                        height: "19px",
                        padding: "0 4px",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #FFFFFF",
                        boxShadow: "0 2px 6px rgba(239, 68, 68, 0.4)",
                        animation: "badgePulse 2s infinite"
                      }}
                    >
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
                    <div
                      style={{
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
                      }}
                    >
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
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {/* Notification icon also visible when logged out for guest demo alerts */}
                <Link
                  to="/notification"
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    border: "1px solid #E2E8F0",
                    color: "#475569",
                    backgroundColor: "#FFFFFF"
                  }}
                  title="Notifications"
                >
                  <Bell size={17} />
                  <span
                    style={{
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
                      justifyContent: "center"
                    }}
                  >
                    {unreadCount}
                  </span>
                </Link>

                <Link to="/login" className="btn-secondary" style={{ padding: "8px 14px", fontSize: "0.85rem" }}>
                  Log In
                </Link>
                <Link to="/signup" className="btn-primary" style={{ padding: "8px 14px", fontSize: "0.85rem" }}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Side Drawer for "More Features" (Three Line Icon) */}
        {drawerOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 3000,
              display: "flex",
              justifyContent: "flex-end"
            }}
            onClick={() => setDrawerOpen(false)}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "420px",
                height: "100%",
                backgroundColor: "#FFFFFF",
                boxShadow: "-10px 0 30px rgba(0, 0, 0, 0.2)",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                animation: "drawerSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div
                style={{
                  padding: "20px 24px",
                  borderBottom: "1px solid #E2E8F0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#F8FAFC"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "#15803D",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Menu size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: "800", color: "#0F172A" }}>
                      More Features
                    </h3>
                    <span style={{ fontSize: "0.78rem", color: "#64748B" }}>ScrapX Circular Auto Tools</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "1px solid #E2E8F0",
                    background: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#64748B"
                  }}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Links List */}
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                {moreFeaturesList.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setDrawerOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      textDecoration: "none",
                      backgroundColor: isActive(item.to) ? "#ECFDF5" : "transparent",
                      border: isActive(item.to) ? "1px solid #A7F3D0" : "1px solid transparent",
                      transition: "all 0.15s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive(item.to)) e.currentTarget.style.backgroundColor = "#F8FAFC";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(item.to)) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "10px",
                          background: "#F1F5F9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "0.92rem", fontWeight: "700", color: "#0F172A" }}>
                            {item.title}
                          </span>
                          {item.badge && (
                            <span
                              style={{
                                fontSize: "0.68rem",
                                fontWeight: "800",
                                padding: "1px 6px",
                                borderRadius: "6px",
                                backgroundColor: item.badge === "SOS" ? "#FEF2F2" : "#ECFDF5",
                                color: item.badge === "SOS" ? "#DC2626" : "#15803D"
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: "0.78rem", color: "#64748B", display: "block", marginTop: "2px" }}>
                          {item.desc}
                        </span>
                      </div>
                    </div>

                    <ChevronRight size={16} style={{ color: "#94A3B8" }} />
                  </Link>
                ))}
              </div>

              {/* Drawer Footer CTA */}
              <div style={{ padding: "16px 20px 24px", borderTop: "1px solid #E2E8F0", background: "#F8FAFC" }}>
                <Link
                  to="/addscrap"
                  onClick={() => setDrawerOpen(false)}
                  className="btn-primary"
                  style={{ width: "100%", padding: "12px", justifyContent: "center" }}
                >
                  <PlusCircle size={17} /> List a Scrap Part for Sale
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Global Styles for Drawer Animation & Pulse */}
        <style>{`
          @keyframes drawerSlideIn {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(0);
            }
          }
          @keyframes badgePulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.15);
            }
            100% {
              transform: scale(1);
            }
          }
          @media (max-width: 640px) {
            .hide-on-mobile { display: none !important; }
          }
        `}</style>
      </nav>
    </>
  );
}

export default Navbar;