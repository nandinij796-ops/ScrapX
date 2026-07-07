import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [totalScraps, setTotalScraps] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "scraps"));

      let weight = 0;
      let value = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        weight += Number(data.weight);
        value += Number(data.price);
      });

      setTotalScraps(querySnapshot.size);
      setTotalWeight(weight);
      setTotalValue(value);
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />

      <h2 style={{ textAlign: "center" }}>Dashboard</h2>

      <div style={{ padding: "20px" }}>
        <div
          style={{
            background: "#2563eb",
            color: "white",
            padding: "20px",
            margin: "15px",
            borderRadius: "10px",
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
            margin: "15px",
            borderRadius: "10px",
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
            margin: "15px",
            borderRadius: "10px",
          }}
        >
          <h3>Total Value</h3>
          <h1>₹{totalValue}</h1>
        </div>
      </div>
    </>
  );
}

export default Dashboard;