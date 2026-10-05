import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import hero from "../assets/hero.jpg";
import { db } from "../firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredScraps, setFeaturedScraps] = useState([]);

  useEffect(() => {
    const fetchFeaturedScraps = async () => {
      try {
        const q = query(collection(db, "scraps"), where("status", "==", "Available"), limit(8));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeaturedScraps(data);
      } catch (error) {
        console.error("Error fetching featured scraps:", error);
      }
    };
    fetchFeaturedScraps();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/scraps?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const services = [
    {
      icon: "🔧",
      title: "Nearby Mechanics",
      desc: "Find trusted mechanics near your location instantly with real-time tracking.",
      link: "/nearby"
    },
    {
      icon: "♻️",
      title: "Spare Parts Market",
      desc: "Buy and sell quality spare parts at affordable prices in a trusted marketplace.",
      link: "/scraps"
    },
    {
      icon: "🏪",
      title: "Verified Dealers",
      desc: "Connect directly with certified scrap dealers and skip the middleman.",
      link: "/about"
    },
    {
      icon: "🚨",
      title: "Emergency Assist",
      desc: "Get 24/7 instant assistance whenever your vehicle needs urgent help.",
      link: "/emergency"
    },
    {
      icon: "💬",
      title: "Secure Chat",
      desc: "Communicate directly with sellers or buyers with end-to-end encrypted messaging.",
      link: "/chat"
    }
  ];

  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", color: "#f8fafc" }}>
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "60px 5%",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          minHeight: "80vh",
        }}
      >
        <div style={{ flex: "1 1 500px", padding: "20px" }}>
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: "800",
              color: "#f8fafc",
              lineHeight: "1.2",
              marginBottom: "20px",
            }}
          >
            Smarter Vehicle <br />
            <span style={{ color: "#3b82f6" }}>Scrap & Rescue.</span>
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#94a3b8",
              marginBottom: "30px",
              maxWidth: "480px",
              lineHeight: "1.6",
            }}
          >
            The ultimate platform to manage vehicle scrap, find genuine spare
            parts, and get rapid emergency assistance wherever you are.
          </p>

          <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", marginBottom: "30px", maxWidth: "480px" }}>
            <input 
              type="text" 
              placeholder="Search for parts, e.g. Nexon Headlight"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: "1",
                padding: "14px 20px",
                borderRadius: "10px",
                border: "1px solid #334155",
                background: "#1e293b",
                color: "#f8fafc",
                fontSize: "1rem"
              }}
            />
            <button 
              type="submit"
              style={{
                background: "#3b82f6",
                color: "white",
                padding: "14px 24px",
                border: "none",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#2563eb")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#3b82f6")}
            >
              Search
            </button>
          </form>

          <div style={{ display: "flex", gap: "15px" }}>
            <Link
              to="/signup"
              style={{
                display: "inline-block",
                background: "#3b82f6",
                color: "white",
                padding: "14px 32px",
                borderRadius: "10px",
                fontSize: "1.1rem",
                fontWeight: "600",
                boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
                transition: "transform 0.2s, background 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#2563eb")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#3b82f6")}
            >
              Get Started 🚀
            </Link>
            <Link
              to="/emergency"
              style={{
                display: "inline-block",
                background: "#ef4444",
                color: "white",
                padding: "14px 32px",
                borderRadius: "10px",
                fontSize: "1.1rem",
                fontWeight: "600",
                boxShadow: "0 10px 15px -3px rgba(239, 68, 68, 0.3)",
                transition: "transform 0.2s, background 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#dc2626")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#ef4444")}
            >
              Emergency 🚨
            </Link>
          </div>
        </div>

        <div style={{ flex: "1 1 400px", display: "flex", justifyContent: "center" }}>
          <img
            src={hero}
            alt="ScrapX Automotive Parts"
            style={{
              width: "100%",
              maxWidth: "500px",
              borderRadius: "20px",
              boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)",
              transform: "perspective(1000px) rotateY(-5deg)",
              border: "1px solid #334155"
            }}
          />
        </div>
      </section>

      {/* Services Section */}
      <section style={{ padding: "80px 5%", background: "#0f172a" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 style={{ fontSize: "2.5rem", color: "#f8fafc", fontWeight: "700" }}>
            Everything You Need
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "1.1rem", marginTop: "10px" }}>
            A complete ecosystem for vehicle management and emergency recovery.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {services.map((service, index) => (
            <Link
              to={service.link}
              key={index}
              style={{
                background: "#1e293b",
                padding: "40px 30px",
                borderRadius: "16px",
                border: "1px solid #334155",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                textAlign: "center",
                textDecoration: "none"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.4)";
                e.currentTarget.style.borderColor = "#3b82f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.2)";
                e.currentTarget.style.borderColor = "#334155";
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  margin: "0 auto 20px",
                  borderRadius: "14px",
                  background: "rgba(59, 130, 246, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  color: "#3b82f6",
                }}
              >
                {service.icon}
              </div>
              <h3 style={{ color: "#f8fafc", fontSize: "1.2rem", marginBottom: "12px", fontWeight: "600" }}>
                {service.title}
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.6" }}>
                {service.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section (Myntra Style) */}
      <section style={{ padding: "60px 5%", background: "#1e293b" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h2 style={{ fontSize: "2.5rem", color: "#f8fafc", fontWeight: "700" }}>
            Trending <span style={{ color: "#3b82f6" }}>Spare Parts</span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "1.1rem", marginTop: "10px" }}>
            Explore our latest available products from verified sellers.
          </p>
        </div>

        {featuredScraps.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "25px",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            {featuredScraps.map((scrap) => (
              <Link
                to={`/scraps?q=${encodeURIComponent(scrap.name)}`}
                key={scrap.id}
                style={{
                  background: "#0f172a",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid #334155",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.2)";
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={scrap.image || "https://images.unsplash.com/photo-1530906358829-e84b2769270f?auto=format&fit=crop&q=80&w=500"}
                    alt={scrap.name}
                    style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }}
                  />
                  <span style={{ position: "absolute", top: "12px", left: "12px", background: "#10b981", color: "white", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                    Available
                  </span>
                </div>
                
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: "1" }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", color: "#f8fafc", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {scrap.name}
                  </h3>
                  <p style={{ margin: "0 0 12px 0", color: "#94a3b8", fontSize: "0.9rem" }}>
                    {scrap.category}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                    <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "#f8fafc" }}>
                      ₹{scrap.price}
                    </span>
                    <span style={{ color: "#3b82f6", fontSize: "0.9rem", fontWeight: "600" }}>
                      View Details &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
            <p>No featured products available at the moment.</p>
          </div>
        )}
        
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Link
            to="/scraps"
            style={{
              display: "inline-block",
              border: "2px solid #3b82f6",
              color: "#3b82f6",
              padding: "12px 32px",
              borderRadius: "8px",
              fontSize: "1.05rem",
              fontWeight: "600",
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#3b82f6";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#3b82f6";
            }}
          >
            View All Parts
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;