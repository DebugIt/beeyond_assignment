import { io } from "socket.io-client"

const SOCKET_URL = process.env.NODE_ENV === "production"
? process.env.NEXT_PUBLIC_SOCKET_URL
: "http://192.168.0.105:5555"

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"]
});

export default socket