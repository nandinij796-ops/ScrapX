import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";

function Emergency() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "emergency"), {
      name,
      phone,
      location,
      description,
      createdAt: new Date(),
    });

    alert("Emergency Request Submitted!");

    setName("");
    setPhone("");
    setLocation("");
    setDescription("");
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          width: "400px",
          margin: "40px auto",
          padding: "20px",
          boxShadow: "0 0 10px gray",
          borderRadius: "10px",
        }}
      >
        <h2>Emergency Request</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <br />
          <br />

          <input
            type="tel"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <br />
          <br />

          <input
            type="text"
            placeholder="Enter Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <br />
          <br />

          <textarea
            placeholder="Describe Emergency"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            style={{ width: "100%" }}
            required
          />

          <br />
          <br />

          <button type="submit">Submit Request</button>
        </form>
      </div>
    </>
  );
}

export default Emergency;