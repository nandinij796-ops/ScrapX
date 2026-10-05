import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Services() {
  const servicesData = [
    {
      id: 1,
      icon: "🛒",
      title: "Spare Parts Marketplace",
      description: "Buy and sell verified recovered automotive parts. Filter by make, model, and condition to find exactly what your vehicle needs without the dealership markup.",
      link: "/scraps",
      linkText: "Browse Parts"
    },
    {
      id: 2,
      icon: "🚨",
      title: "Emergency Roadside Assist",
      description: "Stranded? Request immediate help based on your precise GPS location. Local mechanics and towing services will be dispatched to your coordinates 24/7.",
      link: "/emergency",
      linkText: "Request Help"
    },
    {
      id: 3,
      icon: "👨‍🔧",
      title: "Mechanic Discovery",
      description: "Find trusted, highly-rated mechanics in your area. View their specialties, read reviews, and connect with them directly for repairs and maintenance.",
      link: "/nearby",
      linkText: "Find on Map"
    },
    {
      id: 4,
      icon: "💬",
      title: "Secure E2E Chat",
      description: "Communicate directly with sellers, dealers, and mechanics securely. Our end-to-end encrypted messaging ensures your negotiations and details stay private.",
      link: "/chat",
      linkText: "Open Chat"
    },
    {
      id: 5,
      icon: "♻️",
      title: "Vehicle Scrap Management",
      description: "Ready to scrap a total loss vehicle? List it directly to our network of verified scrap dealers to get the highest competitive bids instantly.",
      link: "/signup",
      linkText: "Join as Seller"
    },
    {
      id: 6,
      icon: "📊",
      title: "Analytics & Reports",
      description: "For dealers and mechanics: Manage your inventory, track incoming service requests, and generate real-time PDF reports of your transactions.",
      link: "/dashboard",
      linkText: "View Dashboard"
    }
  ];

  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", color: "#f8fafc" }}>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 20px" }}>
        
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "800", color: "#f8fafc", marginBottom: "15px" }}>
            Our <span style={{ color: "#3b82f6" }}>Services</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#94a3b8", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
            ScrapX provides a complete, end-to-end ecosystem for vehicle owners, mechanics, and scrap dealers. Explore our professional tools below.
          </p>
        </div>

        {/* Services Grid */}
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
            gap: "30px" 
          }}
        >
          {servicesData.map((service) => (
            <div 
              key={service.id}
              style={{
                background: "#1e293b",
                borderRadius: "16px",
                padding: "40px 30px",
                border: "1px solid #334155",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                height: "100%"
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
                  borderRadius: "12px",
                  background: "rgba(59, 130, 246, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  marginBottom: "20px"
                }}
              >
                {service.icon}
              </div>
              
              <h2 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#f8fafc", marginBottom: "12px" }}>
                {service.title}
              </h2>
              
              <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.6", flex: 1, marginBottom: "25px" }}>
                {service.description}
              </p>

              <Link 
                to={service.link}
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  background: "#3b82f6",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                  textAlign: "center",
                  transition: "background 0.2s ease"
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "#2563eb"}
                onMouseOut={(e) => e.currentTarget.style.background = "#3b82f6"}
              >
                {service.linkText} →
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Services;