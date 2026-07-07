import Navbar from "../components/Navbar";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

function AddScrap() {
  const [status, setStatus] = useState("Available");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "scraps"), {
        name,
        category,
        weight,
        price,
        image,
        status,
        createdAt:new Date().toLocaleString(),
      });

      alert("Scrap Added Successfully 🎉");

      setName("");
      setCategory("");
      setWeight("");
      setPrice("");
      setImage("");
      setStatus("Available")
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar />

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
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
       type="text"
       placeholder="Enter Image URL"
      value={image}
      onChange={(e) => setImage(e.target.value)}
      required
      />
      <select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
>
  <option value="Available">Available</option>
  <option value="Sold">Sold</option>
</select>

<br /><br />


      <br /><br />

      <button onClick={handleSubmit}>Add Scrap</button>
    </>
  );
}

export default AddScrap;