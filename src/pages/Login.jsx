import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async () => {

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Login Successful 🎉");

      navigate("/");

    } catch(error) {

      alert(error.message);

    }

  };


  return (
    <>
      <Navbar />

      <div className="login-container">

        <h2>Login</h2>


        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />


        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />


        <button onClick={handleLogin}>
          Login 🚗
        </button>


      </div>

    </>
  );
}

export default Login;