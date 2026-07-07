import { useEffect, useState } from "react";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

function ScrapList() {
  const [scraps, setScraps] = useState([]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "scraps", id));

    setScraps(scraps.filter((scrap) => scrap.id !== id));

    alert("Scrap Deleted Successfully!");
  };

  useEffect(() => {
    const fetchScraps = async () => {
      const querySnapshot = await getDocs(collection(db, "scraps"));

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setScraps(data);
    };

    fetchScraps();
  }, []);

  return (
    <>
      <Navbar />
      <h2>Scrap List</h2>

      {scraps.map((scrap) => (
        <div
          key={scrap.id}
          style={{
            border: "1px solid gray",
            padding: "15px",
            margin: "10px",
            borderRadius: "8px",
          }}
        >
          <h3>{scrap.name}</h3>
          <p>Category: {scrap.category}</p>
          <p>Weight: {scrap.weight} kg</p>
          <p>Price: ₹{scrap.price}</p>

          <button onClick={() => handleDelete(scrap.id)}>
            Delete
          </button>
        </div>
      ))}
    </>
  );
}

export default ScrapList;