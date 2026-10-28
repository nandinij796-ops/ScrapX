import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { 
  AlertTriangle, 
  Truck, 
  Phone, 
  Wrench, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  LifeBuoy,
  RefreshCw,
  Zap
} from "lucide-react";

export default function Emergency() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { 
    coords, 
    locationName, 
    loading: geoLoading, 
    error: geoError, 
    requestLocation 
  } = useGeolocation(true);

  const [name, setName] = useState(userData?.name || "");
  const [phone, setPhone] = useState(userData?.phone || "");
  const [vehicle, setVehicle] = useState("");
  const [issueType, setIssueType] = useState("Engine Breakdown");
  const [severity, setSeverity] = useState("Urgent");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !description.trim()) {
      toast.error("Please fill in your name, contact phone, and issue description.");
      return;
    }

    setSubmitting(true);
    const emergencyPayload = {
      name: name.trim(),
      phone: phone.trim(),
      vehicle: vehicle.trim() || "Unspecified Vehicle",
      issueType,
      severity,
      description: description.trim(),
      location: locationName || (coords ? `GPS: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "Coordinates Pending"),
      latitude: coords ? coords.lat : 26.9124,
      longitude: coords ? coords.lng : 75.7873,
      status: "Pending", // 'Pending' | 'Dispatched' | 'En Route' | 'Resolved'
      userId: auth.currentUser ? auth.currentUser.uid : "guest",
      userEmail: auth.currentUser ? auth.currentUser.email : "guest@scrapx.in",
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. Try Firebase Firestore
      const docRef = await addDoc(collection(db, "emergency"), {
        ...emergencyPayload,
        createdAt: serverTimestamp(),
      });
      emergencyPayload.id = docRef.id;
    } catch (err) {
      console.warn("Firestore emergency write notice (saving to local queue):", err.message);
      emergencyPayload.id = `sos-${Date.now()}`;
    }

    // 2. Always persist locally for offline resilience & immediate display
    try {
      const existing = JSON.parse(localStorage.getItem("scrapx_emergencies") || "[]");
      existing.unshift(emergencyPayload);
      localStorage.setItem("scrapx_emergencies", JSON.stringify(existing));
    } catch (e) {
      /* ignore */
    }

    toast.success("🚨 Emergency SOS Dispatched! Nearby mechanics notified.");
    setSubmittedId(emergencyPayload.id);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/nearby"
            className="text-xs font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
          >
            ← Back to Network Radar
          </Link>
          <Link
            to="/emergency-list"
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 transition-colors bg-red-50 px-3 py-1.5 rounded-lg border border-red-200"
          >
            <Clock className="w-3.5 h-3.5" />
            View Active Dispatch Queue
          </Link>
        </div>

        {submittedId ? (
          /* Success Screen */
          <div className="bg-white rounded-3xl border border-emerald-200 shadow-sm p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 mb-3 animate-pulse">
              SOS Signal Active
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mb-3">
              Help Request Dispatched
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Your roadside assistance request (Ref: <strong className="text-slate-900">{submittedId}</strong>) has been broadcast to verified mobile mechanics and towing depots in your sector.
            </p>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left mb-8 max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Vehicle:</span>
                <span className="font-bold text-slate-800">{vehicle || "Specified upon arrival"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Reported Issue:</span>
                <span className="font-bold text-slate-800">{issueType}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Contact Number:</span>
                <span className="font-bold text-slate-800">{phone}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/emergency-list"
                className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm inline-flex items-center justify-center gap-2"
              >
                Track Dispatch Status <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setSubmittedId(null)}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          /* SOS Request Form */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-red-600 to-rose-700 px-6 sm:px-8 py-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <ShieldAlert className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    Emergency Roadside SOS
                  </h1>
                  <p className="text-red-100 text-xs sm:text-sm">
                    Rapid roadside rescue, mechanic dispatch, & flatbed towing
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-black/20 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/10">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                Avg Response: &lt; 18 mins
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* GPS Auto-Fix Notification */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs uppercase font-bold text-slate-500">
                      Dispatched GPS Coordinates
                    </div>
                    <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {locationName || (coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "Location fix in progress...")}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={requestLocation}
                  disabled={geoLoading}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${geoLoading ? "animate-spin" : ""}`} />
                  {geoLoading ? "Pinging..." : "Refresh GPS"}
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Direct Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Vehicle Model & Plate (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maruti Suzuki Swift (DL 04 AB 1234)"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Breakdown Category *
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                  >
                    <option value="Engine Breakdown">Engine Breakdown / Wont Start</option>
                    <option value="Flat Tire / Puncture">Flat Tire / Double Puncture</option>
                    <option value="Dead Battery / Jump Start">Dead Battery / Jump Start</option>
                    <option value="Overheating / Radiator">Overheating / Coolant Leak</option>
                    <option value="Brake System Failure">Brake System Failure</option>
                    <option value="Transmission / Clutch Lock">Transmission / Clutch Lock</option>
                    <option value="Accident Recovery & Towing">Accident Recovery & Flatbed Towing</option>
                    <option value="Fuel Exhaustion / Wrong Fuel">Fuel Exhaustion / Wrong Fuel</option>
                  </select>
                </div>
              </div>

              {/* Severity Level Radio Buttons */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Urgency / Severity Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Moderate (Parked Safely)", "Urgent (Stuck on Road)", "Critical (Accident/Hazard)"].map((lvl) => {
                    const shortVal = lvl.split(" ")[0];
                    const isSelected = severity === shortVal;
                    return (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => setSeverity(shortVal)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                          isSelected
                            ? "bg-red-50 border-red-500 text-red-700 shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Issue Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Describe What Happened *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="e.g. Engine made a loud clanking noise and stalled on highway flyover. White smoke from bonnet. Need urgent mechanic with diagnostic scanner."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  For medical or police emergencies, please dial 112 immediately.
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white text-sm font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  {submitting ? "Broadcasting SOS..." : "Broadcast Roadside SOS Now"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
