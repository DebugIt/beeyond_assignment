let userSocket = {}

const initSocket = (io) => {
    io.on("connection", (socket) => {
        socket.on('register_user', (userid) => {
            userSocket[userid] = socket.id
            console.log("user added to socket: ", userid)
        })

        socket.on("order_accepted", (orderdata) => {
            io.emit("order_taken", orderdata)
        })

        socket.on("order_status_updated", (orderdata) => {
            const { customerid, order } = orderdata
            const customerSocketid = userSocket[customerid]
            if(customerSocketid){
                io.to(customerSocketid).emit("order_status_updated", order)
            }
        })

        socket.on("disconnect", () => {
            for(const [userid, sid] of Object.entries(userSocket)){
                if(sid === socket.id) delete userSocket[userid]
            }
        })
    })
}

const getUserSocketId = (userid) => userSocket[userid]

module.exports = {initSocket, getUserSocketId}