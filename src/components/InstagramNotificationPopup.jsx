import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Recycle, Bell, X, MessageSquare, ArrowRight, CheckCircle2, ShoppingBag } from "lucide-react";

export default function InstagramNotificationPopup() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [notification, setNotification] = useState(null);
  const [unreadCount, setUnreadCount] = useState(3);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 1. Listen to real Firestore buyRequests if user is logged in
    let unsubscribe = null;
    if (auth.currentUser) {
      try {
        const q = query(
          collection(db, "buyRequests"),
          where("sellerId", "==", auth.currentUser.uid),
          where("status", "==", "Pending")
        );
        unsubscribe = onSnapshot(q, (snap) => {
          if (!snap.empty) {
            const latest = snap.docs[0].data();
            setUnreadCount(snap.size);
            setNotification({
              id: snap.docs[0].id,
              title: "New Scrap Offer Received!",
              message: `${latest.buyerName || "A verified buyer"} offered ₹${latest.offeredPrice?.toLocaleString() || "12,500"} for ${latest.partName || "your listed part"}`,
              time: "Just now",
              type: "offer",
              url: "/notification"
            });
            setVisible(true);
          }
        });
      } catch (err) {
        console.warn("Notification listener notice:", err);
      }
    }

    // 2. Initial realistic pop-up preview like Instagram push alert
    const timer = setTimeout(() => {
      if (!visible && !isDismissed) {
        setNotification({
          id: "alert_welcome",
          title: "Apex Salvage Hub",
          message: "💬 Accepted your quote! Schedule pickup or chat with seller directly.",
          time: "Just now",
          type: "message",
          url: "/notification"
        });
        setUnreadCount(3);
        setVisible(true);
      }
    }, 2500);

    return () => {
      clearTimeout(timer);
      if (unsubscribe) unsubscribe();
    };
  }, [isDismissed]);

  if (!visible || !notification) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        maxWidth: "390px",
        width: "calc(100% - 40px)",
        animation: "instagramSlideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards"
      }}
    >
      <div
        style={{
          background: "rgba(15, 23, 42, 0.96)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "20px",
          padding: "16px 18px",
          boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.08)",
          color: "#FFFFFF",
          position: "relative",
          cursor: "pointer",
          transition: "transform 0.2s ease, box-shadow 0.2s ease"
        }}
        onClick={() => {
          setVisible(false);
          navigate(notification.url);
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
        {/* Top Header of the Instagram Banner */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #22C55E 0%, #15803D 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(34, 197, 94, 0.4)"
              }}
            >
              <Recycle size={15} color="white" />
            </div>
            <span style={{ fontSize: "0.82rem", fontWeight: "800", letterSpacing: "0.4px", color: "#F8FAFC", textTransform: "uppercase" }}>
              SCRAPX ALERT
            </span>
            <span
              style={{
                background: "#EF4444",
                color: "white",
                fontSize: "0.68rem",
                fontWeight: "800",
                padding: "1px 7px",
                borderRadius: "10px",
                boxShadow: "0 2px 5px rgba(239, 68, 68, 0.4)"
              }}
            >
              {unreadCount} NEW
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>{notification.time}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setVisible(false);
                setIsDismissed(true);
              }}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "none",
                borderRadius: "50%",
                width: "22px",
                height: "22px",
                color: "#94A3B8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0
              }}
              title="Dismiss"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Banner Body */}
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #15803D 0%, #047857 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: "2px solid #22C55E"
            }}
          >
            {notification.type === "offer" ? <ShoppingBag size={20} color="white" /> : <MessageSquare size={20} color="white" />}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h5 style={{ margin: "0 0 2px 0", fontSize: "0.94rem", fontWeight: "700", color: "#F8FAFC" }}>
              {notification.title}
            </h5>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#CBD5E1", lineHeight: "1.4" }}>
              {notification.message}
            </p>
          </div>
        </div>

        {/* Tap to View Pill */}
        <div style={{ marginTop: "12px", paddingTop: "8px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", color: "#34D399", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
            Tap to open notifications <ArrowRight size={12} />
          </span>
          <span style={{ fontSize: "0.72rem", color: "#64748B" }}>Swipe or click X to dismiss</span>
        </div>
      </div>

      <style>{`
        @keyframes instagramSlideDown {
          0% {
            opacity: 0;
            transform: translateY(-40px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}