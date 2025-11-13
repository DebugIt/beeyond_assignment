const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        min: [5, "Password must be of min. length 5 "],
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'delivery'],
        default: 'customer'
    }
}, {timestamps: true})

const User = mongoose.model("User", userSchema)
module.exports = User