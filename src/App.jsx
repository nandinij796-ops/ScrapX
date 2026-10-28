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
import Notification from "./pages/Notification";
import Chat from "./pages/Chat";
import NearbyMap from "./pages/NearbyMap";
import PickupSchedule from "./pages/PickupSchedule";
import ScrapRates from "./pages/ScrapRates";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#1E293B",
            color: "#F8FAFC",
            border: "1px solid #334155",
            borderRadius: "10px",
            fontSize: "0.92rem",
          },
          success: {
            iconTheme: {
              primary: "#15803D",
              secondary: "#FFFFFF",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#FFFFFF",
            },
          },
        }}
      />
      <Routes>
        {/* Public Core Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/scraps" element={<ScrapList />} />
        <Route path="/pickups" element={<PickupSchedule />} />
        <Route path="/rates" element={<ScrapRates />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/nearby" element={<NearbyMap />} />

        {/* Member & Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddScrap />
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
          path="/emergency-list"
          element={
            <ProtectedRoute allowedRoles={["Mechanic", "Admin"]}>
              <EmergencyList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
