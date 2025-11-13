const Handler = async ( status, success, message, res, data ) => {
    return res.status(status).json({
        status,
        success,
        message,
        data
    })
}

module.exports = Handler