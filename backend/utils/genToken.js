const jwt = require('jsonwebtoken');

const genToken = async (userId = null) => {
    try {
        const token = await jwt.sign({
            userId
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return token;
    } catch (error) {
        return null
    }
}

module.exports = genToken;