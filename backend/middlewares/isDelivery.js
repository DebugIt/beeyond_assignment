const jwt = require('jsonwebtoken');
const User = require("../models/User");
const Handler = require("../utils/handlers")
const statusCodes = require("../utils/statusCodes")
require("dotenv").config()

const isDelivery = async (req, res, next) => {
    try{
        const session = req.cookies.session
       
        if(!session){
            Handler(statusCodes.UNAUTHORIZED, false, "Unauthorized: No session token", res, null);
        }
        else{
            const extractDetails = jwt.verify(session, process.env.JWT_SECRET)
            console.log("Extracted Details for Delivery Partner: ", extractDetails)

            const findDeliveryPartner = await User.findOne({
                _id: extractDetails.userId,
                role: "delivery"
            })

            if(findDeliveryPartner){
                req.user = {
                    id: findDeliveryPartner._id,
                    name: findDeliveryPartner.name,
                    email: findDeliveryPartner.email,
                    role: "delivery",
                }
                next();
            }
            else{
                Handler(statusCodes.NOT_FOUND, false, "404: Delivery Partner not found", res, null);
            }
        }

    } catch (error) {
        console.error("isDelivery Middleware Error: ", error);
        Handler(statusCodes.INTERNAL_SERVER_ERROR, false, "Internal Server Error", res, null);
    }
}

module.exports = isDelivery