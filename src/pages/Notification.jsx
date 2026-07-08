import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase";

function Notifications() {

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const q = query(
      collection(db, "buyRequests"),
      where("sellerId", "==", auth.currentUser.uid)
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setRequests(data);
  };


  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "buyRequests", id), {
      status: status,
    });

    alert(`Request ${status} ✅`);
    fetchRequests();
  };


  return (
    <>
      <Navbar />

      <div style={{padding:"20px"}}>
        <h2>🔔 Buy Requests</h2>

        {requests.length === 0 ? (
          <p>No Requests Found</p>
        ) : (

          requests.map((req)=>(
            <div
              key={req.id}
              style={{
                border:"1px solid #ccc",
                padding:"15px",
                marginBottom:"15px",
                borderRadius:"10px"
              }}
            >

              <h3>{req.scrapName}</h3>

              <p>
                Status: {req.status}
              </p>


              <button
                onClick={()=>updateStatus(req.id,"Accepted")}
              >
                Accept ✅
              </button>


              <button
                onClick={()=>updateStatus(req.id,"Rejected")}
                style={{marginLeft:"10px"}}
              >
                Reject ❌
              </button>

            </div>
          ))

        )}

      </div>
    </>
  );
}

export default Notifications;