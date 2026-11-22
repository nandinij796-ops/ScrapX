import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  CheckCircle2,
  ShieldCheck,
  Fuel,
  Calendar,
  MapPin,
  FileText,
  Package,
  Recycle,
  Truck,
  X,
  ExternalLink,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function VehicleLookupModal({ vehicle, isOpen, onClose, onApplyToSelector }) {
  const navigate = useNavigate();

  if (!isOpen || !vehicle) return null;

  const handleBrowseParts = () => {
    onClose();
    if (onApplyToSelector) {
      onApplyToSelector(vehicle);
    }
    navigate(`/scraps?q=${encodeURIComponent(vehicle.model)}&maker=${encodeURIComponent(vehicle.maker)}`);
  };

  const handleSellVehicle = () => {
    onClose();
    navigate(
      `/addscrap?plate=${encodeURIComponent(vehicle.cleanPlate || vehicle.plate)}&maker=${encodeURIComponent(
        vehicle.maker
      )}&model=${encodeURIComponent(vehicle.model)}&year=${encodeURIComponent(vehicle.year)}`
    );
  };

  const handleBookPickup = () => {
    onClose();
    navigate(
      `/pickups?plate=${encodeURIComponent(vehicle.cleanPlate || vehicle.plate)}&vehicle=${encodeURIComponent(
        `${vehicle.maker} ${vehicle.model} (${vehicle.year})`
      )}`
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.7)",
        backdropFilter: "blur(6px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "modalFadeIn 0.2s ease-out"
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          maxWidth: "640px",
          width: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          border: "1px solid #E2E8F0",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid #F1F5F9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span
                style={{
                  background: "#ECFDF5",
                  color: "#15803D",
                  border: "1px solid #A7F3D0",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontSize: "0.74rem",
                  fontWeight: "800",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <CheckCircle2 size={13} /> VAHAN RC VERIFIED
              </span>
              <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: "600" }}>
                Official Parivahan Registry
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: "1.35rem", fontWeight: "800", color: "#0F172A" }}>
              Vehicle Registration Record
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "#F1F5F9",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#64748B",
              transition: "all 0.15s ease"
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {/* Authentic Indian HSRP Number Plate Display */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px"
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                border: "3px solid #1E293B",
                borderRadius: "10px",
                background: "linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.12), inset 0 1px 3px rgba(255,255,255,0.9)",
                overflow: "hidden"
              }}
            >
              {/* Left Blue IND Strip */}
              <div
                style={{
                  backgroundColor: "#003893",
                  color: "#FFCC00",
                  padding: "10px 10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "36px"
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    border: "1.5px dashed #FFCC00",
                    marginBottom: "3px"
                  }}
                />
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "900",
                    letterSpacing: "0.5px",
                    lineHeight: 1,
                    color: "#FFFFFF"
                  }}
                >
                  IND
                </span>
              </div>

              {/* Embossed Number */}
              <div
                style={{
                  padding: "8px 24px",
                  fontSize: "1.65rem",
                  fontWeight: "900",
                  letterSpacing: "3px",
                  color: "#0F172A",
                  fontFamily: "'Courier New', Courier, monospace",
                  textTransform: "uppercase"
                }}
              >
                {vehicle.plate}
              </div>
            </div>
          </div>

          {/* Vehicle Identified Card */}
          <div
            style={{
              background: "linear-gradient(135deg, #0B3B60 0%, #062035 100%)",
              borderRadius: "14px",
              padding: "18px 20px",
              color: "#FFFFFF",
              marginBottom: "20px",
              boxShadow: "0 6px 18px rgba(11, 59, 96, 0.25)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#48CAE4", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                  {vehicle.maker}
                </span>
                <h4 style={{ margin: "2px 0 6px", fontSize: "1.3rem", fontWeight: "800", color: "#FFFFFF" }}>
                  {vehicle.maker} {vehicle.variant || vehicle.model}
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "6px" }}>
                  <span style={{ background: "rgba(255,255,255,0.15)", padding: "2px 8px", borderRadius: "6px", fontSize: "0.76rem", fontWeight: "700" }}>
                    Year: {vehicle.year}
                  </span>
                  <span style={{ background: "rgba(255,255,255,0.15)", padding: "2px 8px", borderRadius: "6px", fontSize: "0.76rem", fontWeight: "700" }}>
                    {vehicle.fuel}
                  </span>
                  <span style={{ background: "rgba(255,255,255,0.15)", padding: "2px 8px", borderRadius: "6px", fontSize: "0.76rem", fontWeight: "700" }}>
                    {vehicle.color}
                  </span>
                  <span style={{ background: "rgba(72, 202, 228, 0.25)", color: "#E0F2FE", padding: "2px 8px", borderRadius: "6px", fontSize: "0.76rem", fontWeight: "700" }}>
                    {vehicle.emissionNorms}
                  </span>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(34, 197, 94, 0.2)",
                  border: "1px solid rgba(34, 197, 94, 0.5)",
                  color: "#4ADE80",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: "800",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <ShieldCheck size={14} /> ACTIVE RC
              </div>
            </div>
          </div>

          {/* RTO & Registration Specs Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "12px",
              marginBottom: "24px"
            }}
          >
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748B", fontSize: "0.75rem", fontWeight: "600", marginBottom: "4px" }}>
                <MapPin size={14} color="#0B3B60" /> Registering Authority (RTO)
              </div>
              <div style={{ fontWeight: "800", fontSize: "0.88rem", color: "#0F172A" }}>
                {vehicle.rto}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#64748B" }}>State: {vehicle.state}</div>
            </div>

            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748B", fontSize: "0.75rem", fontWeight: "600", marginBottom: "4px" }}>
                <Calendar size={14} color="#15803D" /> Fitness & Registration
              </div>
              <div style={{ fontWeight: "800", fontSize: "0.88rem", color: "#0F172A" }}>
                Valid till {vehicle.fitnessValidTill}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#15803D", fontWeight: "700" }}>Registered: {vehicle.regDate}</div>
            </div>

            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748B", fontSize: "0.75rem", fontWeight: "600", marginBottom: "4px" }}>
                <ShieldCheck size={14} color="#2563EB" /> Insurance Status
              </div>
              <div style={{ fontWeight: "800", fontSize: "0.88rem", color: "#0F172A" }}>
                Active (till {vehicle.insuranceValidTill})
              </div>
              <div style={{ fontSize: "0.72rem", color: "#64748B" }}>{vehicle.insuranceCompany}</div>
            </div>

            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748B", fontSize: "0.75rem", fontWeight: "600", marginBottom: "4px" }}>
                <FileText size={14} color="#7C3AED" /> Technical Engine & Chassis
              </div>
              <div style={{ fontWeight: "800", fontSize: "0.86rem", color: "#0F172A", fontFamily: "monospace" }}>
                Eng: {vehicle.engineNoMask}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#64748B", fontFamily: "monospace" }}>
                Chas: {vehicle.chassisNoMask} ({vehicle.ownerSerial})
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* Primary Button: Find Parts */}
            <button
              onClick={handleBrowseParts}
              style={{
                backgroundColor: "#0B3B60",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "10px",
                padding: "13px 18px",
                fontWeight: "800",
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(11, 59, 96, 0.3)",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#072844")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0B3B60")}
            >
              <Package size={18} style={{ color: "#48CAE4" }} />
              <span>Browse Compatible Spare Parts for {vehicle.model}</span>
              <ArrowRight size={16} />
            </button>

            {/* Secondary Buttons Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button
                onClick={handleSellVehicle}
                style={{
                  backgroundColor: "#ECFDF5",
                  color: "#15803D",
                  border: "1.5px solid #A7F3D0",
                  borderRadius: "10px",
                  padding: "11px 14px",
                  fontWeight: "700",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  cursor: "pointer"
                }}
              >
                <Recycle size={16} />
                <span>Sell / Scrap This Car</span>
              </button>

              <button
                onClick={handleBookPickup}
                style={{
                  backgroundColor: "#EFF6FF",
                  color: "#2563EB",
                  border: "1.5px solid #BFDBFE",
                  borderRadius: "10px",
                  padding: "11px 14px",
                  fontWeight: "700",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  cursor: "pointer"
                }}
              >
                <Truck size={16} />
                <span>Doorstep Scrap Pickup</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.97);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
