import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  getDocs,
  doc,
  deleteDoc,
  addDoc,
  collection,
} from "firebase/firestore";
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
    const snapshot = await getDocs(collection(db, "scraps"));

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setScraps(data);
  };


  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this scrap?"
    );

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

        scrapId:scrap.id,
        scrapName:scrap.name,
        sellerId:scrap.ownerId,
        buyerId:auth.currentUser.uid,
        status:"Pending",
        createdAt:new Date().toLocaleString()

      });


      alert("Buy request sent ✅");


    }catch(error){

      alert(error.message);

    }

  };


  return (
    <>
      <Navbar />

      <div className="scrap-container">

        <h2>🚗 Scrap List</h2>


        <select
          className="filter-box"
          value={filter}
          onChange={(e)=>setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
        </select>


        <input
          className="search-box"
          type="text"
          placeholder="Search Scrap..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />


        {
          scraps
          .filter((scrap)=>{

            const statusMatch =
            filter==="All" || scrap.status===filter;


            const searchMatch =
            scrap.name?.toLowerCase()
            .includes(search.toLowerCase());


            return statusMatch && searchMatch;

          })
          .map((scrap)=>(


          <div className="scrap-card" key={scrap.id}>


            {
              scrap.image ?
              <img
                src={scrap.image}
                alt={scrap.name}
                className="scrap-image"
              />
              :
              <p>No Image</p>
            }


            <h3>{scrap.name}</h3>

            <p>Category: {scrap.category}</p>

            <p>Weight: {scrap.weight} kg</p>

            <p>Price: ₹{scrap.price}</p>


            <p>
              Status:
              <span className="status">
                {scrap.status}
              </span>
            </p>


            {
              auth.currentUser?.uid === scrap.ownerId ?

              <div>

                <Link to={`/edit/${scrap.id}`}>
                  <button className="edit-btn">
                    Edit ✏️
                  </button>
                </Link>


                <button
                  className="delete-btn"
                  onClick={()=>handleDelete(scrap.id)}
                >
                  Delete 🗑️
                </button>

              </div>

              :

              <button
                className="buy-btn"
                onClick={()=>handleBuy(scrap)}
              >
                Buy Now 🛒
              </button>

            }


          </div>


          ))

        }


      </div>
    </>
  );
}

export default ScrapList;