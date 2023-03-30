
const jwt = require("jsonwebtoken");
const { UNAutheticationError } = require("../errors/index");

const authenticationMiddeleware = async (req, res, next) => {
    const authorization = req.headers.authorization
    if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new UNAutheticationError("Unable to authticate the token")//CustomAPIError();
    }
    const token = authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded);
        const { userID, name } = decoded
        req.user = { userID, name }
        next()
    } catch (error) {
        throw new UNAutheticationError("Not authorized to access this route ")
    }

}
module.exports = { authenticationMiddeleware }