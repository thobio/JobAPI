const User = require('../models/User')
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, UNAutheticationError, CustomAPIError } = require("../errors")


const register = async (req, res) => {
    const { email } = req.body;
    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json
        ({ message: "success", user_name: user.name, token: token })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError("Please provide a valid email address and password")
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new UNAutheticationError("Invalid credentials")
    }
    const isPasswordCorrect = await user.comparePasswords(password)
    if (!isPasswordCorrect) {
        throw new UNAutheticationError("Invalid credentials")
    }
    const token = user.createJWT()
}

module.exports = {
    login,
    register,
}