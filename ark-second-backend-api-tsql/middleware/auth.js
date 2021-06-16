const jwt = require("jsonwebtoken");
const log4js = require("log4js");

///////////////////////////////////////////////////

const HttpError = require("../models/http-error");

///////////////////////////////////////////////////

log4js.configure({
  appenders: { error: { type: "file", filename: "./logs/error.log" } },
  categories: { default: { appenders: ["error"], level: process.env.LOG_LEVEL } },
});
const logger = log4js.getLogger("error");

///////////////////////////////////////////////////

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed");
    }

    const decodedToken = jwt.verify(token, process.env.EN_KEY);
    req.userData = {
      user: decodedToken.user,
      firstname: decodedToken.firstname,
      lastName: decodedToken.lastName,
      email: decodedToken.email,
    };
    next();
  } catch (err) {
    logger.error("Error in authentication");
    logger.error(err.message);
    return next(new HttpError("Authentication failed", 401));
  }
};
