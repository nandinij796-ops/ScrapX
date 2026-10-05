import Navbar from "../components/Navbar";

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been received securely by our support team.");
  };

  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", color: "#f8fafc" }}>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "60px auto", padding: "0 20px", display: "flex", flexWrap: "wrap", gap: "40px" }}>
        
        {/* Left Side: Info */}
        <div style={{ flex: "1 1 400px" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "800", color: "#f8fafc", marginBottom: "15px" }}>
            Get in <span style={{ color: "#3b82f6" }}>Touch</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#94a3b8", lineHeight: "1.6", marginBottom: "40px" }}>
            Have a question about selling your scrap vehicle or partnering with us? Our 24/7 support team is here to help you navigate the platform.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", color: "#3b82f6" }}>📞</div>
              <div>
                <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem", color: "#f8fafc" }}>Phone Support</h3>
                <p style={{ margin: 0, color: "#94a3b8" }}>+91 7976650643</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", color: "#3b82f6" }}>📧</div>
              <div>
                <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem", color: "#f8fafc" }}>Email Us</h3>
                <p style={{ margin: 0, color: "#94a3b8" }}>support@scrapx.com</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", color: "#3b82f6" }}>📍</div>
              <div>
                <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem", color: "#f8fafc" }}>Headquarters</h3>
                <p style={{ margin: 0, color: "#94a3b8" }}>Jaipur, Rajasthan, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div style={{ flex: "1 1 500px" }}>
          <form 
            onSubmit={handleSubmit}
            style={{
              background: "#1e293b",
              padding: "40px",
              borderRadius: "16px",
              border: "1px solid #334155",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
            }}
          >
            <h2 style={{ fontSize: "1.8rem", color: "#f8fafc", marginBottom: "25px", marginTop: 0 }}>Send a Message</h2>
            
            <input 
              type="text" 
              placeholder="Your Full Name" 
              required 
              style={{ width: "100%", padding: "14px 20px", marginBottom: "20px", borderRadius: "10px", border: "1px solid #334155", background: "#0f172a", color: "#f8fafc", fontSize: "1rem", outline: "none" }}
            />
            
            <input 
              type="email" 
              placeholder="Your Email Address" 
              required 
              style={{ width: "100%", padding: "14px 20px", marginBottom: "20px", borderRadius: "10px", border: "1px solid #334155", background: "#0f172a", color: "#f8fafc", fontSize: "1rem", outline: "none" }}
            />
            
            <input 
              type="text" 
              placeholder="Subject" 
              required 
              style={{ width: "100%", padding: "14px 20px", marginBottom: "20px", borderRadius: "10px", border: "1px solid #334155", background: "#0f172a", color: "#f8fafc", fontSize: "1rem", outline: "none" }}
            />
            
            <textarea 
              placeholder="How can we help you?" 
              rows="5" 
              required 
              style={{ width: "100%", padding: "14px 20px", marginBottom: "25px", borderRadius: "10px", border: "1px solid #334155", background: "#0f172a", color: "#f8fafc", fontSize: "1rem", outline: "none", resize: "none" }}
            ></textarea>
            
            <button 
              type="submit"
              style={{
                width: "100%",
                background: "#3b82f6",
                color: "white",
                padding: "16px",
                border: "none",
                borderRadius: "10px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s ease"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "#2563eb"}
              onMouseOut={(e) => e.currentTarget.style.background = "#3b82f6"}
            >
              Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Contact;