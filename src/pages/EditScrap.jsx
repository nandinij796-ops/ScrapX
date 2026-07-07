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

  useEffect(() => {
    const fetchScrap = async () => {
      const docRef = doc(db, "scraps", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setName(data.name);
        setCategory(data.category);
        setWeight(data.weight);
        setPrice(data.price);
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

      <button onClick={handleUpdate}>
        Update Scrap
      </button>
    </>
  );
}

export default EditScrap;