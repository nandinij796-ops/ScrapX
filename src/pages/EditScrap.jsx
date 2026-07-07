import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

function EditScrap() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("Available");

  useEffect(() => {
    const fetchScrap = async () => {
      const docRef = doc(db, "scraps", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setName(data.name || "");
        setCategory(data.category || "");
        setWeight(data.weight || "");
        setPrice(data.price || "");
        setImage(data.image || "");
        setStatus(data.status || "Available");
      }
    };

    fetchScrap();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "scraps", id), {
        name,
        category,
        weight,
        price,
        image,
        status,
      });

      alert("Scrap Updated Successfully 🎉");
      navigate("/scraps");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>Edit Scrap</h2>

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
          placeholder="Weight"
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

        {image && (
          <>
            <img
              src={image}
              alt="Preview"
              width="150"
              style={{ borderRadius: "10px" }}
            />
            <br /><br />
          </>
        )}

        <button onClick={handleUpdate}>
          Update Scrap
        </button>
      </div>
    </>
  );
}

export default EditScrap;