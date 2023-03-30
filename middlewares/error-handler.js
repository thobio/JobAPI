const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "Something went wrong, Please Try Later!."
    }
    if (err.name === "CastError") {
        customError.message = `No item found with id ${err.value}`
        customError.statusCode = 404
    }
    if (err.name === "ValidationError") {
        customError.message = Object.values(err.errors).map((item) => item.message).join(",");
        customError.statusCode = 400
    }
    if (err.code && err.code === 11000) {
        customError.message = `Duplicate value for ${Object.keys(err.keyValue)} field, please choose a different value`;
        customError.statusCode = 400
    }
    return res
        .status(customError.statusCode)
        .send({ error: customError.message })
}
module.exports = errorHandlerMiddleware;