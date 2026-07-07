import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function ScrapList() {
  const [scraps, setScraps] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchScraps();
  }, []);

  const fetchScraps = async () => {
    const querySnapshot = await getDocs(collection(db, "scraps"));

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setScraps(data);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this scrap?"
    );

    if (confirmDelete) {
      await deleteDoc(doc(db, "scraps", id));
      fetchScraps();
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>Scrap List</h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
        </select>

        <br /><br />

        <input
          type="text"
          placeholder="Search Scrap..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <br /><br />

        {scraps.length === 0 ? (
          <p>No Scrap Found</p>
        ) : (
          scraps
            .filter((scrap) => {
              const statusMatch =
                filter === "All" || scrap.status === filter;

              const searchMatch = scrap.name
                ?.toLowerCase()
                .includes(search.toLowerCase());

              return statusMatch && searchMatch;
            })
            .map((scrap) => (
              <div
                key={scrap.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "15px",
                  marginBottom: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                {scrap.image ? (
                  <img
                    src={scrap.image}
                    alt={scrap.name}
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginBottom: "10px",
                    }}
                  />
                ) : (
                  <p>No Image</p>
                )}

                <h3>{scrap.name}</h3>

                <p><strong>Category:</strong> {scrap.category}</p>

                <p><strong>Weight:</strong> {scrap.weight} kg</p>

                <p><strong>Price:</strong> ₹{scrap.price}</p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      backgroundColor:
                        scrap.status === "Available"
                          ? "green"
                          : "red",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "5px",
                    }}
                  >
                    {scrap.status}
                  </span>
                </p>

                <p>
                  <strong>Added On:</strong>{" "}
                  {scrap.createdAt || "N/A"}
                </p>

                <br />

                <Link to={`/edit/${scrap.id}`}>
                  <button
                    style={{
                      marginRight: "10px",
                      padding: "8px 15px",
                      backgroundColor: "blue",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                </Link>

                <button
                  onClick={() => handleDelete(scrap.id)}
                  style={{
                    padding: "8px 15px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            ))
        )}
      </div>
    </>
  );
}

export default ScrapList;