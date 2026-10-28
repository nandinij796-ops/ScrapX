import { useState } from "react";
import { auth } from "../firebase";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { createOrderOffer } from "../services/orderService";
import {
  ShoppingBag,
  X
} from "lucide-react";

function BuyRequestModal({ scrap, onClose, onSuccess }) {
  const { userData } = useAuth();
  const [offeredPrice, setOfferedPrice] = useState(scrap.price || "");
  const [deliveryPreference, setDeliveryPreference] = useState("Self Pickup from Seller Yard");
  const [phone, setPhone] = useState(userData?.phone || "");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!scrap) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("Please log in to submit a buy offer.");
      return;
    }

    if (scrap.ownerId === auth.currentUser.uid) {
      toast.error("You cannot submit a buy offer on your own listing.");
      return;
    }

    if (!phone.trim()) {
      toast.error("Please provide a contact phone number.");
      return;
    }

    if (!offeredPrice || Number(offeredPrice) <= 0) {
      toast.error("Please provide a valid offer amount (₹).");
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        scrapId: scrap.id,
        scrapName: scrap.name,
        scrapImage: scrap.image || (scrap.images && scrap.images[0]) || "",
        askingPrice: Number(scrap.price),
        offerPrice: Number(offeredPrice),
        sellerId: scrap.ownerId || "demo_seller_1",
        sellerName: scrap.ownerName || "Salvage Yard Partner",
        buyerId: auth.currentUser.uid,
        buyerName: userData?.name || auth.currentUser.displayName || auth.currentUser.email.split("@")[0],
        buyerEmail: auth.currentUser.email,
        buyerPhone: phone.trim(),
        deliveryPreference,
        note: note.trim(),
      };

      await createOrderOffer(orderPayload);

      toast.success("Purchase offer sent to seller! Track in My Orders.");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Buy request error:", err);
      toast.error(err.message || "Failed to submit offer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(15, 23, 42, 0.65)",
      backdropFilter: "blur(5px)",
      zIndex: 2100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "20px",
        maxWidth: "520px",
        width: "100%",
        padding: "32px",
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
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            color: "#64748B",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#ECFDF5", color: "#15803D", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShoppingBag size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "800", color: "#0F172A" }}>
              Submit Buy Offer
            </h3>
            <span style={{ fontSize: "0.8rem", color: "#64748B" }}>Official negotiation with seller</span>
          </div>
        </div>

        {/* Product mini card */}
        <div style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          background: "#F8FAFC",
          padding: "12px",
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          marginBottom: "20px"
        }}>
          <img
            src={scrap.image || (scrap.images && scrap.images[0]) || "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=200"}
            alt={scrap.name}
            style={{ width: "54px", height: "54px", borderRadius: "8px", objectFit: "cover" }}
          />
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: "0 0 2px 0", fontSize: "0.95rem", fontWeight: "700", color: "#0F172A" }}>
              {scrap.name}
            </h4>
            <span style={{ fontSize: "0.82rem", color: "#64748B" }}>
              Listed Asking Price: <strong style={{ color: "#15803D" }}>₹{scrap.price?.toLocaleString()}</strong>
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
              Your Offer Amount (₹) *
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748B", fontWeight: "700" }}>₹</span>
              <input
                type="number"
                min="100"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 30px",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  fontSize: "1.05rem",
                  fontWeight: "700",
                  color: "#0F172A",
                  outline: "none"
                }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
              Delivery Preference *
            </label>
            <select
              value={deliveryPreference}
              onChange={(e) => setDeliveryPreference(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #CBD5E1",
                backgroundColor: "#FFFFFF",
                fontSize: "0.9rem",
                color: "#0F172A"
              }}
            >
              <option value="Self Pickup from Seller Yard">Self Pickup from Seller Yard</option>
              <option value="Local Courier / Van Delivery (Delhivery/Porter)">Local Courier / Van Delivery (Delhivery/Porter)</option>
              <option value="Interstate Parcel Logistics">Interstate Parcel Logistics</option>
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
              Contact Phone Number *
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #CBD5E1",
                fontSize: "0.92rem",
                color: "#0F172A"
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "22px" }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
              Note to Seller (Optional)
            </label>
            <textarea
              placeholder="e.g. Can pick up today evening; need testing video before dispatch..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="2"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #CBD5E1",
                fontSize: "0.9rem",
                color: "#0F172A",
                resize: "vertical"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: "10px 18px" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ padding: "10px 24px" }}
            >
              {submitting ? "Sending Offer..." : "Send Buy Offer →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BuyRequestModal;
