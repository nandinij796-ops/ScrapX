import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserOrders, updateOrderStatus } from "../services/orderService";
import { toast } from "react-hot-toast";
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  Truck,
  ArrowRight,
  Sparkles
} from "lucide-react";

function Orders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [roleFilter, setRoleFilter] = useState("all"); // 'all' | 'received' | 'sent'
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'Pending' | 'Accepted' | 'Completed' | 'Rejected'
  const [search, setSearch] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getUserOrders(currentUser?.uid);
      setOrders(data);
    } catch (err) {
      console.warn("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [currentUser]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to "${newStatus}"!`);
      loadOrders();
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  // Filtered orders list
  const filteredOrders = orders.filter((order) => {
    // Search match
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = order.scrapName?.toLowerCase().includes(q);
      const matchBuyer = order.buyerName?.toLowerCase().includes(q);
      const matchRef = order.orderRef?.toLowerCase().includes(q);
      if (!matchName && !matchBuyer && !matchRef) return false;
    }

    // Role perspective match
    if (roleFilter === "received" && order.sellerId !== currentUser?.uid && order.sellerId !== "demo_seller_1") {
      return false;
    }
    if (roleFilter === "sent" && order.buyerId !== currentUser?.uid && order.buyerId !== "demo_buyer_1") {
      return false;
    }

    // Status match
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }

    return true;
  });

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "40px 20px 80px" }}>
        <div className="container" style={{ maxWidth: "1140px" }}>
          
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: "8px" }}>
                Transaction Management
              </span>
              <h1 style={{ fontSize: "2.3rem", fontWeight: "800", color: "#0F172A", margin: "4px 0 6px" }}>
                Orders & Buy Requests
              </h1>
              <p style={{ color: "#64748B", margin: 0, fontSize: "0.95rem" }}>
                Track buyer offers, manage accepted transactions, and coordinate part fulfillment.
              </p>
            </div>

            <Link to="/scraps" className="btn-primary">
              <ShoppingBag size={17} /> Browse Marketplace
            </Link>
          </div>

          {/* Filter Bar */}
          <div className="premium-card" style={{ padding: "18px 24px", marginBottom: "28px" }}>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
              
              {/* Perspective Selector */}
              <div style={{ display: "flex", gap: "6px", backgroundColor: "#F1F5F9", padding: "4px", borderRadius: "10px" }}>
                <button
                  onClick={() => setRoleFilter("all")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    border: "none",
                    fontWeight: "700",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    backgroundColor: roleFilter === "all" ? "#FFFFFF" : "transparent",
                    color: roleFilter === "all" ? "#15803D" : "#64748B",
                    boxShadow: roleFilter === "all" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                  }}
                >
                  All Transactions
                </button>
                <button
                  onClick={() => setRoleFilter("received")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    border: "none",
                    fontWeight: "700",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    backgroundColor: roleFilter === "received" ? "#FFFFFF" : "transparent",
                    color: roleFilter === "received" ? "#15803D" : "#64748B",
                    boxShadow: roleFilter === "received" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                  }}
                >
                  Received Offers
                </button>
                <button
                  onClick={() => setRoleFilter("sent")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    border: "none",
                    fontWeight: "700",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    backgroundColor: roleFilter === "sent" ? "#FFFFFF" : "transparent",
                    color: roleFilter === "sent" ? "#15803D" : "#64748B",
                    boxShadow: roleFilter === "sent" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                  }}
                >
                  My Buy Offers
                </button>
              </div>

              {/* Status & Search */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "#FFFFFF",
                    fontSize: "0.88rem",
                    color: "#334155"
                  }}
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending Review</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Declined</option>
                </select>

                <div style={{ position: "relative" }}>
                  <Search size={16} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                  <input
                    type="text"
                    placeholder="Search by part, buyer, or ref..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      padding: "8px 12px 8px 34px",
                      borderRadius: "8px",
                      border: "1px solid #CBD5E1",
                      backgroundColor: "#FFFFFF",
                      fontSize: "0.88rem",
                      color: "#0F172A",
                      width: "220px"
                    }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Orders Listing */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#64748B" }}>
              <p>Loading transaction records...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="premium-card" style={{ padding: "60px 20px", textAlign: "center" }}>
              <ShoppingBag size={48} style={{ color: "#94A3B8", margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#0F172A", marginBottom: "8px" }}>
                No Orders Found
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.95rem", maxWidth: "420px", margin: "0 auto 20px" }}>
                There are no buy requests matching your selected filters. Explore the marketplace to find components or list an automotive scrap part.
              </p>
              <Link to="/scraps" className="btn-primary">
                Browse Active Scrap Listings
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {filteredOrders.map((order) => {
                const isSeller = currentUser?.uid === order.sellerId || order.sellerId === "demo_seller_1";

                return (
                  <div
                    key={order.id}
                    className="premium-card"
                    style={{
                      padding: "24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "20px"
                    }}
                  >
                    {/* Left: Thumbnail & Details */}
                    <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                      <img
                        src={order.scrapImage || "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=300"}
                        alt={order.scrapName}
                        style={{
                          width: "90px",
                          height: "90px",
                          borderRadius: "12px",
                          objectFit: "cover",
                          border: "1px solid #E2E8F0"
                        }}
                      />

                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                          <span style={{ fontSize: "0.8rem", fontWeight: "800", color: "#15803D", background: "#ECFDF5", padding: "2px 8px", borderRadius: "6px" }}>
                            {order.orderRef}
                          </span>
                          <span className={`badge ${
                            order.status === "Accepted" ? "badge-success" :
                            order.status === "Completed" ? "badge-info" :
                            order.status === "Pending" ? "badge-warning" : "badge-neutral"
                          }`}>
                            {order.status}
                          </span>
                          <span style={{ fontSize: "0.82rem", color: "#94A3B8" }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#0F172A", margin: "2px 0 8px" }}>
                          {order.scrapName}
                        </h3>

                        <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", fontSize: "0.88rem", color: "#475569" }}>
                          <span>
                            Buyer: <strong>{order.buyerName}</strong> ({order.buyerPhone})
                          </span>
                          <span>
                            Delivery: <strong>{order.deliveryPreference}</strong>
                          </span>
                        </div>

                        {order.note && (
                          <p style={{ margin: "6px 0 0", fontSize: "0.85rem", color: "#64748B", fontStyle: "italic" }}>
                            "{order.note}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Pricing & Status Triggers */}
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "0.78rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: "700" }}>
                          Offer Price
                        </div>
                        <div style={{ fontSize: "1.45rem", fontWeight: "800", color: "#15803D" }}>
                          ₹{order.offerPrice?.toLocaleString()}
                        </div>
                        <span style={{ fontSize: "0.78rem", color: "#64748B" }}>
                          List: ₹{order.askingPrice?.toLocaleString()}
                        </span>
                      </div>

                      {/* Action buttons */}
                      {isSeller && order.status === "Pending" && (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => handleStatusChange(order.id, "Accepted")}
                            style={{
                              padding: "8px 14px",
                              backgroundColor: "#15803D",
                              color: "white",
                              borderRadius: "8px",
                              fontSize: "0.88rem",
                              fontWeight: "700",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px"
                            }}
                          >
                            <CheckCircle size={15} /> Accept Offer
                          </button>
                          <button
                            onClick={() => handleStatusChange(order.id, "Rejected")}
                            style={{
                              padding: "8px 12px",
                              backgroundColor: "#FEF2F2",
                              color: "#DC2626",
                              border: "1px solid #FECACA",
                              borderRadius: "8px",
                              fontSize: "0.88rem",
                              fontWeight: "600",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            <XCircle size={15} /> Decline
                          </button>
                        </div>
                      )}

                      {order.status === "Accepted" && (
                        <button
                          onClick={() => handleStatusChange(order.id, "Completed")}
                          className="btn-accent"
                          style={{ padding: "8px 14px", fontSize: "0.85rem" }}
                        >
                          <CheckCircle size={15} /> Mark Delivered & Paid
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Orders;
