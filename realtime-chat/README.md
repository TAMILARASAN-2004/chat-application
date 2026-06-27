# Real-Time Chat App

A full-stack real-time chat application built with **React + Vite** (frontend) and **Node.js + Socket.IO** (backend).

## Project Structure

```
realtime-chat/
├── client/                  # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── App.jsx          # Main component
│   │   ├── App.css          # Styles
│   │   ├── main.jsx         # React entry point
│   │   └── socket.js        # Socket.IO singleton
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                  # Node.js backend
│   ├── server.js            # Express + Socket.IO server
│   └── package.json
│
└── README.md
```

## Features

- Real-time messaging with Socket.IO
- Join/leave notifications (system messages)
- Live online users sidebar
- Message timestamps
- Your messages appear on the right (blue), others on the left
- Auto-scroll to latest message
- Send message with Enter key

## Getting Started

### 1. Start the Server

```bash
cd server
npm install
npm start          # or: npm run dev  (uses nodemon for auto-reload)
```

Server runs at: `http://localhost:5000`

### 2. Start the Client

Open a **new terminal**:

```bash
cd client
npm install
npm run dev
```

Client runs at: `http://localhost:5173`

### 3. Test It

Open `http://localhost:5173` in **two browser tabs**, enter different usernames, and start chatting!
