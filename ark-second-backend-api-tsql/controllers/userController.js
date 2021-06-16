const log4js = require("log4js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

////////////////////////////////////////////////////////////////

const queryDB = require("./engine/queryDB");
const HttpError = require("../models/http-error");

////////////////////////////////////////////////////////////////

log4js.configure({
  appenders: { error: { type: "file", filename: "./logs/error.log" } },
  categories: { default: { appenders: ["error"], level: process.env.LOG_LEVEL } },
});
const logger = log4js.getLogger("error");

////////////////////////////////////////////////////////////////

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input", 422));
  }

  const { user, firstName, lastName, email, password } = req.body;
  let existingUser;
  try {
    const query1 = `SELECT * FROM [User].[Users] WHERE [user] = ${user}`;
    const result = await queryDB(query1);
    if (result[0]) {
      res
        .status(400)
        .json({ message: "A user with the chosen username already exists" }); // dunno if right status
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

  let hashedPass;
  try {
    hashedPass = await bcrypt.hash(password, 12);
  } catch (err) {
    logger.error("Error in signup, hashing password");
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
    const query2 =
      `INSERT INTO [User].[Users] ([user],[firstName],[lastName],[email],[password]) ` +
      `VALUES(${user},${firstName},${lastName},${email},${hashedPass})`;
    queryDB(query2);
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
    token = await jwt.sign({user: user, firstName: firstName, lastName: lastName, email: email}, process.env.EN_KEY, {expiresIn:'1h'})
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

  res.status(200).json(JSON.stringify({user, firstName, lastName, token}));
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input", 422));
  }

  const { user, password } = req.body;
  let result;
  let resultParse;
  try {
    const query1 = `SELECT * FROM [User].[Users] WHERE [user] = ${user}`;
    result = await queryDB(query1);
    resultParse = result[1].recordsets[0][0]
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
    isValidPass = await bcrypt.compare(
      password,
      resultParse.password
    );
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
      token = await jwt.sign({user: resultParse.user, firstName: resultParse.firstName, lastName: resultParse.lastName, email: resultParse.email}, process.env.EN_KEY, {expiresIn:'1h'})
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
    res.status(200).json(JSON.stringify({user: resultParse.user, firstName: resultParse.firstName, lastName: resultParse.lastName, token}));
  } else {
    res
      .status(400)
      .json({ message: "User and password don't match or don't exist" });
  }
};

const recovery = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input", 422));
  }

  let result;
  try {
    const query = `SELECT [email] FROM [User].[Users] WHERE [user] = ${req.body.user}`;
    result = await queryDB(query);
  } catch (err) {
    logger.error("Error in recovery, failed to search for users");
    return next(
      new HttpError(
        "Something went wrong. Try again later",
        500
      )
    );
  }
  if (!result[1].recordsets[0][0].email) {
    return next(
      new HttpError(
        "User not found",
        404
      )
    );
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

  // handle link logic

  let info = await transporter.sendMail({
    from: '"ArkSecond" <donotreply@arksecond.com>',
    to: result[1].recordsets[0][0].email,
    subject: "Password Recovery",
    text: `` // FILL IN EMAIL CONTENTS
  });

  res.status(200);
}

////////////////////////////////////////////////////////////////

exports.signup = signup;
exports.login = login;
exports.recovery = recovery;