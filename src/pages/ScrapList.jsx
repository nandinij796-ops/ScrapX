import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { getDocs, doc, deleteDoc, addDoc, collection } from "firebase/firestore";
import Navbar from "../components/Navbar";
import { Link, useSearchParams } from "react-router-dom";

function ScrapList() {
  const [scraps, setScraps] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("q") || "";
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    fetchScraps();
  }, []);

  const fetchScraps = async () => {
    const snapshot = await getDocs(collection(db, "scraps"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setScraps(data);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this scrap?");
    if(confirmDelete){
      await deleteDoc(doc(db,"scraps",id));
      fetchScraps();
    }
  };

  const handleBuy = async (scrap) => {
    try{
      if(!auth.currentUser){
        alert("Please login first");
        return;
      }
      if(!scrap.ownerId){
        alert("Seller information missing");
        return;
      }
      await addDoc(collection(db,"buyRequests"),{
        scrapId: scrap.id,
        scrapName: scrap.name,
        sellerId: scrap.ownerId,
        buyerId: auth.currentUser.uid,
        status: "Pending",
        createdAt: new Date().toLocaleString()
      });
      alert("Buy request sent ✅");
    } catch(error) {
      alert(error.message);
    }
  };

  const filteredScraps = scraps.filter((scrap) => {
    const statusMatch = filter === "All" || scrap.status === filter;
    const searchMatch = scrap.name?.toLowerCase().includes(search.toLowerCase()) || scrap.category?.toLowerCase().includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", color: "#f8fafc" }}>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", gap: "20px" }}>
          <h2 style={{ fontSize: "2rem", color: "#f8fafc", margin: 0 }}>
            🛒 Spare Parts <span style={{ color: "#3b82f6" }}>Market</span>
          </h2>

          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", flex: 1, maxWidth: "600px", justifyContent: "flex-end" }}>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: "12px 16px", borderRadius: "8px", border: "1px solid #334155",
                background: "#1e293b", color: "#f8fafc", fontSize: "1rem", outline: "none"
              }}
            >
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
            </select>

            <input
              type="text"
              placeholder="Search Parts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1, minWidth: "200px", padding: "12px 16px", borderRadius: "8px", 
                border: "1px solid #334155", background: "#1e293b", color: "#f8fafc", 
                fontSize: "1rem", outline: "none"
              }}
            />
          </div>
        </div>

        {filteredScraps.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", background: "#1e293b", borderRadius: "16px", border: "1px solid #334155" }}>
            <h3 style={{ color: "#94a3b8", margin: 0 }}>No items found.</h3>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
            {filteredScraps.map((scrap) => (
              <div 
                key={scrap.id} 
                style={{
                  background: "#1e293b", borderRadius: "16px", overflow: "hidden",
                  border: "1px solid #334155", display: "flex", flexDirection: "column",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)", transition: "transform 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <img
                  src={scrap.image || "https://images.unsplash.com/photo-1530906358829-e84b2769270f?auto=format&fit=crop&q=80&w=500"}
                  alt={scrap.name}
                  style={{ width: "100%", height: "200px", objectFit: "cover", borderBottom: "1px solid #334155" }}
                />
                
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#f8fafc" }}>{scrap.name}</h3>
                    <span style={{ background: scrap.status === "Available" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)", color: scrap.status === "Available" ? "#10b981" : "#ef4444", padding: "4px 8px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "600" }}>
                      {scrap.status}
                    </span>
                  </div>
                  
                  <p style={{ margin: "0 0 5px 0", color: "#94a3b8", fontSize: "0.9rem" }}>Category: <span style={{ color: "#e2e8f0" }}>{scrap.category}</span></p>
                  <p style={{ margin: "0 0 15px 0", color: "#94a3b8", fontSize: "0.9rem" }}>Weight: <span style={{ color: "#e2e8f0" }}>{scrap.weight} kg</span></p>
                  
                  <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #334155", paddingTop: "15px" }}>
                    <span style={{ fontSize: "1.3rem", fontWeight: "700", color: "#3b82f6" }}>₹{scrap.price}</span>
                    
                    {auth.currentUser?.uid === scrap.ownerId ? (
                      <div style={{ display: "flex", gap: "10px" }}>
                        <Link to={`/edit/${scrap.id}`} style={{ textDecoration: "none" }}>
                          <button style={{ padding: "6px 12px", background: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Edit</button>
                        </Link>
                        <button onClick={() => handleDelete(scrap.id)} style={{ padding: "6px 12px", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Delete</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleBuy(scrap)}
                        disabled={scrap.status !== "Available"}
                        style={{ padding: "8px 16px", background: scrap.status === "Available" ? "#10b981" : "#475569", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: scrap.status === "Available" ? "pointer" : "not-allowed" }}
                      >
                        {scrap.status === "Available" ? "Buy Now" : "Unavailable"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ScrapList;