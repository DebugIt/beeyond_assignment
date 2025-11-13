const bcrypt = require("bcryptjs");

const validatePass = async (password, userPassword) => {
    const isvalid = await bcrypt.compare(password, userPassword);
    return isvalid;
}

module.exports = validatePass