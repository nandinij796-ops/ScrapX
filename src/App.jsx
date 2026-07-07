import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrapList from "./pages/ScrapList";
import EditScrap from "./pages/EditScrap";
import Emergency from "./pages/Emergency";
import EmergencyList from "./pages/EmergencyList";

import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AddScrap from "./pages/AddScrap";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

        <Route
          path="/scraps"
          element={
            <ProtectedRoute>
              <ScrapList />
            </ProtectedRoute>
          }
        />
        <Route
  path="/emergency-list"
  element={
    <ProtectedRoute>
      <EmergencyList />
    </ProtectedRoute>
  }
/>

        <Route
          path="/addscrap"
          element={
            <ProtectedRoute>
              <AddScrap />
            </ProtectedRoute>
          }
        />
        

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditScrap />
            </ProtectedRoute>
          }
        />
        <Route
  path="/emergency"
  element={
    <ProtectedRoute>
      <Emergency />
    </ProtectedRoute>
  }
/>
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;