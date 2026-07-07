import { useEffect, useState } from "react";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Link } from "react-router-dom";

function ScrapList() {
  const [scraps, setScraps] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchScraps();
  }, []);

  const fetchScraps = async () => {
    const querySnapshot = await getDocs(collection(db, "scraps"));

    const data = querySnapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    setScraps(data);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "scraps", id));

    setScraps(scraps.filter((scrap) => scrap.id !== id));

    alert("Scrap Deleted Successfully!");
  };

  const filteredScraps = scraps.filter((scrap) =>
    scrap.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <h2>Scrap List</h2>

      <input
        type="text"
        placeholder="Search Scrap..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <br />
      <br />

      {filteredScraps.length === 0 ? (
        <p>No Scrap Found</p>
      ) : (
        filteredScraps.map((scrap) => (
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

            <div style={{ marginTop: "10px" }}>
              <Link to={`/edit/${scrap.id}`}>
                <button>Edit</button>
              </Link>

              <button
                onClick={() => handleDelete(scrap.id)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
}

export default ScrapList;1