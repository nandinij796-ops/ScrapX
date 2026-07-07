import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";

function EmergencyList() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const querySnapshot = await getDocs(collection(db, "emergency"));

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setRequests(data);
  };

  return (
    <>
      <Navbar />

      <h2 style={{ textAlign: "center" }}>Emergency Requests</h2>

      <div style={{ padding: "20px" }}>
        {requests.length === 0 ? (
          <p>No Emergency Requests</p>
        ) : (
          requests.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "10px",
              }}
            >
              <h3>{item.name}</h3>
              <p><strong>Phone:</strong> {item.phone}</p>
              <p><strong>Location:</strong> {item.location}</p>
              <p><strong>Description:</strong> {item.description}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default EmergencyList;