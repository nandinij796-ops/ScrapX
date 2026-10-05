import Navbar from "../components/Navbar";

function About() {
  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", color: "#f8fafc" }}>
      <Navbar />

      <div
        style={{
          maxWidth: "1000px",
          margin: "60px auto",
          padding: "40px 30px",
          background: "#1e293b",
          borderRadius: "16px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
          border: "1px solid #334155"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "800", color: "#f8fafc", marginBottom: "15px" }}>
            About <span style={{ color: "#3b82f6" }}>ScrapX</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#94a3b8", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
            We are revolutionizing the automotive recovery and secondary parts market by connecting vehicle owners, mechanics, and scrap dealers on a single, intelligent platform.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px", marginBottom: "50px" }}>
          <div>
            <h2 style={{ color: "#f8fafc", fontSize: "1.5rem", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#3b82f6" }}>🌍</span> Our Mission
            </h2>
            <p style={{ color: "#94a3b8", lineHeight: "1.7", fontSize: "1rem" }}>
              To reduce automotive waste and make emergency assistance accessible to everyone. By creating a transparent marketplace for recovered parts, we're building a sustainable ecosystem that saves our users time and money while keeping usable materials out of landfills.
            </p>
          </div>
          <div>
            <h2 style={{ color: "#f8fafc", fontSize: "1.5rem", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#3b82f6" }}>⚙️</span> How It Works
            </h2>
            <p style={{ color: "#94a3b8", lineHeight: "1.7", fontSize: "1rem" }}>
              Whether you need to instantly sell a scrapped vehicle, securely chat with a verified dealer, or request an emergency mechanic to your GPS coordinates—ScrapX handles the complex logistics instantly through our real-time cloud architecture.
            </p>
          </div>
        </div>

        <div style={{ background: "#0f172a", padding: "30px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ color: "#f8fafc", fontSize: "1.5rem", marginBottom: "20px", textAlign: "center" }}>
            The Core Team
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
              👩‍💻
            </div>
            <div>
              <h3 style={{ color: "#f8fafc", margin: "0 0 5px 0", fontSize: "1.3rem" }}>Nandini Jain</h3>
              <p style={{ color: "#3b82f6", margin: "0 0 10px 0", fontWeight: "600" }}>Founder & CEO</p>
              <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.95rem" }}>
                Leading the vision to digitize the global automotive scrap and rescue industry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;