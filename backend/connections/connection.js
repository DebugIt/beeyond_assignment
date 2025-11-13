const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("DB connected successfully")
}).catch((err) => {
    console.log("connection error:", err)
})