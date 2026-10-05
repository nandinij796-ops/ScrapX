import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
    const downloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("ScrapX Seller Report", 14, 20);

  doc.setFontSize(12);
  doc.text(`Total Listings: ${totalScraps}`, 14, 30);
  doc.text(`Available: ${availableScraps}`, 14, 38);
  doc.text(`Sold: ${soldScraps}`, 14, 46);
  doc.text(`Total Weight: ${totalWeight} kg`, 14, 54);
  doc.text(`Total Value: ₹${totalValue}`, 14, 62);

  autoTable(doc, {
    startY: 72,
    head: [["Name", "Category", "Weight", "Price", "Status"]],
    body: recentScraps.map((scrap) => [
      scrap.name,
      scrap.category,
      `${scrap.weight} kg`,
      `₹${scrap.price}`,
      scrap.status,
    ]),
  });

  doc.save("ScrapX_Seller_Report.pdf");
};
  const [totalScraps, setTotalScraps] = useState(0);
  const [availableScraps, setAvailableScraps] = useState(0);
  const [soldScraps, setSoldScraps] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [recentScraps, setRecentScraps] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    if (!auth.currentUser) return;
    
    // Filter to only show the CURRENT USER's listed products
    const q = query(collection(db, "scraps"), where("ownerId", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    let weight = 0;
    let value = 0;
    let available = 0;
    let sold = 0;
    const scrapList = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      scrapList.push({
        id: doc.id,
        ...data,
      });

      weight += Number(data.weight || 0);
      value += Number(data.price || 0);

      if (data.status === "Available") {
        available++;
      } else if (data.status === "Sold") {
        sold++;
      }
    });

    setTotalScraps(querySnapshot.size);
    setAvailableScraps(available);
    setSoldScraps(sold);
    setTotalWeight(weight);
    setTotalValue(value);
    setRecentScraps(scrapList.slice(0, 5));
  };

  const chartData = [
    { name: "Available", value: availableScraps },
    { name: "Sold", value: soldScraps },
  ];

  return (
    <>
      <Navbar />

      <div className="dashboard" style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "2.5rem", color: "#1e293b" }}>Seller Hub</h1>
            <p style={{ margin: "5px 0 0 0", color: "#64748b" }}>Manage your products and track sales performance</p>
          </div>
          
          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={downloadPDF}
              style={{ padding: "12px 24px", background: "white", color: "#3b82f6", border: "2px solid #3b82f6", borderRadius: "8px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
            >
              📄 Export Report
            </button>
            <Link
              to="/addscrap"
              style={{ padding: "12px 24px", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.4)" }}
            >
              ➕ List New Product
            </Link>
          </div>
        </div>

        <div className="cards">
          <div
            className="card"
            style={{ background: "#2563eb", color: "white" }}
          >
            <h3>Total Scraps</h3>
            <h1>{totalScraps}</h1>
          </div>

          <div
            className="card"
            style={{ background: "#16a34a", color: "white" }}
          >
            <h3>Available</h3>
            <h1>{availableScraps}</h1>
          </div>

          <div
            className="card"
            style={{ background: "#dc2626", color: "white" }}
          >
            <h3>Sold</h3>
            <h1>{soldScraps}</h1>
          </div>

          <div
            className="card"
            style={{ background: "#7c3aed", color: "white" }}
          >
            <h3>Total Weight</h3>
            <h1>{totalWeight} kg</h1>
          </div>

          <div
            className="card"
            style={{ background: "#ea580c", color: "white" }}
          >
            <h3>Total Value</h3>
            <h1>₹{totalValue}</h1>
          </div>
        </div>

        <div className="recent" style={{ marginBottom: "30px" }}>
          <h2>Scrap Status Chart</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                <Cell fill="#16a34a" />
                <Cell fill="#dc2626" />
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="recent">
          <h2>Recent Scraps</h2>

          {recentScraps.length === 0 ? (
            <p>No Scrap Available</p>
          ) : (
            recentScraps.map((scrap) => (
              <div key={scrap.id} className="scrap-item">
                <strong>{scrap.name}</strong>

                <p>Category: {scrap.category}</p>
                <p>Weight: {scrap.weight} kg</p>
                <p>Price: ₹{scrap.price}</p>
                <p>Status: {scrap.status}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;