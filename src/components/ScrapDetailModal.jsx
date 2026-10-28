import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { formatDistance } from "../utils/geo";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ShieldCheck,
  Scale,
  Phone,
  Mail,
  ShoppingBag,
  Tag,
  CheckCircle2,
  Calendar
} from "lucide-react";

function ScrapDetailModal({ scrap, userDistance, onClose, onBuyClick }) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!scrap) return null;

  const images = Array.isArray(scrap.images) && scrap.images.length > 0
    ? scrap.images
    : [scrap.image || "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800"];

  const isOwner = auth.currentUser?.uid === scrap.ownerId;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(15, 23, 42, 0.65)",
      backdropFilter: "blur(6px)",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "20px",
        maxWidth: "760px",
        width: "100%",
        maxHeight: "92vh",
        overflowY: "auto",
        boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
        position: "relative"
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(255, 255, 255, 0.9)",
            border: "1px solid #E2E8F0",
            color: "#475569",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
          aria-label="Close details"
        >
          <X size={18} />
        </button>

        {/* Photo Carousel Area */}
        <div style={{ position: "relative", height: "360px", background: "#0F172A" }}>
          <img
            src={images[activePhotoIdx]}
            alt={scrap.name}
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800";
            }}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(15, 23, 42, 0.75)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "38px",
                  height: "38px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={() => setActivePhotoIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(15, 23, 42, 0.75)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "38px",
                  height: "38px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
              >
                <ChevronRight size={20} />
              </button>

              {/* Dots */}
              <div style={{
                position: "absolute",
                bottom: "12px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "8px",
                background: "rgba(15, 23, 42, 0.7)",
                padding: "6px 12px",
                borderRadius: "20px",
              }}>
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActivePhotoIdx(i)}
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      border: "none",
                      background: activePhotoIdx === i ? "#22C55E" : "#94A3B8",
                      cursor: "pointer",
                      padding: 0
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail Selector Bar */}
        {images.length > 1 && (
          <div style={{
            display: "flex",
            gap: "10px",
            padding: "12px 24px",
            background: "#F8FAFC",
            borderBottom: "1px solid #E2E8F0",
            overflowX: "auto"
          }}>
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setActivePhotoIdx(idx)}
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "8px",
                  objectFit: "cover",
                  cursor: "pointer",
                  border: activePhotoIdx === idx ? "2px solid #15803D" : "1px solid #CBD5E1",
                  opacity: activePhotoIdx === idx ? 1 : 0.65,
                  transition: "all 0.2s"
                }}
              />
            ))}
          </div>
        )}

        {/* Content Body */}
        <div style={{ padding: "30px" }}>
          
          {/* Header Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "18px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span className="badge badge-success">
                  {scrap.category || "Engine Parts"}
                </span>
                <span className="badge badge-neutral">
                  {scrap.condition || "Used - Good"}
                </span>
                <span className={`badge ${scrap.status === "Available" ? "badge-success" : "badge-neutral"}`}>
                  {scrap.status}
                </span>
              </div>
              <h2 style={{ fontSize: "1.7rem", fontWeight: "800", color: "#0F172A", margin: 0 }}>
                {scrap.name}
              </h2>
            </div>

            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "0.8rem", color: "#64748B", textTransform: "uppercase", fontWeight: "700" }}>
                Asking Price
              </span>
              <div style={{ fontSize: "2rem", fontWeight: "800", color: "#15803D" }}>
                ₹{scrap.price?.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Specs Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "14px",
            padding: "18px",
            marginBottom: "24px"
          }}>
            <div>
              <span style={{ fontSize: "0.78rem", color: "#64748B", display: "block" }}>Vehicle Compatibility</span>
              <strong style={{ fontSize: "0.92rem", color: "#0F172A" }}>{scrap.compatibility || "Universal"}</strong>
            </div>
            <div>
              <span style={{ fontSize: "0.78rem", color: "#64748B", display: "block" }}>Weight</span>
              <strong style={{ fontSize: "0.92rem", color: "#0F172A" }}>{scrap.weight ? `${scrap.weight} kg` : "N/A"}</strong>
            </div>
            <div>
              <span style={{ fontSize: "0.78rem", color: "#64748B", display: "block" }}>Location Hub</span>
              <strong style={{ fontSize: "0.92rem", color: "#0F172A", display: "flex", alignItems: "center", gap: "4px" }}>
                <MapPin size={14} style={{ color: "#15803D" }} />
                {scrap.locationName || "Verified Yard"}
                {userDistance !== null && userDistance !== undefined && (
                  <span style={{ color: "#15803D", fontWeight: "600", fontSize: "0.8rem" }}>
                    ({formatDistance(userDistance)})
                  </span>
                )}
              </strong>
            </div>
            <div>
              <span style={{ fontSize: "0.78rem", color: "#64748B", display: "block" }}>Listed Date</span>
              <strong style={{ fontSize: "0.92rem", color: "#0F172A" }}>{scrap.date ? scrap.date.split(",")[0] : "Recently"}</strong>
            </div>
          </div>

          {/* Description */}
          {scrap.description && (
            <div style={{ marginBottom: "24px" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#0F172A", marginBottom: "8px" }}>
                Condition & Inspection Notes
              </h4>
              <p style={{ color: "#475569", fontSize: "0.92rem", lineHeight: "1.6", margin: 0 }}>
                {scrap.description}
              </p>
            </div>
          )}

          {/* Seller Profile Card */}
          <div style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "14px",
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px",
            marginBottom: "28px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "#15803D",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                fontWeight: "700"
              }}>
                {(scrap.ownerName || "S")[0].toUpperCase()}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <strong style={{ fontSize: "1rem", color: "#0F172A" }}>{scrap.ownerName || "Verified Workshop"}</strong>
                  <ShieldCheck size={16} style={{ color: "#15803D" }} />
                </div>
                <span style={{ fontSize: "0.82rem", color: "#64748B" }}>
                  {scrap.ownerPhone ? `Contact: ${scrap.ownerPhone}` : "Verified ScrapX Salvage Partner"}
                </span>
              </div>
            </div>

            {scrap.ownerPhone && (
              <a
                href={`tel:${scrap.ownerPhone}`}
                className="btn-secondary"
                style={{ padding: "8px 14px", fontSize: "0.85rem" }}
              >
                <Phone size={15} /> Call Seller
              </a>
            )}
          </div>

          {/* Modal Actions */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: "11px 20px" }}
            >
              Close
            </button>

            {isOwner ? (
              <Link
                to={`/edit/${scrap.id}`}
                className="btn-primary"
                style={{ padding: "11px 24px" }}
              >
                Edit Listing Specs
              </Link>
            ) : (
              <button
                type="button"
                onClick={onBuyClick}
                disabled={scrap.status !== "Available"}
                className="btn-primary"
                style={{ padding: "11px 28px", fontSize: "0.95rem" }}
              >
                <ShoppingBag size={17} /> Submit Buy Offer
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ScrapDetailModal;
