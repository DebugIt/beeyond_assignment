const jwt = require('jsonwebtoken');
const User = require("../models/User");
const Handler = require("../utils/handlers")
const statusCodes = require("../utils/statusCodes")
require("dotenv").config()

const isCustomer = async (req, res, next) => {
    try{
        const session = req.cookies.session
       
        if(!session){
            Handler(statusCodes.UNAUTHORIZED, false, "Unauthorized: No session token", res, null);
        }
        else{
            const extractDetails = jwt.verify(session, process.env.JWT_SECRET)
            console.log("Extracted Details for Customer: ", extractDetails)

            const findCustomer = await User.findOne({
                _id: extractDetails.userId,
                role: "customer"
            })

            if(findCustomer){
                req.user = {
                    id: findCustomer._id,
                    name: findCustomer.name,
                    email: findCustomer.email,
                    role: "customer",
                }
                next();
            }
            else{
                Handler(statusCodes.NOT_FOUND, false, "404: Customer not found", res, null);
            }
        }

    } catch (error) {
        console.error("isCustomer Middleware Error: ", error);
        Handler(statusCodes.INTERNAL_SERVER_ERROR, false, "Internal Server Error", res, null);
    }
}

module.exports = isCustomer