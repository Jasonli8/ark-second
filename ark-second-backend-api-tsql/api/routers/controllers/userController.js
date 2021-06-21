const log4js = require("log4js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

////////////////////////////////////////////////////////////////

const queryDB = require("../../../components/helpers/queryDB");
const HttpError = require("../../../components/models/http-error");

////////////////////////////////////////////////////////////////

log4js.configure({
  appenders: { error: { type: "file", filename: "./logs/error.log" } },
  categories: {
    default: { appenders: ["error"], level: process.env.LOG_LEVEL },
  },
});
const logger = log4js.getLogger("error");

////////////////////////////////////////////////////////////////

// creates a new user
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input", 422));
  }

  const { user, firstName, lastName, email, password, question, answer } =
    req.body;
  let existingUser;
  try {
    const query1 = `SELECT * FROM [User].[User] WHERE [user] = ${user}`;
    const result = await queryDB(query1);
    if (result[0]) {
      res
        .status(400)
        .json({ message: "A user with the chosen username already exists" });
    }
  } catch (err) {
    logger.error("Error in signup, checking for existing users");
    logger.error(err.message);
    return next(
      new HttpError(
        "Something went wrong. Failed to create user. Try again later.",
        500
      )
    );
  }
  let questionId;
  try {
    const query2 = `SELECT * FROM [User].[SecurityQuestion] WHERE [question] = ${question}`;
    let result = await queryDB(query2);
    if (!result[1].recordsets[0][0]) {
      const query3 = `INSERT INTO [User].[SecurityQuestion] ([question]) VALUES(${question})`;
      await queryDB(query3);
      result = await queryDB(query2);
    }
    questionId = result[1].recordsets[0][0].Id;
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong. Failed to create user. Try again later.",
        500
      )
    );
  }

  let hashedPass;
  let hashedAnswer;
  try {
    hashedPass = await bcrypt.hash(password, 12);
    hashedAnswer = await bcrypt.hash(answer, 12);
  } catch (err) {
    logger.error(
      "Error in signup, hashing password and security question answer"
    );
    logger.error(err.message);
    return next(
      new HttpError(
        "Something went wrong. Failed to create user. Try again later.",
        500
      )
    );
  }
  if (!phone) {
    phone = null;
  }

  try {
    const query4 =
      `BEGIN TRAN T1` +
      `INSERT INTO [User].[User] ([userName],[firstName],[lastName],[email],[password]) ` +
      `VALUES(${user},${firstName},${lastName},${email},${hashedPass}) ` +
      `INSERT INTO [User].[UserSecurityQuestion] ([userId],[securityQuestion],[answer]) ` +
      `SELECT [Id], ${questionId}, ${hashedAnswer} FROM [User].[User] WHERE [userName] = ${user} ` +
      `COMMIT TRAN T1`;
    await queryDB(query4);
  } catch (err) {
    logger.error("Error in signup, creating user");
    logger.error(err.message);
    return next(
      new HttpError(
        "Something went wrong. Failed to create user. Try again later.",
        500
      )
    );
  }

  let token;
  try {
    token = await jwt.sign(
      { user: user, firstName: firstName, lastName: lastName, email: email },
      process.env.EN_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    logger.error("Error in signup, creating token");
    logger.error(err.message);
    return next(
      new HttpError(
        "Something went wrong. User created but failed to log in. Try to log in later.",
        500
      )
    );
  }

  res.status(201).json({ user, firstName, lastName, token });
};

// logs in a user
const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input", 422));
  }

  const { user, password } = req.body;
  let result;
  let resultParse;
  try {
    const query1 = `SELECT * FROM [User].[User] WHERE [user] = ${user}`;
    result = await queryDB(query1);
    resultParse = result[1].recordsets[0][0];
    if (!resultParse) {
      res
        .status(400)
        .json({ message: "User and password don't match or don't exist" });
    }
  } catch (err) {
    logger.error("Error in login, getting user data");
    logger.error(err.message);
    return next(
      new HttpError(
        "Something went wrong. Failed to login. Try again later.",
        500
      )
    );
  }

  let isValidPass = false;
  try {
    isValidPass = await bcrypt.compare(password, resultParse.password);
  } catch (err) {
    logger.error("Error in login, unencrypting password");
    logger.error(err.message);
    return next(
      new HttpError(
        "Something went wrong. Failed to login. Try again later.",
        500
      )
    );
  }

  if (isValidPass) {
    let token;
    try {
      token = await jwt.sign(
        {
          user: resultParse.user,
          firstName: resultParse.firstName,
          lastName: resultParse.lastName,
          email: resultParse.email,
        },
        process.env.EN_KEY,
        { expiresIn: "1h" }
      );
    } catch (err) {
      logger.error("Error in signup, creating token");
      logger.error(err.message);
      return next(
        new HttpError(
          "Something went wrong. Failed to log in. Try to log in later.",
          500
        )
      );
    }
    res.status(200).json(
      JSON.stringify({
        user: resultParse.user,
        firstName: resultParse.firstName,
        lastName: resultParse.lastName,
        token,
      })
    );
  } else {
    res
      .status(400)
      .json({ message: "User and password don't match or don't exist" });
  }
};

