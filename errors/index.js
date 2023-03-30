const BadRequestError = require("./bad-request");
const CustomAPIError = require("./custom-error");

const UNAutheticationError = require("./unauthetication");

const NotFoundRequestError = require("./not-found");

module.exports = {
    CustomAPIError,
    BadRequestError,
    UNAutheticationError,
    NotFoundRequestError
}