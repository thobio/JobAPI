const mongoose = require('mongoose');
const bycrpt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please provide a name"],
        minLength: 3,
        maxLength: 50,

    },
    email: {
        type: String,
        require: [true, "Please provide a email address"],
        minLength: 3,
        maxLength: 50,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g],
        unique: true,
    },
    password: {
        type: String,
        require: [true, "Please provide a password"],
        minLength: 6,
    },
})

UserSchema.pre('save', async function () {
    const salt = await bycrpt.genSalt(10)
    this.password = await bycrpt.hash(this.password, salt)
});

UserSchema.methods.createJWT = function () {
    return jwt.sign({ userID: this._id, name: this.name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
}

UserSchema.methods.comparePasswords = async function (cantitatePasswords) {
    const isMatch = await bycrpt.compare(cantitatePasswords, this.password)
    return isMatch
}

module.exports = mongoose.model("User", UserSchema);