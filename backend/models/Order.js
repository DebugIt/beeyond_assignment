const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    items: [
        {
            productid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            qty: {
                type: Number,
                defualt: 1
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    status: {
        type: String,
        default: "created",
        enum: ["created", "accepted", "rejected", "in-the-kitchen", "out-for-delivery", "delivered"]
    }
}, {timestamps: true})

const Order = mongoose.model("Order", orderSchema)
module.exports = Order