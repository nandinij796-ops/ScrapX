import Navbar from "../components/Navbar";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase";

function AddScrap() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("Available");

  const handleSubmit = async () => {
    try {
      if (!auth.currentUser) {
        alert("Please login first!");
        return;
      }

      await addDoc(collection(db, "scraps"), {
        name,
        category,
        weight,
        price,
        image,
        status,
        ownerId: auth.currentUser.uid,
        ownerEmail: auth.currentUser.email,
        createdAt: new Date().toLocaleString(),
      });

      alert("Scrap Added Successfully 🎉");

      setName("");
      setCategory("");
      setWeight("");
      setPrice("");
      setImage("");
      setStatus("Available");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>Add Scrap</h2>

        <input
          type="text"
          placeholder="Scrap Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <br /><br />

        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <br /><br />

        <input
          type="number"
          placeholder="Price (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <br /><br />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
        </select>

        <br /><br />

        <button onClick={handleSubmit}>
          Add Scrap
        </button>
      </div>
    </>
  );
}

export default AddScrap;