// sends email with username info
const userRecovery = async (req, res, next) => {
  // to fix
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input", 422));
  }

  let result;
  try {
    const query = `SELECT [user] FROM [User].[Users] WHERE [email] = ${req.body.email}`;
    result = await queryDB(query);
  } catch (err) {
    logger.error("Error in recovery, failed to search for users");
    return next(new HttpError("Something went wrong. Try again later", 500));
  }
  if (!result[1].recordsets[0][0].user) {
    return next(new HttpError("Email has no such user", 404));
  }

  let account = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });

  let info = await transporter.sendMail({
    from: '"ArkSecond" <donotreply@arksecond.com>',
    to: req.body.email,
    subject: "Username Recovery",
    text: `Your username is: ${result[1].recordsets[0][0].user}`,
  });

  res.status(200);
};

// retrieve the security question for a user
const passwordRecovery = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input", 422));
  }
  const { user } = req.body;

  let result;
  try {
    const query1 = `SELECT [sq].[question] FROM [User].[User] AS [u] JOIN [User].[UserSecurityQuestion] AS [usq] ON [usq].[userId] = [u].[Id] JOIN [User].[SecurityQuestion] AS [sq] ON [sq].[Id] = [usq].[securityQuestionId] WHERE [u].[user] = ${user}`;
    result = await queryDB(query1);
  } catch (err) {
    logger.error(
      "Error in password recovery confirmation, failed to search for users for answer"
    );
    return next(new HttpError("Something went wrong. Try again later", 500));
  }
  if (!result[1].recordsets[0][0].question) {
    return next(new HttpError("No such user exists", 404));
  }
  res.status(200).json(result[1].recordsets[0][0].question)
};

// checks answer to user's security question before returning a token
const passwordRecoveryComfirmation = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input", 422));
  }
  const { user, answer } = req.body;

  let result;
  try {
    const query1 = `SELECT [answer] FROM [User].[User] AS [u] JOIN [User].[UserSecurityQuestion] AS [usq] ON [usq].[userId] = [u].[Id] WHERE [user] = ${user}`;
    result = await queryDB(query1);
  } catch (err) {
    logger.error(
      "Error in password recovery confirmation, failed to search for users for answer"
    );
    return next(new HttpError("Something went wrong. Try again later", 500));
  }
  if (!result[1].recordsets[0][0].answer) {
    return next(new HttpError("No such user exists", 404));
  }

  let isValid = false;
  try {
    isValid = await bcrypt.compare(answer, result[1].recordsets[0][0].answer);
  } catch (err) {
    logger.error(
      "Error in password recovery confirmation, unencrypting answer"
    );
    logger.error(err.message);
    return next(
      new HttpError(
        "Something went wrong. Failed to login. Try again later.",
        500
      )
    );
  }

  if (isValid) {
    let result;
    let resultParse;
    try {
      const query1 = `SELECT * FROM [User].[User] WHERE [user] = ${user}`;
      result = await queryDB(query1);
      resultParse = result[1].recordsets[0][0];
      if (!resultParse) {
        res
          .status(400)
          .json({ message: "User doesn't exist" });
      }
    } catch (err) {
      logger.error("Error in login, getting user data");
      logger.error(err.message);
      return next(
        new HttpError(
          "Something went wrong. Try again later.",
          500
        )
      );
    }
    let token;
    try {
      token = await jwt.sign(
        {
          user: resultParse.user,
          firstName: resultParse.firstName,
          lastName: resultParse.lastName,
          email: resultParse.email,
        },
        process.env.EN_KEY,
        { expiresIn: "1h" }
      );
    } catch (err) {
      logger.error("Error in signup, creating token");
      logger.error(err.message);
      return next(
        new HttpError(
          "Something went wrong. Failed to log in. Try to log in later.",
          500
        )
      );
    }
    res.status(200).json(
      JSON.stringify({
        user: resultParse.user,
        firstName: resultParse.firstName,
        lastName: resultParse.lastName,
        token,
      })
    );
  } else {
    return next(new HttpError("Answer is incorrect", 400));
  }
};

// updates password for given user
const updatePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input", 422));
  }
  const { password, confirmPassword } = req.body;
  const user = req.userData.user;

  if (password !== confirmPassword) {
    return next(new HttpError("Passwords don't match", 400));
  }

  let hashedPass;
  try {
    hashedPass = await bcrypt.hash(password, 12);
  } catch (err) {
    logger.error(
      "Error in updating password, hashing password"
    );
    logger.error(err.message);
    return next(
      new HttpError(
        "Something went wrong. Failed to create user. Try again later.",
        500
      )
    );
  }

  try {
    const query = `UPDATE [User].[User] SET [password] = ${hashedPass} WHERE [user] = ${user}`
    queryDB(query);
    res.status(200);
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong. Failed to update password. Try again later.",
        500
      )
    );
  }
};

////////////////////////////////////////////////////////////////

exports.signup = signup;
exports.login = login;
exports.userRecovery = userRecovery;
exports.passwordRecovery = passwordRecovery;
exports.passwordRecoveryComfirmation = passwordRecoveryComfirmation;
exports.updatePassword = updatePassword;
