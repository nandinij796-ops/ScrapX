import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import { getScrapsByOwner, deleteScrapListing } from "../services/scrapService";
import { getUserPickups } from "../services/pickupService";
import { getUserOrders } from "../services/orderService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import {
  LayoutDashboard,
  Package,
  Calendar,
  ShoppingBag,
  TrendingUp,
  Truck,
  PlusCircle,
  FileText,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Scale
} from "lucide-react";

function Dashboard() {
  const { userData, userRole, isAdmin, isMechanic } = useAuth();

  // Metrics
  const [totalScraps, setTotalScraps] = useState(0);
  const [availableScraps, setAvailableScraps] = useState(0);
  const [soldScraps, setSoldScraps] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [sellerScraps, setSellerScraps] = useState([]);

  // Pickups & Orders
  const [myPickups, setMyPickups] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [emergencyJobs, setEmergencyJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    const uid = auth.currentUser?.uid || "guest_seller";

    try {
      // 1. Load Seller Scraps
      const list = await getScrapsByOwner(uid);
      let weight = 0;
      let value = 0;
      let avail = 0;
      let sold = 0;

      list.forEach((data) => {
        weight += Number(data.weight || 0);
        value += Number(data.price || 0);
        if (data.status === "Available") avail++;
        else if (data.status === "Sold") sold++;
      });

      setTotalScraps(list.length);
      setAvailableScraps(avail);
      setSoldScraps(sold);
      setTotalWeight(Math.round(weight * 10) / 10);
      setTotalValue(value);
      setSellerScraps(list);
    } catch (err) {
      console.warn("Notice loading seller scraps:", err.message);
    }

    try {
      // 2. Load Scheduled Pickups
      const pickupsList = await getUserPickups(uid, isAdmin);
      setMyPickups(pickupsList);
    } catch (err) {
      console.warn("Notice loading pickups:", err.message);
    }

    try {
      // 3. Load Orders & Offers
      const ordersList = await getUserOrders(uid);
      setMyOrders(ordersList);
    } catch (err) {
      console.warn("Notice loading orders:", err.message);
    }

    // 4. If Mechanic/Admin: Load Roadside Emergencies
    if (isMechanic || isAdmin) {
      try {
        const emSnap = await getDocs(collection(db, "emergency"));
        setEmergencyJobs(emSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.warn("Notice loading emergency jobs:", err.message);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!auth.currentUser) return;
    loadDashboardData();
  }, [userRole, isMechanic, isAdmin]);

  const handleDeleteScrap = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete listing "${title}"?`)) return;
    try {
      await deleteScrapListing(id);
      toast.success("Listing removed.");
      loadDashboardData();
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  // PDF Export
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(21, 128, 61);
    doc.text("ScrapX — Circular Automotive Inventory Report", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated for: ${userData?.name || auth.currentUser?.email}`, 14, 28);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 34);

    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`Total Listings: ${totalScraps}`, 14, 46);
    doc.text(`Available Parts: ${availableScraps}`, 14, 53);
    doc.text(`Sold / Recycled Parts: ${soldScraps}`, 14, 60);
    doc.text(`Total Weight: ${totalWeight} kg`, 14, 67);
    doc.text(`Total Inventory Value: Rs. ${totalValue.toLocaleString()}`, 14, 74);

    autoTable(doc, {
      startY: 84,
      head: [["Part Name", "Category", "Weight (kg)", "Price (Rs.)", "Status"]],
      body: sellerScraps.map((s) => [
        s.name,
        s.category,
        s.weight || "N/A",
        `Rs. ${Number(s.price || 0).toLocaleString()}`,
        s.status,
      ]),
      theme: "striped",
      headStyles: { fillColor: [21, 128, 61] },
    });

    doc.save(`ScrapX_Inventory_Report_${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("PDF Report generated and downloaded! 📄");
  };

  // Chart Data
  const chartData = [
    { name: "Available Spares", value: availableScraps || 1 },
    { name: "Sold / Disposed", value: soldScraps },
  ];
  const COLORS = ["#15803D", "#94A3B8"];

  const monthlyRecycleData = [
    { month: "Jun", weightKg: 120, value: 4800 },
    { month: "Jul", weightKg: 210, value: 8900 },
    { month: "Aug", weightKg: 180, value: 7200 },
    { month: "Sep", weightKg: 340, value: 14500 },
    { month: "Oct", weightKg: totalWeight > 0 ? totalWeight : 290, value: totalValue > 0 ? totalValue : 18200 },
  ];

  if (loading) {
    return (
      <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ textAlign: "center", padding: "100px 20px", color: "#64748B" }}>
          <p>Loading real-time command dashboard analytics...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "40px 20px 80px" }}>
        <div className="container" style={{ maxWidth: "1280px" }}>
          
          {/* Dashboard Header Bar */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span className="badge badge-success">
                  {userRole} Hub
                </span>
                <span style={{ fontSize: "0.85rem", color: "#64748B" }}>
                  Active Workspace
                </span>
              </div>
              <h1 style={{ fontSize: "2.3rem", fontWeight: "800", color: "#0F172A", margin: 0 }}>
                {isAdmin ? "Central Admin Command" : isMechanic ? "Mechanic Fleet Hub" : "Vendor & Seller Dashboard"}
              </h1>
              <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: "0.95rem" }}>
                Welcome back, <strong style={{ color: "#15803D" }}>{userData?.name || auth.currentUser?.email}</strong>. Live inventory, scrap pickups, and transaction metrics.
              </p>
            </div>

            {/* Top Quick Actions */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {totalScraps > 0 && (
                <button
                  onClick={downloadPDF}
                  className="btn-secondary"
                  style={{ padding: "9px 16px", fontSize: "0.88rem" }}
                >
                  <FileText size={16} style={{ color: "#15803D" }} /> Export PDF
                </button>
              )}

              <Link to="/pickups" className="btn-secondary" style={{ padding: "9px 16px", fontSize: "0.88rem" }}>
                <Truck size={16} style={{ color: "#15803D" }} /> Book Pickup
              </Link>

              <Link to="/addscrap" className="btn-primary" style={{ padding: "9px 18px", fontSize: "0.88rem" }}>
                <PlusCircle size={16} /> List New Part
              </Link>
            </div>
          </div>

          {/* Metric Cards Row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "32px"
          }}>
            {/* Card 1: Total Listings */}
            <div className="premium-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#64748B", textTransform: "uppercase" }}>
                  Active Listings
                </span>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#ECFDF5", color: "#15803D", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Package size={18} />
                </div>
              </div>
              <div style={{ fontSize: "2rem", fontWeight: "800", color: "#0F172A" }}>
                {totalScraps}
              </div>
              <span style={{ fontSize: "0.82rem", color: "#15803D", fontWeight: "600", marginTop: "4px", display: "block" }}>
                {availableScraps} available for purchase
              </span>
            </div>

            {/* Card 2: Inventory Value */}
            <div className="premium-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#64748B", textTransform: "uppercase" }}>
                  Inventory Valuation
                </span>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TrendingUp size={18} />
                </div>
              </div>
              <div style={{ fontSize: "2rem", fontWeight: "800", color: "#15803D" }}>
                ₹{totalValue.toLocaleString()}
              </div>
              <span style={{ fontSize: "0.82rem", color: "#64748B", marginTop: "4px", display: "block" }}>
                Gross catalog asking price
              </span>
            </div>

            {/* Card 3: Total Weight */}
            <div className="premium-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#64748B", textTransform: "uppercase" }}>
                  Scrap Diverted
                </span>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#F0FDF4", color: "#166534", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Scale size={18} />
                </div>
              </div>
              <div style={{ fontSize: "2rem", fontWeight: "800", color: "#0F172A" }}>
                {totalWeight} kg
              </div>
              <span style={{ fontSize: "0.82rem", color: "#15803D", fontWeight: "600", marginTop: "4px", display: "block" }}>
                🌱 ~{Math.round(totalWeight * 1.8)} kg CO₂ avoided
              </span>
            </div>

            {/* Card 4: Pickups & Orders */}
            <div className="premium-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#64748B", textTransform: "uppercase" }}>
                  Active Transactions
                </span>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#FFFBEB", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ShoppingBag size={18} />
                </div>
              </div>
              <div style={{ fontSize: "2rem", fontWeight: "800", color: "#0F172A" }}>
                {myOrders.length + myPickups.length}
              </div>
              <span style={{ fontSize: "0.82rem", color: "#64748B", marginTop: "4px", display: "block" }}>
                {myPickups.length} pickups • {myOrders.length} buy offers
              </span>
            </div>
          </div>

          {/* Visual Analytics Row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "24px",
            marginBottom: "36px"
          }} className="charts-layout">
            
            {/* Monthly Trend Bar Chart */}
            <div className="premium-card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0F172A", marginBottom: "4px" }}>
                Recycling & Salvage Payout Performance
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.85rem", marginBottom: "20px" }}>
                Monthly scrap material volume (kg) across transactions
              </p>
              
              <div style={{ height: "240px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRecycleData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "10px", border: "1px solid #E2E8F0" }}
                      formatter={(val) => [`${val} kg`, "Volume Recycled"]}
                    />
                    <Bar dataKey="weightKg" fill="#15803D" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Inventory Distribution Pie Chart */}
            <div className="premium-card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0F172A", marginBottom: "4px" }}>
                Catalog Availability Distribution
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.85rem", marginBottom: "16px" }}>
                Ratio of listed available spares vs sold components
              </p>

              <div style={{ height: "240px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "10px", border: "1px solid #E2E8F0" }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Real Inventory Management Table */}
          <div className="premium-card" style={{ padding: "28px", marginBottom: "36px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0F172A", margin: "0 0 4px" }}>
                  My Listed Inventory ({sellerScraps.length})
                </h3>
                <p style={{ color: "#64748B", fontSize: "0.85rem", margin: 0 }}>
                  Manage live prices, modify specifications, or archive completed components.
                </p>
              </div>

              <Link to="/addscrap" className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                <PlusCircle size={15} /> Add Product
              </Link>
            </div>

            {sellerScraps.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <Package size={40} style={{ color: "#94A3B8", margin: "0 auto 12px" }} />
                <p style={{ color: "#64748B", fontSize: "0.92rem", marginBottom: "16px" }}>
                  You haven't listed any spare parts or scrap materials yet.
                </p>
                <Link to="/addscrap" className="btn-primary">
                  List Your First Part
                </Link>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #E2E8F0", color: "#475569" }}>
                      <th style={{ padding: "12px 14px" }}>Part Title</th>
                      <th style={{ padding: "12px 14px" }}>Category</th>
                      <th style={{ padding: "12px 14px" }}>Weight</th>
                      <th style={{ padding: "12px 14px" }}>Asking Price</th>
                      <th style={{ padding: "12px 14px" }}>Status</th>
                      <th style={{ padding: "12px 14px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellerScraps.map((s, idx) => (
                      <tr
                        key={s.id}
                        style={{
                          borderBottom: idx === sellerScraps.length - 1 ? "none" : "1px solid #F1F5F9",
                          transition: "background 0.15s ease"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8FAFC")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <td style={{ padding: "14px", fontWeight: "700", color: "#0F172A" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <img
                              src={s.image || (s.images && s.images[0]) || "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=200"}
                              alt={s.name}
                              style={{ width: "42px", height: "42px", borderRadius: "6px", objectFit: "cover" }}
                            />
                            <span>{s.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px", color: "#64748B" }}>
                          {s.category}
                        </td>
                        <td style={{ padding: "14px", color: "#64748B" }}>
                          {s.weight ? `${s.weight} kg` : "N/A"}
                        </td>
                        <td style={{ padding: "14px", fontWeight: "800", color: "#15803D" }}>
                          ₹{Number(s.price || 0).toLocaleString()}
                        </td>
                        <td style={{ padding: "14px" }}>
                          <span className={`badge ${s.status === "Available" ? "badge-success" : "badge-neutral"}`} style={{ fontSize: "0.72rem" }}>
                            {s.status}
                          </span>
                        </td>
                        <td style={{ padding: "14px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "8px" }}>
                            <Link
                              to={`/edit/${s.id}`}
                              style={{
                                padding: "6px",
                                borderRadius: "6px",
                                border: "1px solid #E2E8F0",
                                color: "#475569",
                                display: "flex",
                                alignItems: "center"
                              }}
                              title="Edit item"
                            >
                              <Edit size={14} />
                            </Link>
                            <button
                              onClick={() => handleDeleteScrap(s.id, s.name)}
                              style={{
                                padding: "6px",
                                borderRadius: "6px",
                                border: "1px solid #FECACA",
                                backgroundColor: "#FEF2F2",
                                color: "#DC2626",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center"
                              }}
                              title="Delete item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Scheduled Pickups & Active Orders Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="sub-tables-layout">
            
            {/* Scheduled Pickups Quick Card */}
            <div className="premium-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#0F172A", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                  <Truck size={18} style={{ color: "#15803D" }} /> Scheduled Pickups
                </h3>
                <Link to="/pickups" style={{ fontSize: "0.82rem", color: "#15803D", fontWeight: "700" }}>
                  Manage All →
                </Link>
              </div>

              {myPickups.length === 0 ? (
                <p style={{ color: "#64748B", fontSize: "0.88rem", margin: 0 }}>No active pickup appointments scheduled.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {myPickups.slice(0, 3).map((p) => (
                    <div key={p.id} style={{ padding: "12px", background: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <strong style={{ fontSize: "0.9rem", color: "#0F172A" }}>{p.materialName} ({p.estimatedWeight} kg)</strong>
                        <span className={`badge ${p.status === "Confirmed" ? "badge-success" : "badge-neutral"}`} style={{ fontSize: "0.68rem" }}>
                          {p.status}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#64748B" }}>
                        <span>📅 {p.date} ({p.timeSlot?.split(" ")[0]})</span>
                        <strong style={{ color: "#15803D" }}>₹{p.estimatedPrice?.toLocaleString()}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Buy Requests Quick Card */}
            <div className="premium-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#0F172A", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                  <ShoppingBag size={18} style={{ color: "#15803D" }} /> Recent Buy Requests
                </h3>
                <Link to="/orders" style={{ fontSize: "0.82rem", color: "#15803D", fontWeight: "700" }}>
                  View All Orders →
                </Link>
              </div>

              {myOrders.length === 0 ? (
                <p style={{ color: "#64748B", fontSize: "0.88rem", margin: 0 }}>No pending buy requests at this time.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {myOrders.slice(0, 3).map((o) => (
                    <div key={o.id} style={{ padding: "12px", background: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <strong style={{ fontSize: "0.9rem", color: "#0F172A" }}>{o.scrapName}</strong>
                        <span className="badge badge-success" style={{ fontSize: "0.68rem" }}>
                          {o.status}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#64748B" }}>
                        <span>Buyer: {o.buyerName}</span>
                        <strong style={{ color: "#15803D" }}>Offer: ₹{o.offerPrice?.toLocaleString()}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .charts-layout, .sub-tables-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
