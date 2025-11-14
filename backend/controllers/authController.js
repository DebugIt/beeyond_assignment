const User = require("../models/User");
const Handler = require("../utils/handlers");
const statusCodes = require("../utils/statusCodes");
const encryptPass = require("../utils/encryptPass")
const validatePass = require("../utils/validatePass")
const genToken = require("../utils/genToken")

const isProduction = process.env.NODE_ENV === "production"

//  Common:
    // - login 
    // - register

module.exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role = "customer" } = req.body
        if(!name || !email || !password ){
            return Handler(statusCodes.BAD_REQUEST, false, 'All fields required', res, null) 
        }
        
        const findUser = await User.findOne({ email })
        if(findUser){
            return Handler(statusCodes.BAD_REQUEST, false, 'User Already exists', res, null) 
        }
        
        const encryptedPass = await encryptPass(password)
        const newUser = await new User({
            name,
            email,
            password: encryptedPass,
            role
        }).save()

        if(newUser){
            return Handler(statusCodes.CREATED, true, 'User Registered', res, null) 
        }
        else{
            return Handler(statusCodes.BAD_REQUEST, false, 'Error registring user', res, null) 
        }

    } catch (error) {
        console.error("Error in Register: ", error)
        return Handler(statusCodes.INTERNAL_SERVER_ERROR, false, 'Internal Server Error', res, null) 
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const checkifExists = await User.findOne({email})

        if(!checkifExists){
            return Handler(statusCodes.NOT_FOUND, false, 'User Not Found', res, null) 
        }

        const isValidPass = await validatePass(password, checkifExists?.password)
        if(isValidPass){
            const getToken = await genToken(checkifExists?._id)
            if(getToken){
                checkifExists.password = undefined
                res.cookie('session', getToken, {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                res.status(200).json({
                    status: statusCodes.SUCCESS,
                    message: "Login Successful"
                })

            }
        }


    } catch (error) {
        console.error("Error in Login: ", error)
        return Handler(statusCodes.INTERNAL_SERVER_ERROR, false, 'Internal Server Error', res, null) 
    }
}

module.exports.getdetails = async (req, res, next) => {
    try {
        const id = req.user.id
        const findDetails = await User.findById(id).select("-__v -password")
        if(!findDetails){
            return Handler(statusCodes.NOT_FOUND, false, 'No Details found', res, null) 
        }
        else{
            return Handler(statusCodes.SUCCESS, true, 'Details fetched', res, findDetails) 
        }

    } catch (error) {
        console.error("Error in Login: ", error)
        return Handler(statusCodes.INTERNAL_SERVER_ERROR, false, 'Internal Server Error', res, null) 
    }
}