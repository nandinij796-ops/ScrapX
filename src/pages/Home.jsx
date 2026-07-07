import Navbar from "../components/Navbar";
import hero from "../assets/hero.png";

function Home() {
  const services = [
    {
      icon: "🔧",
      title: "Nearby Mechanics",
      desc: "Find trusted mechanics near your location quickly.",
    },
    {
      icon: "♻️",
      title: "Spare Parts",
      desc: "Buy and sell quality spare parts at affordable prices.",
    },
    {
      icon: "🏪",
      title: "Scrap Dealers",
      desc: "Connect with verified scrap dealers easily.",
    },
    {
      icon: "🚨",
      title: "Emergency Help",
      desc: "Get instant assistance whenever your vehicle needs help.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>🚗 ScrapX</h1>

          <p>
            Smart Scrap Management System for Vehicle Scrap,
            Spare Parts & Emergency Assistance.
          </p>

          <button className="hero-btn">
            🚀 Get Started
          </button>
        </div>

        <div className="hero-image">
          <img src={hero} alt="ScrapX" className="hero-img" />
        </div>
      </section>

      {/* Services Section */}
      <section
        className="services"
        style={{
          background: "linear-gradient(180deg, #f8fbff, #eef7ff)",
          padding: "80px 20px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "42px",
            color: "#1e3a8a",
            marginBottom: "15px",
            fontWeight: "700",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          ✨ Our Services
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#555",
            maxWidth: "700px",
            margin: "0 auto 50px",
            fontSize: "18px",
            lineHeight: "1.8",
          }}
        >
          Everything you need for smarter vehicle scrap management in one
          place.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "25px",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {services.map((service, index) => (
            <div
              key={index}
              style={{
                background: "#fff",
                padding: "30px 25px",
                borderRadius: "20px",
                textAlign: "center",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow =
                  "0 18px 35px rgba(37,99,235,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(0,0,0,0.08)";
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  margin: "0 auto 20px",
                  borderRadius: "50%",
                  background: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "34px",
                }}
              >
                {service.icon}
              </div>

              <h3
                style={{
                  color: "#1e3a8a",
                  fontSize: "22px",
                  marginBottom: "12px",
                }}
              >
                {service.title}
              </h3>

              <p
                style={{
                  color: "#666",
                  fontSize: "15px",
                  lineHeight: "1.8",
                }}
              >
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;