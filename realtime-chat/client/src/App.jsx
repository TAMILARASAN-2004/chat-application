import { useState, useEffect, useRef } from "react";
import socket from "./socket";

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [joined, setJoined] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    // Incoming chat or system messages
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    socket.on("user_joined", (data) => {
      setChat((prev) => [...prev, data]);
    });

    socket.on("user_left", (data) => {
      setChat((prev) => [...prev, data]);
    });

    // Online user list updates
    socket.on("update_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_joined");
      socket.off("user_left");
      socket.off("update_users");
    };
  }, []);

  const handleJoin = () => {
    if (name.trim() === "") return;
    socket.connect();
    socket.emit("user_join", name.trim());
    setJoined(true);
  };

  const sendMessage = () => {
    if (message.trim() === "") return;
    socket.emit("send_message", { name, message: message.trim() });
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const formatTime = (iso) => {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!joined) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <div className="login-icon">💬</div>
          <h1>Real-Time Chat</h1>
          <p className="login-subtitle">Enter a username to join the room</p>
          <input
            className="text-input"
            placeholder="Your username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            autoFocus
          />
          <button className="btn-primary" onClick={handleJoin}>
            Join Chat
          </button>
        </div>
      </div>
    );
  }

  // ── Chat screen ───────────────────────────────────────────────────────────
  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3 className="sidebar-title">Online</h3>
        <ul className="user-list">
          {onlineUsers.map((user, i) => (
            <li key={i} className="user-item">
              <span className="online-dot" />
              {user}
              {user === name && <span className="you-label"> (you)</span>}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main chat area */}
      <main className="chat-main">
        <header className="chat-header">
          <span>💬 Chat Room</span>
          <span className="header-user">Logged in as <b>{name}</b></span>
        </header>

        <div className="messages">
          {chat.map((msg, i) =>
            msg.type === "system" ? (
              <div key={i} className="msg-system">
                {msg.message}
              </div>
            ) : (
              <div
                key={i}
                className={`msg-bubble ${msg.name === name ? "msg-mine" : "msg-theirs"}`}
              >
                {msg.name !== name && (
                  <span className="msg-author">{msg.name}</span>
                )}
                <p className="msg-text">{msg.message}</p>
                <span className="msg-time">{formatTime(msg.timestamp)}</span>
              </div>
            )
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-bar">
          <input
            className="text-input"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button className="btn-primary" onClick={sendMessage}>
            Send
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
