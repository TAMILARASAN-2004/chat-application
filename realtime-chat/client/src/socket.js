import { io } from "socket.io-client";

// Create a single socket instance shared across the whole app
const socket = io("http://localhost:5000", {
  autoConnect: false, // We connect manually after the user enters a name
});

export default socket;
