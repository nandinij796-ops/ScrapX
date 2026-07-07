import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
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
  doc.text("ScrapX Report", 14, 20);

  doc.setFontSize(12);
  doc.text(`Total Scraps: ${totalScraps}`, 14, 30);
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

  doc.save("ScrapX_Report.pdf");
};
  const [totalScraps, setTotalScraps] = useState(0);
  const [availableScraps, setAvailableScraps] = useState(0);
  const [soldScraps, setSoldScraps] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [recentScraps, setRecentScraps] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "scraps"));

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

      <div className="dashboard">
        <h1>Dashboard</h1>

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
        <div style={{ textAlign: "center", margin: "20px 0" }}>
  <button
    onClick={downloadPDF}
    style={{
      padding: "12px 25px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
    }}
  >
    📄 Download PDF Report
  </button>
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