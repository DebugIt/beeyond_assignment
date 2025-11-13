const bcrypt = require('bcryptjs')

const encryptPass = async (password) => {
    const encrypted = await bcrypt.hashSync(password, 10)
    return encrypted
}

module.exports = encryptPass