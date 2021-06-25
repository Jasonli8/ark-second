const bcrypt = require("bcryptjs");

////////////////////////////////////////////////////////////////

const queryDB = require("./queryDB");
const { loggerError } = require("./logger");

////////////////////////////////////////////////////////////////

const auth = async (user, password) => {
  let result;
  let resultParse;
  try {
    const query1 = `SELECT * FROM [User].[User] WHERE [userName] = '${user}'`;
    result = await queryDB(query1);
    resultParse = result[1].recordsets[0][0];
    if (!resultParse) {
      return new HttpError("Username and password don't match or don't exist");
    }
  } catch (err) {
    loggerError(err.message, "Failed to get user data in auth", "auth");
    return new HttpError(
      "Something went wrong. Failed to login. Try again later.",
      500
    );
  }

  let isValidPass = false;
  try {
    isValidPass = await bcrypt.compare(password, resultParse.password);
  } catch (err) {
    loggerError(err.message, "Failed to unencrypt password in auth", "auth");
    return new HttpError(
      "Something went wrong. Failed to login. Try again later.",
      500
    );
  }
  
  if (isValidPass) {
    return {
      user: resultParse.user,
      firstName: resultParse.firstName,
      lastName: resultParse.lastName,
      email: resultParse.email,
    };
  } else {
    return new HttpError(
      "Username and password don't match or don't exist",
      400
    );
  }
};

module.exports = auth;
