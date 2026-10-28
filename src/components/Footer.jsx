import { Link } from "react-router-dom";
import { Recycle, ShieldCheck, Phone, Mail, MapPin, ArrowUpRight, Heart } from "lucide-react";

function Footer() {
  return (
    <footer style={{
      backgroundColor: "#0F172A",
      color: "#F8FAFC",
      borderTop: "1px solid #1E293B",
      marginTop: "auto"
    }}>
      {/* Sustainability Impact Highlight Banner */}
      <div style={{
        backgroundColor: "#14532D",
        borderBottom: "1px solid #166534",
        padding: "16px 20px"
      }}>
        <div className="container" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{
              backgroundColor: "#22C55E",
              color: "#0F172A",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: "bold"
            }}>
              ✓
            </span>
            <span style={{ fontSize: "0.92rem", fontWeight: "600", color: "#F0FDF4" }}>
              RTO & Environmental Norms Compliant • Circular Automotive Economy
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px", fontSize: "0.88rem", color: "#BBF7D0" }}>
            <span>⚡ <strong>18,400+ kg</strong> Steel Recycled</span>
            <span>🌱 <strong>31,200 kg</strong> CO₂ Emissions Diverted</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: "60px 20px 40px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "40px",
          marginBottom: "48px"
        }}>
          {/* Brand Info */}
          <div>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{
                background: "linear-gradient(135deg, #22C55E 0%, #15803D 100%)",
                borderRadius: "10px",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white"
              }}>
                <Recycle size={20} />
              </div>
              <span style={{ fontSize: "1.4rem", fontWeight: "800", color: "#F8FAFC", letterSpacing: "-0.5px" }}>
                Scrap<span style={{ color: "#34D399" }}>X</span>
              </span>
            </Link>
            <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: "1.6", marginBottom: "20px" }}>
              India's premier circular automotive marketplace and verified scrap recycling network. Connecting workshops, owners, and authorized recyclers.
            </p>
            <div style={{ display: "flex", gap: "12px", color: "#64748B" }}>
              <span style={{ fontSize: "0.85rem", color: "#A7F3D0", display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={16} /> Certified Green Salvage
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#F8FAFC", marginBottom: "18px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Marketplace & Pickups
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              <li>
                <Link to="/scraps" style={{ color: "#94A3B8", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
                  Browse Spare Parts <ArrowUpRight size={13} />
                </Link>
              </li>
              <li>
                <Link to="/addscrap" style={{ color: "#94A3B8", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
                  Sell Vehicle Scrap <ArrowUpRight size={13} />
                </Link>
              </li>
              <li>
                <Link to="/pickups" style={{ color: "#94A3B8", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
                  Schedule Doorstep Pickup <ArrowUpRight size={13} />
                </Link>
              </li>
              <li>
                <Link to="/rates" style={{ color: "#94A3B8", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
                  Scrap Rate Card & Calculator <ArrowUpRight size={13} />
                </Link>
              </li>
              <li>
                <Link to="/orders" style={{ color: "#94A3B8", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
                  Track Orders & Buy Offers <ArrowUpRight size={13} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Network & Assistance */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#F8FAFC", marginBottom: "18px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Network & Roadside
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              <li>
                <Link to="/nearby" style={{ color: "#94A3B8", fontSize: "0.9rem" }}>
                  Nearby Mechanics Radar
                </Link>
              </li>
              <li>
                <Link to="/emergency" style={{ color: "#F87171", fontSize: "0.9rem", fontWeight: "600" }}>
                  🚨 24/7 Roadside Breakdown
                </Link>
              </li>
              <li>
                <Link to="/services" style={{ color: "#94A3B8", fontSize: "0.9rem" }}>
                  Recycling Certificate Services
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: "#94A3B8", fontSize: "0.9rem" }}>
                  Environmental Mission
                </Link>
              </li>
              <li>
                <Link to="/dashboard" style={{ color: "#94A3B8", fontSize: "0.9rem" }}>
                  Vendor / Seller Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#F8FAFC", marginBottom: "18px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Central Hub
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", color: "#94A3B8", fontSize: "0.88rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <MapPin size={18} style={{ color: "#34D399", flexShrink: 0, marginTop: "2px" }} />
                <span>Mayapuri Industrial Area, Phase II, New Delhi 110064</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Phone size={16} style={{ color: "#34D399", flexShrink: 0 }} />
                <span>+91 1800-419-SCRAP (Toll Free)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Mail size={16} style={{ color: "#34D399", flexShrink: 0 }} />
                <span>support@scrapx.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: "1px solid #1E293B",
          paddingTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          fontSize: "0.85rem",
          color: "#64748B"
        }}>
          <div>
            © {new Date().getFullYear()} ScrapX Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link to="/about" style={{ color: "#94A3B8" }}>Privacy Policy</Link>
            <Link to="/about" style={{ color: "#94A3B8" }}>Terms of Service</Link>
            <Link to="/contact" style={{ color: "#94A3B8" }}>Support</Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            Built for a greener future with <Heart size={14} style={{ color: "#EF4444", fill: "#EF4444" }} />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
