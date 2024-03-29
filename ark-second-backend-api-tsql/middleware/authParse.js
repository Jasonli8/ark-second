const jwt = require("jsonwebtoken");

///////////////////////////////////////////////////

const HttpError = require("../components/models/http-error");
const { loggerError, loggerInfo } = require("../components/helpers/logger");
const auth = require("../components/helpers/auth");

///////////////////////////////////////////////////

module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const authData = req.headers.authorization.split(" ");
    if (!authData[1]) {
      throw new Error("Authentication failed");
    }
    if (authData[0] === "Basic") {
      const base64Cred = authData[1];
      const credentials = Buffer.from(base64Cred, "base64").toString(
        "ascii"
      );
      const [username, password] = credentials.split(":");
      const user = await auth( username, password );
      if (!user) {
        throw new Error("Authentication failed");
      }

      req.userData = {
        user: user.user,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      };

      next();
    } else if (authData[0] === "Bearer") {
      const decodedToken = jwt.verify(authData[1], process.env.EN_KEY);
      req.userData = {
        user: decodedToken.user,
        firstname: decodedToken.firstname,
        lastName: decodedToken.lastName,
        email: decodedToken.email,
      };
      next();
    }
  } catch (err) {
    loggerError(err.message, "Error in authParse", "auth");
    return next(new HttpError("Authentication failed", 401));
  }
};
