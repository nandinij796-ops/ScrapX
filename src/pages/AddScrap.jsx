import Navbar from "../components/Navbar";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function AddScrap() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Engine Parts");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("Available");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!auth.currentUser) {
        toast.error("Please login first!");
        return;
      }
      if (!name || !weight || !price) {
        toast.error("Please fill all required fields");
        return;
      }

      await addDoc(collection(db, "scraps"), {
        name,
        category,
        weight,
        price,
        image: image || "https://images.unsplash.com/photo-1530906358829-e84b2769270f?auto=format&fit=crop&q=80&w=500",
        status,
        ownerId: auth.currentUser.uid,
        ownerEmail: auth.currentUser.email,
        createdAt: new Date().toLocaleString(),
      });

      toast.success("Product Listed Successfully 🎉");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const inputStyle = {
    width: "100%", padding: "14px", marginBottom: "20px",
    borderRadius: "10px", border: "1px solid #334155",
    background: "#0f172a", color: "white", fontSize: "1rem", outline: "none"
  };

  const labelStyle = {
    display: "block", color: "#94a3b8", marginBottom: "8px", fontWeight: "500", fontSize: "0.95rem"
  };

  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", color: "#f8fafc" }}>
      <Navbar />

      <div style={{ maxWidth: "600px", margin: "60px auto", padding: "40px", background: "#1e293b", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)", border: "1px solid #334155" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "10px", color: "#f8fafc", textAlign: "center" }}>
          List a <span style={{ color: "#3b82f6" }}>Product</span>
        </h2>
        <p style={{ textAlign: "center", color: "#94a3b8", marginBottom: "30px" }}>
          Provide the details of your scrap part to list it on the marketplace.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Part Name *</label>
          <input type="text" placeholder="e.g. Tata Nexon Headlight" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />

          <label style={labelStyle}>Category *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
            <option value="Engine Parts">Engine Parts</option>
            <option value="Body Parts">Body & Frame</option>
            <option value="Electronics">Electricals & Electronics</option>
            <option value="Interior">Interior Accessories</option>
            <option value="Other">Other Scrap</option>
          </select>

          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Weight (kg) *</label>
              <input type="number" placeholder="e.g. 5.5" value={weight} onChange={(e) => setWeight(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Price (₹) *</label>
              <input type="number" placeholder="e.g. 2500" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <label style={labelStyle}>Image URL (Optional)</label>
          <input type="text" placeholder="https://example.com/image.jpg" value={image} onChange={(e) => setImage(e.target.value)} style={inputStyle} />

          <label style={labelStyle}>Initial Status *</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
          </select>

          <button type="submit" style={{ width: "100%", padding: "16px", background: "#3b82f6", color: "white", border: "none", borderRadius: "10px", fontSize: "1.1rem", fontWeight: "700", cursor: "pointer", marginTop: "10px", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "#2563eb"} onMouseOut={(e) => e.currentTarget.style.background = "#3b82f6"}>
            Publish Listing &rarr;
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddScrap;