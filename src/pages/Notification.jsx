import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  collection,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  getReceivedOffers, 
  getSentOffers, 
  updateOfferStatus 
} from "../services/orderService";
import { 
  Bell, 
  Inbox, 
  Send, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  MessageSquare, 
  Clock, 
  Tag, 
  Package,
  Sparkles,
  ShieldCheck,
  Check,
  X
} from "lucide-react";

export default function Notifications() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("received"); // 'received' | 'sent' | 'partRequests'

  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [partRequests, setPartRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Live listener / repository fetch for Received Buy Requests (As Seller)
  useEffect(() => {
    const currentUid = auth.currentUser?.uid || "current-user";

    // First load from orderService (handles local storage + fallback seed)
    orderServiceFetch(currentUid);

    // If Firebase Auth is authenticated, also listen to Firestore
    if (auth.currentUser) {
      try {
        const q = query(
          collection(db, "buyRequests"),
          where("sellerId", "==", auth.currentUser.uid)
        );

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const data = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            }));
            if (data.length > 0) {
              setReceivedRequests(data);
            }
            setLoading(false);
          },
          (err) => {
            console.warn("Received requests cloud listener notice:", err.message);
            setLoading(false);
          }
        );
        return () => unsubscribe();
      } catch (e) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const orderServiceFetch = async (uid) => {
    try {
      const received = await getReceivedOffers(uid);
      setReceivedRequests(received);
      const sent = await getSentOffers(uid);
      setSentRequests(sent);
    } catch (e) {
      console.warn("Order service fetch notice:", e.message);
    }
  };

  // 2. Sent Buy Requests (As Buyer)
  useEffect(() => {
    if (!auth.currentUser) return;

    try {
      const q = query(
        collection(db, "buyRequests"),
        where("buyerId", "==", auth.currentUser.uid)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));
          if (data.length > 0) {
            setSentRequests(data);
          }
        },
        (err) => {
          console.warn("Sent requests cloud listener notice:", err.message);
        }
      );

      return () => unsubscribe();
    } catch (e) {
      /* ignore */
    }
  }, []);

  // 3. Part Sourcing Board
  useEffect(() => {
    // Check local part requests fallback
    let localParts = [];
    try {
      localParts = JSON.parse(localStorage.getItem("scrapx_part_requests") || "[]");
    } catch (e) {}

    // Initial default items for demonstration
    const fallbackParts = [
      {
        id: "part-req-1",
        partName: "Hyundai i20 (2018) Left Headlamp Assembly",
        vehicleMakeModel: "Hyundai Elite i20",
        year: "2018",
        urgency: "Immediate",
        budget: "4500",
        notes: "OEM projector headlight assembly with undamaged mounting tabs. Clear lens preferred.",
        buyerName: "Karan Patel",
        buyerPhone: "+91 98200 12345",
        status: "Open",
      },
      {
        id: "part-req-2",
        partName: "Honda City 4th Gen Power Steering Rack",
        vehicleMakeModel: "Honda City ZX Petrol",
        year: "2016",
        urgency: "Within 3 Days",
        budget: "8500",
        notes: "Electronic power steering rack and pinion in leak-free tested condition.",
        buyerName: "Rajeev Singhania",
        buyerPhone: "+91 98711 54321",
        status: "Open",
      }
    ];

    setPartRequests([...localParts, ...fallbackParts]);

    try {
      const q = query(collection(db, "partRequests"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const cloudParts = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));
          if (cloudParts.length > 0) {
            setPartRequests(cloudParts);
          }
        },
        (err) => {
          console.warn("Part requests cloud notice:", err.message);
        }
      );

      return () => unsubscribe();
    } catch (e) {}
  }, []);

  // Seller updates request status
  const handleUpdateStatus = async (request, newStatus) => {
    try {
      // 1. Update via orderService (local storage resilient)
      await updateOfferStatus(request.id, newStatus);

      // Update state immediately
      setReceivedRequests((prev) =>
        prev.map((r) => (r.id === request.id ? { ...r, status: newStatus } : r))
      );

      // 2. Try Cloud Firestore update
      try {
        await updateDoc(doc(db, "buyRequests", request.id), {
          status: newStatus,
          updatedAt: serverTimestamp(),
        });

        if (newStatus === "Completed" && request.scrapId) {
          try {
            await updateDoc(doc(db, "scraps", request.scrapId), {
              status: "Sold",
              updatedAt: serverTimestamp(),
            });
          } catch (e) {}
        }
      } catch (cloudErr) {
        console.warn("Firestore update notice:", cloudErr.message);
      }

      toast.success(`Purchase offer marked as ${newStatus} ✅`);
    } catch (err) {
      toast.error(err.message || "Failed to update status.");
    }
  };

  // Buyer cancels pending request
  const cancelRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to cancel this purchase request?")) return;

    setSentRequests((prev) => prev.filter((r) => r.id !== requestId));
    try {
      await deleteDoc(doc(db, "buyRequests", requestId));
      toast.success("Purchase request retracted.");
    } catch (err) {
      toast.success("Purchase request retracted from queue.");
    }
  };

  // Close part request when fulfilled
  const closePartRequest = async (reqId) => {
    setPartRequests((prev) =>
      prev.map((p) => (p.id === reqId ? { ...p, status: "Fulfilled" } : p))
    );
    try {
      await updateDoc(doc(db, "partRequests", reqId), {
        status: "Fulfilled",
        updatedAt: serverTimestamp(),
      });
      toast.success("Inquiry closed as Fulfilled.");
    } catch (err) {
      toast.success("Inquiry closed as Fulfilled.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                <Bell className="w-3.5 h-3.5" />
                Transaction Center
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Marketplace Activity & <span className="text-[#15803D]">Negotiations</span>
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl">
                Review counter-offers on your listed components, manage your purchase requests, and participate in open part inquiries.
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab("received")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "received"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Inbox className="w-4 h-4" />
              Received Offers ({receivedRequests.length})
            </button>

            <button
              onClick={() => setActiveTab("sent")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "sent"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Send className="w-4 h-4" />
              My Buy Requests ({sentRequests.length})
            </button>

            <button
              onClick={() => setActiveTab("partRequests")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "partRequests"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Search className="w-4 h-4" />
              Part Sourcing Board ({partRequests.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Received Offers */}
        {activeTab === "received" && (
          <div>
            {loading ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                <Clock className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
                <p className="text-xs font-semibold">Synchronizing negotiations...</p>
              </div>
            ) : receivedRequests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">No Incoming Purchase Offers</h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto mb-4">
                  When motorists submit buy offers on your listed parts, they will immediately appear here.
                </p>
                <Link
                  to="/add"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors inline-block"
                >
                  List Another Component
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {receivedRequests.map((req) => {
                  const isPending = req.status === "Pending";
                  const isAccepted = req.status === "Accepted";
                  const isRejected = req.status === "Rejected";
                  const isCompleted = req.status === "Completed";

                  return (
                    <div
                      key={req.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 transition-all hover:border-slate-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-4">
                          {req.scrapImage && (
                            <img
                              src={req.scrapImage}
                              alt={req.scrapName}
                              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          )}
                          <div>
                            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-1">
                              {req.scrapName}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <span>Offered Bid:</span>
                              <strong className="text-sm font-extrabold text-emerald-700">₹{Number(req.offeredPrice || 0).toLocaleString()}</strong>
                              {req.originalPrice && (
                                <span className="text-slate-400 line-through text-[11px]">
                                  (Listed: ₹{Number(req.originalPrice).toLocaleString()})
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Fulfillment: <span className="font-semibold text-slate-700">{req.deliveryType || "Pickup / Standard Delivery"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 self-start ${
                            isAccepted
                              ? "bg-emerald-100 text-emerald-800"
                              : isRejected
                              ? "bg-red-100 text-red-800"
                              : isCompleted
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          Status: {req.status}
                        </span>
                      </div>

                      {/* Buyer Details & Note */}
                      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 mb-4 text-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <span className="text-slate-700">
                            <strong>Buyer: </strong> {req.buyerName || "Registered Customer"} ({req.buyerEmail || "Verified"})
                          </span>
                          {req.buyerPhone && (
                            <a
                              href={`tel:${req.buyerPhone}`}
                              className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                            >
                              <Phone className="w-3.5 h-3.5" /> {req.buyerPhone}
                            </a>
                          )}
                        </div>
                        {req.note && (
                          <div className="text-slate-500 italic bg-white p-2.5 rounded-lg border border-slate-200">
                            "{req.note}"
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 flex-wrap gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(req, "Accepted")}
                                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5" /> Accept Offer
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(req, "Rejected")}
                                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                              >
                                <X className="w-3.5 h-3.5" /> Decline
                              </button>
                            </>
                          )}

                          {isAccepted && (
                            <button
                              onClick={() => handleUpdateStatus(req, "Completed")}
                              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Mark Sold & Completed
                            </button>
                          )}
                        </div>

                        <Link
                          to="/chat"
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                          Chat with Buyer
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Sent Buy Requests */}
        {activeTab === "sent" && (
          <div>
            {sentRequests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Send className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">No Sent Offers</h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto mb-4">
                  Browse scrap listings and submit purchase offers directly to verified vehicle dismantlers.
                </p>
                <Link
                  to="/scraps"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors inline-block"
                >
                  Browse Auto Parts
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {sentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-4">
                        {req.scrapImage && (
                          <img
                            src={req.scrapImage}
                            alt={req.scrapName}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                        )}
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-1">
                            {req.scrapName}
                          </h3>
                          <div className="text-xs text-slate-600">
                            Your Offer: <strong className="text-sm font-extrabold text-emerald-700">₹{Number(req.offeredPrice || 0).toLocaleString()}</strong>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Seller: {req.sellerName || req.sellerEmail || "Verified Yard"}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 self-start ${
                          req.status === "Accepted"
                            ? "bg-emerald-100 text-emerald-800"
                            : req.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        Status: {req.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      {req.status === "Pending" ? (
                        <button
                          onClick={() => cancelRequest(req.id)}
                          className="px-3 py-1.5 text-red-600 border border-red-200 hover:bg-red-50 rounded-lg font-bold transition-colors"
                        >
                          Withdraw Offer
                        </button>
                      ) : (
                        <span className="text-slate-400">Offer processed</span>
                      )}

                      <Link
                        to="/chat"
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                        Message Seller
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Part Sourcing Board */}
        {activeTab === "partRequests" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">
                Community Part Wanted Inquiries ({partRequests.length})
              </h2>
              <span className="text-xs text-slate-500">Live requests from vehicle owners</span>
            </div>

            {partRequests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">No Open Part Requests</h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  All community requests are currently satisfied.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partRequests.map((pr) => {
                  const isFulfilled = pr.status === "Fulfilled";

                  return (
                    <div
                      key={pr.id}
                      className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                        isFulfilled ? "border-slate-200 opacity-70" : "border-slate-200 hover:border-emerald-300 shadow-xs"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                            {pr.partName}
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                              pr.urgency === "Immediate"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {pr.urgency || "Standard"}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-emerald-700 mb-2">
                          For: {pr.vehicleMakeModel} {pr.year && `(${pr.year})`}
                        </div>

                        {pr.budget && (
                          <div className="text-xs font-bold text-slate-900 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-3 inline-block">
                            Willing to pay: <span className="text-emerald-700">₹{Number(pr.budget).toLocaleString()}</span>
                          </div>
                        )}

                        {pr.notes && (
                          <p className="text-xs text-slate-600 line-clamp-2 italic mb-4">
                            "{pr.notes}"
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">By {pr.buyerName}</span>

                        <div className="flex items-center gap-2">
                          {!isFulfilled && (
                            <button
                              onClick={() => closePartRequest(pr.id)}
                              className="px-2.5 py-1 text-emerald-700 hover:bg-emerald-50 rounded-lg font-bold transition-colors"
                            >
                              Mark Fulfilled
                            </button>
                          )}

                          {pr.buyerPhone && (
                            <a
                              href={`tel:${pr.buyerPhone}`}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <Phone className="w-3 h-3" /> Call
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
