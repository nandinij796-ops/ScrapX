import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [totalScraps, setTotalScraps] = useState(0);
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
    const scrapList = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      scrapList.push({
        id: doc.id,
        ...data,
      });

      weight += Number(data.weight);
      value += Number(data.price);
    });

    setTotalScraps(querySnapshot.size);
    setTotalWeight(weight);
    setTotalValue(value);
    setRecentScraps(scrapList.slice(0, 5));
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          Dashboard
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#2563eb",
              color: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h3>Total Scraps</h3>
            <h1>{totalScraps}</h1>
          </div>

          <div
            style={{
              background: "#16a34a",
              color: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h3>Total Weight</h3>
            <h1>{totalWeight} kg</h1>
          </div>

          <div
            style={{
              background: "#ea580c",
              color: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h3>Total Value</h3>
            <h1>₹{totalValue}</h1>
          </div>
        </div>

        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            background: "#f8f8f8",
            borderRadius: "10px",
          }}
        >
          <h2>Recent Scraps</h2>

          {recentScraps.length === 0 ? (
            <p>No Scrap Available</p>
          ) : (
            recentScraps.map((scrap) => (
              <div
                key={scrap.id}
                style={{
                  borderBottom: "1px solid #ccc",
                  padding: "10px 0",
                }}
              >
                <strong>{scrap.name}</strong>
                <p>Category: {scrap.category}</p>
                <p>Weight: {scrap.weight} kg</p>
                <p>Price: ₹{scrap.price}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;