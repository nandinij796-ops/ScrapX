import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrapList from "./pages/ScrapList";

import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AddScrap from "./pages/AddScrap";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/scraps"element={<ProtectedRoute><ScrapList /></ProtectedRoute>}/>
        <Route path="/"element={<ProtectedRoute> <Home /></ProtectedRoute>}/>
        <Route path="/addscrap"element={<ProtectedRoute><AddScrap /></ProtectedRoute>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;