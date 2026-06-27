const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

// Allow requests from the Vite dev server
app.use(cors({ origin: "http://localhost:5173" }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Track online users: socketId → username
const onlineUsers = {};

io.on("connection", (socket) => {
  console.log(`[+] User connected: ${socket.id}`);

  // Register username on join
  socket.on("user_join", (username) => {
    onlineUsers[socket.id] = username;
    console.log(`[+] ${username} joined the chat`);

    // Notify everyone about the new user
    io.emit("user_joined", {
      name: username,
      message: `${username} has joined the chat.`,
      type: "system",
      timestamp: new Date().toISOString(),
    });

    // Send updated user list to all clients
    io.emit("update_users", Object.values(onlineUsers));
  });

  // Broadcast chat messages
  socket.on("send_message", (data) => {
    io.emit("receive_message", {
      name: data.name,
      message: data.message,
      type: "chat",
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    const username = onlineUsers[socket.id];
    if (username) {
      delete onlineUsers[socket.id];
      console.log(`[-] ${username} disconnected`);

      io.emit("user_left", {
        name: username,
        message: `${username} has left the chat.`,
        type: "system",
        timestamp: new Date().toISOString(),
      });

      io.emit("update_users", Object.values(onlineUsers));
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
