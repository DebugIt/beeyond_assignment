const jwt = require('jsonwebtoken');
const User = require("../models/User");
const Handler = require("../utils/handlers")
const statusCodes = require("../utils/statusCodes")
require("dotenv").config()

const isAdmin = async (req, res, next) => {
    try{
        const session = req.cookies.session
       
        if(!session){
            Handler(statusCodes.UNAUTHORIZED, false, "Unauthorized: No session token", res, null);
        }
        else{
            const extractDetails = jwt.verify(session, process.env.JWT_SECRET)
            console.log("Extracted Details for Admin: ", extractDetails)

            const findAdmin = await User.findOne({
                _id: extractDetails.userId,
                role: "admin"
            })

            if(findAdmin){
                req.user = {
                    id: findAdmin._id,
                    name: findAdmin.name,
                    email: findAdmin.email,
                    role: "admin",
                }
                next();
            }
            else{
                Handler(statusCodes.NOT_FOUND, false, "404: Admin not found", res, null);
            }
        }

    } catch (error) {
        console.error("isAdmin Middleware Error: ", error);
        Handler(statusCodes.INTERNAL_SERVER_ERROR, false, "Internal Server Error", res, null);
    }
}

module.exports = isAdmin