const express = require('express')
const app = express()
const cors = require("cors")
require("dotenv").config()
const { Server } = require("socket.io")
const http = require("http")
const cookieParser = require("cookie-parser")
const PORT = process.env.PORT || 5555
const { initSocket } = require("./socket")

process.env.TZ = "Asia/Kolkata"

const Handler = require("./utils/handlers")
const statusCodes = require("./utils/statusCodes")

const server = http.createServer(app)
const socketio = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://app.apaarrethnic.com'],
        credentials: true
    }
})

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

app.use(cors({
    origin: ['http://localhost:3000', "http://app.apaarrethnic.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}))

app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
    req.io = socketio
    next()
})

require("./connections/connection")

// routes
const userRouter = require("./routes/user")
app.use("/api/user", userRouter)

// health route
app.get("/health", async (req, res) => {
    Handler(statusCodes.SUCCESS, true, 'OK', res, null) 
})

initSocket(socketio)


app.get("/", (req, res) => {
    Handler(statusCodes.SUCCESS, true, 'Hello From Server', res, null) 
})


server.listen(PORT, () => {
    console.log("Server Up and Running")
})