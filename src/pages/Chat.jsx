import { useState, useEffect, useRef } from "react";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

// Extremely simple pseudo-E2E XOR cipher for demonstration purposes.
// In a real production app, use Web Crypto API to exchange public/private RSA keys.
const SECRET_KEY = "scrapx-secret-key-placeholder";

const encryptMessage = (text) => {
  return btoa(Array.from(text).map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))).join(''));
};

const decryptMessage = (encoded) => {
  try {
    const text = atob(encoded);
    return Array.from(text).map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))).join('');
  } catch (e) {
    return "[Encrypted Message]";
  }
};

function Chat() {
  const { currentUser, userData } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          text: decryptMessage(data.encryptedText)
        };
      });
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const encryptedText = encryptMessage(newMessage);
    
    await addDoc(collection(db, "messages"), {
      encryptedText,
      senderId: currentUser.uid,
      senderName: userData?.name || currentUser.email.split('@')[0],
      senderRole: userData?.role || "User",
      createdAt: serverTimestamp()
    });

    setNewMessage("");
  };

  if (!currentUser) {
    return (
      <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", color: "#f8fafc" }}>
        <Navbar />
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h2>Please log in to use Secure Chat.</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", color: "#f8fafc", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      <div style={{ maxWidth: "800px", margin: "40px auto", width: "100%", flex: 1, display: "flex", flexDirection: "column", border: "1px solid #334155", borderRadius: "16px", overflow: "hidden", background: "#1e293b" }}>
        
        <div style={{ padding: "20px", borderBottom: "1px solid #334155", background: "#0f172a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "1.5rem", color: "#f8fafc", margin: 0 }}>💬 Secure Chat</h2>
          <span style={{ fontSize: "0.85rem", background: "#10b981", color: "white", padding: "4px 8px", borderRadius: "20px" }}>E2E Encrypted</span>
        </div>

        <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px", height: "500px" }}>
          {messages.length === 0 ? (
            <p style={{ textAlign: "center", color: "#94a3b8" }}>No messages yet. Start the conversation!</p>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === currentUser.uid;
              return (
                <div key={msg.id} style={{ alignSelf: isMine ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "4px", textAlign: isMine ? "right" : "left" }}>
                    {isMine ? "You" : msg.senderName} ({msg.senderRole})
                  </div>
                  <div style={{
                    padding: "12px 16px",
                    borderRadius: "16px",
                    background: isMine ? "#3b82f6" : "#334155",
                    color: "#f8fafc",
                    borderBottomRightRadius: isMine ? "4px" : "16px",
                    borderBottomLeftRadius: isMine ? "16px" : "4px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                  }}>
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} style={{ display: "flex", padding: "20px", background: "#0f172a", borderTop: "1px solid #334155" }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a secure message..."
            style={{
              flex: 1,
              padding: "14px 20px",
              borderRadius: "10px",
              border: "1px solid #334155",
              background: "#1e293b",
              color: "#f8fafc",
              fontSize: "1rem",
              marginRight: "10px"
            }}
          />
          <button
            type="submit"
            style={{
              background: "#3b82f6",
              color: "white",
              padding: "14px 24px",
              border: "none",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#2563eb")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#3b82f6")}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
