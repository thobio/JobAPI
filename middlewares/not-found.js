const { StatusCodes } = require("http-status-codes");
const notFound = (req, res) => res.statusCode(StatusCodes.NOT_FOUND).send('Route not found')

module.exports = notFound;