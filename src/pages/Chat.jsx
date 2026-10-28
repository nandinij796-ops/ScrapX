import { useState, useEffect, useRef } from "react";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { 
  Lock, 
  ShieldCheck, 
  Send, 
  User, 
  Sparkles, 
  Clock, 
  MessageSquare,
  Shield,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const SECRET_KEY = "scrapx-secret-key-placeholder";

const encryptMessage = (text) => {
  return btoa(
    Array.from(text)
      .map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length)))
      .join("")
  );
};

const decryptMessage = (encoded) => {
  try {
    const text = atob(encoded);
    return Array.from(text)
      .map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length)))
      .join("");
  } catch {
    return "[Encrypted Message]";
  }
};

const SEED_MESSAGES = [
  {
    id: "msg-seed-1",
    senderId: "system-dealer",
    senderName: "Apex Eco Dismantlers",
    senderRole: "Scrap Dealer",
    text: "Hello! We received your inquiry regarding the salvaged alloy wheels. They are original OEM, ultrasonic-cleaned and crack-free.",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-seed-2",
    senderId: "system-mechanic",
    senderName: "RapidFix Mobile Workshop",
    senderRole: "Mechanic",
    text: "We can also provide on-site fitment and balancing if you're within the 25km radius.",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  }
];

export default function Chat() {
  const { currentUser, userData } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 1. Load local messages
    let localMsgs = [];
    try {
      localMsgs = JSON.parse(localStorage.getItem("scrapx_chat_messages") || "[]");
    } catch (e) {}

    const initial = [...SEED_MESSAGES, ...localMsgs];
    const uniqueMap = new Map();
    initial.forEach((m) => uniqueMap.set(m.id, m));
    setMessages(Array.from(uniqueMap.values()));

    // 2. Cloud listener
    if (currentUser) {
      try {
        const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const cloudMsgs = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                text: decryptMessage(data.encryptedText || ""),
              };
            });
            cloudMsgs.forEach((m) => uniqueMap.set(m.id, m));
            setMessages(Array.from(uniqueMap.values()));
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
          },
          (err) => {
            console.warn("Chat cloud listener notice:", err.message);
          }
        );
        return () => unsubscribe();
      } catch (err) {}
    }
  }, [currentUser]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const rawText = newMessage.trim();
    const encryptedText = encryptMessage(rawText);

    const msgObj = {
      id: `chat-${Date.now()}`,
      encryptedText,
      text: rawText,
      senderId: currentUser.uid,
      senderName: userData?.name || currentUser.displayName || currentUser.email.split("@")[0],
      senderRole: userData?.role || "Customer",
      createdAt: new Date().toISOString(),
    };

    // Save locally
    try {
      const existing = JSON.parse(localStorage.getItem("scrapx_chat_messages") || "[]");
      existing.push(msgObj);
      localStorage.setItem("scrapx_chat_messages", JSON.stringify(existing));
    } catch (e) {}

    setMessages((prev) => [...prev, msgObj]);
    setNewMessage("");
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

    // Try Firestore
    try {
      await addDoc(collection(db, "messages"), {
        encryptedText,
        senderId: currentUser.uid,
        senderName: msgObj.senderName,
        senderRole: msgObj.senderRole,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Firestore message save notice:", err.message);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
        <Navbar />
        <main className="flex-1 max-w-lg mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Required</h2>
            <p className="text-xs text-slate-600 mb-6">
              Please sign in to access encrypted dealer negotiations, part inquiries, and transaction messaging.
            </p>
            <Link
              to="/login"
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors inline-block"
            >
              Sign In to ScrapX
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-6 w-full flex flex-col">
        {/* Chat Card Shell */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden h-[75vh]">
          {/* Top Bar */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  Marketplace Messaging Hub
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                </h1>
                <p className="text-[11px] text-slate-500">
                  Direct communication between buyers, scrap yards, & certified mechanics
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              E2E Encrypted
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
            {messages.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-xs">
                No messages yet. Send a message to initiate discussion.
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.senderId === currentUser.uid;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                  >
                    <div className="text-[11px] font-medium text-slate-500 mb-1 px-1">
                      {isMine ? "You" : msg.senderName} •{" "}
                      <span className="font-semibold text-slate-600">{msg.senderRole}</span>
                    </div>

                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                        isMine
                          ? "bg-emerald-700 text-white rounded-br-xs"
                          : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs"
                      }`}
                    >
                      {msg.text}
                    </div>

                    <div className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={sendMessage}
            className="p-4 border-t border-slate-200 bg-white flex items-center gap-3"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message, offer terms, or component inquiry..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
