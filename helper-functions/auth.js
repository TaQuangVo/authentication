const crypto = require("crypto")



const generateHashPwd = (password) => {

    const salt = crypto.randomBytes(32).toString("hex")

    const hashedPwd = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex")

    return {salt, hashedPwd}
}

const validatePassword = (password, hashedPwd, salt) => {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex") == hashedPwd
}


module.exports = {generateHashPwd, validatePassword}