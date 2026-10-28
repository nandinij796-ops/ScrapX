import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Truck,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Filter,
  User,
  Wrench
} from "lucide-react";

// Initial seed emergency tickets for real testing & demonstration
const SEED_INCIDENTS = [
  {
    id: "sos-seed-1",
    name: "Vikram Malhotra",
    phone: "+91 98290 88219",
    vehicle: "Hyundai Creta 1.5 Diesel (RJ 14 CC 8921)",
    issueType: "Engine Breakdown",
    severity: "Urgent",
    description: "Check Engine lamp flashing red, vehicle lost acceleration on Western Express Ring Road. Safe on shoulder.",
    location: "Near Toll Plaza Km 24, Jaipur",
    latitude: 26.9124,
    longitude: 75.7873,
    status: "Pending",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "sos-seed-2",
    name: "Ananya Deshmukh",
    phone: "+91 98450 12890",
    vehicle: "Honda City V (MH 02 BG 4410)",
    issueType: "Dead Battery / Jump Start",
    severity: "Moderate",
    description: "Car won't crank after parking with hazard lights on. Need mobile battery jump-start unit.",
    location: "Tech Park Gateway 3, Malviya Nagar",
    latitude: 26.8500,
    longitude: 75.8000,
    status: "En Route",
    assignedMechanic: "Apex Precision Auto",
    createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
  }
];

export default function EmergencyList() {
  const { userData, isMechanic, isAdmin } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'Pending' | 'En Route' | 'Resolved'

  useEffect(() => {
    // 1. Load locally stored emergencies
    let localData = [];
    try {
      localData = JSON.parse(localStorage.getItem("scrapx_emergencies") || "[]");
    } catch (e) {
      /* ignore */
    }

    // Combine local + seed items
    const combinedInitial = [...localData, ...SEED_INCIDENTS];
    const uniqueMap = new Map();
    combinedInitial.forEach((item) => {
      if (item.id && !uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });

    // 2. Set up Firestore listener if accessible
    try {
      const q = query(collection(db, "emergency"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const cloudData = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));
          cloudData.forEach((item) => {
            uniqueMap.set(item.id, item);
          });
          setRequests(Array.from(uniqueMap.values()));
          setLoading(false);
        },
        (err) => {
          console.warn("Firestore emergency list notice (using local queue):", err.message);
          setRequests(Array.from(uniqueMap.values()));
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      setRequests(Array.from(uniqueMap.values()));
      setLoading(false);
    }
  }, []);

  const updateStatus = async (id, newStatus) => {
    // Update local state first
    setRequests((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              assignedMechanic: userData?.name || "Verified Mechanic",
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem("scrapx_emergencies") || "[]");
      const updated = existing.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              assignedMechanic: userData?.name || "Verified Mechanic",
              updatedAt: new Date().toISOString(),
            }
          : item
      );
      localStorage.setItem("scrapx_emergencies", JSON.stringify(updated));
    } catch (e) {
      /* ignore */
    }

    // Try Firestore update
    try {
      await updateDoc(doc(db, "emergency", id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
        assignedMechanic: userData?.name || "Verified Mechanic",
      });
    } catch (err) {
      console.warn("Firestore status update notice:", err.message);
    }

    toast.success(`Dispatch status changed to: ${newStatus}`);
  };

  const filteredRequests = requests.filter((item) => {
    if (statusFilter === "all") return true;
    return item.status === statusFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 mb-2">
                <ShieldAlert className="w-3.5 h-3.5" />
                Live Dispatch Control Hub
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Roadside Emergency <span className="text-red-600">Incident Queue</span>
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl">
                Real-time incident dispatch board for stranded motorists, service mechanics, and tow truck fleet managers.
              </p>
            </div>

            <Link
              to="/emergency"
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm inline-flex items-center justify-center gap-2 shrink-0"
            >
              <AlertTriangle className="w-4 h-4" />
              Broadcast SOS
            </Link>
          </div>

          {/* Filter Bar */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-bold text-slate-500">Filter Status:</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {["all", "Pending", "En Route", "Resolved"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === st
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st === "all" ? `All (${requests.length})` : st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            <Clock className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
            <p className="text-xs font-semibold">Connecting to live dispatch frequency...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No Active Emergencies in this Queue</h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              All roadside rescue incidents matching this filter are resolved. Mobile units are standing by.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((item) => {
              const isPending = item.status === "Pending";
              const isEnRoute = item.status === "En Route";
              const isResolved = item.status === "Resolved";

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 ${
                    isPending
                      ? "border-red-300 shadow-sm ring-1 ring-red-100"
                      : isEnRoute
                      ? "border-amber-300 bg-amber-50/20"
                      : "border-slate-200 opacity-90"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isPending
                              ? "bg-red-100 text-red-700 animate-pulse"
                              : isEnRoute
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-current"></span>
                          Status: {item.status}
                        </span>

                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                          {item.issueType}
                        </span>

                        {item.severity && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            Urgency: {item.severity}
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                        {item.vehicle || "Motorist Vehicle Breakdown"}
                      </h3>

                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {item.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {item.assignedMechanic && (
                          <span className="flex items-center gap-1 font-semibold text-emerald-700">
                            <Wrench className="w-3.5 h-3.5" />
                            Assigned: {item.assignedMechanic}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Call */}
                    {item.phone && (
                      <a
                        href={`tel:${item.phone}`}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors shrink-0"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call Motorist: {item.phone}
                      </a>
                    )}
                  </div>

                  {/* Incident Description */}
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 mb-4 text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">Incident Details: </strong>
                    {item.description}
                  </div>

                  {/* Location & Navigation */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {item.latitude && item.longitude && (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          GPS Route
                        </a>
                      )}

                      {/* Status Update Buttons */}
                      {isPending && (
                        <button
                          onClick={() => updateStatus(item.id, "En Route")}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold transition-colors shadow-xs"
                        >
                          Dispatch Mechanic
                        </button>
                      )}

                      {isEnRoute && (
                        <button
                          onClick={() => updateStatus(item.id, "Resolved")}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors shadow-xs"
                        >
                          Mark as Resolved
                        </button>
                      )}

                      {isResolved && (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
