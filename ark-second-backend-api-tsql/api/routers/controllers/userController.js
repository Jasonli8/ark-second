const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

////////////////////////////////////////////////////////////////

const queryDB = require("../../../components/helpers/queryDB");
const HttpError = require("../../../components/models/http-error");
const {
  loggerError,
  loggerInfo,
} = require("../../../components/helpers/logger");

////////////////////////////////////////////////////////////////

// getSecurityQuestions() retrieves all security questions from DB
const getSecurityQuestions = async (req, res, next) => {
  console.log(req.headers);
  try {
    const query = "SELECT [question] FROM [User].[SecurityQuestion]";
    const result = await queryDB(query);
    res.status(200).json(result[1].recordsets[0]);
  } catch (err) {
    loggerError(err.message, "Failed to get security questions", "auth");
    return next(
      new HttpError(
        "Something went wrong. Couldn't load security question presets. Try again later.",
        500
      )
    );
  }
};

// signup(string user, string firstName, string lastName, string email, string password, string question, string answer) creates a new user
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    loggerError(errors, "Invalid input in signup", "httpParams");
    return next(new HttpError("Invalid input", 422));
  }

  loggerInfo("Signing up a user", "auth");

  const { user, firstName, lastName, email, password, question, answer } =
    req.body;
  try {
    const query1 = `SELECT * FROM [User].[User] WHERE [userName] = '${user}'`;
    const result1 = await queryDB(query1);
    if (result1[1].recordset[0]) {
      throw new HttpError(
        "A user with the chosen username already exists",
        400
      );
    }

    let questionId;
    const query2 = `SELECT * FROM [User].[SecurityQuestion] WHERE [question] = '${question}'`;
    let result2 = await queryDB(query2);
    if (!result2[1].recordsets[0][0]) {
      const query3 = `INSERT INTO [User].[SecurityQuestion] ([question]) VALUES(${question})`;
      await queryDB(query3);
      result = await queryDB(query2);
    }
    questionId = result2[1].recordsets[0][0].Id;

    let hashedPass;
    let hashedAnswer;
    hashedPass = await bcrypt.hash(password, 12);
    hashedAnswer = await bcrypt.hash(answer, 12);

    const query4 =
      `BEGIN TRAN T1 ` +
      `INSERT INTO [User].[User] ([userName],[firstName],[lastName],[email],[password]) ` +
      `VALUES('${user}','${firstName}','${lastName}','${email}','${hashedPass}') ` +
      `INSERT INTO [User].[UserSecurityQuestion] ([userId],[securityQuestionId],[answer]) ` +
      `SELECT [Id], ${questionId}, '${hashedAnswer}' FROM [User].[User] WHERE [userName] = '${user}' ` +
      `COMMIT TRAN T1`;
    await queryDB(query4);

    const query5 = `SELECT * FROM [User].[User] WHERE [userName] = '${user}'`;
    const result = await queryDB(query5);
    if (!result[1].recordset[0]) {
      throw new HttpError(
        "Something went wrong. Failed to create user. Try again later.",
        500
      );
    }

    let token;
    token = await jwt.sign(
      { user: user, firstName: firstName, lastName: lastName, email: email },
      process.env.EN_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({ user, firstName, lastName, token });
  } catch (err) {
    loggerError(err.message, "Error in signup", "auth");
    return next(err);
  }
};

// login(string user, string password) checks user credentials to authenticate
const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    loggerError(errors, "Invalid input in login", "httpParams");
    return next(new HttpError("Invalid input", 422));
  }

  const { user, password } = req.body;
  loggerInfo("Logging in a user with username: " + user, "auth");
  let result;
  let resultParse;
  try {
    const query1 = `SELECT * FROM [User].[User] WHERE [userName] = '${user}'`;
    result = await queryDB(query1);
    resultParse = result[1].recordsets[0][0];
    if (!resultParse) {
      res
        .status(400)
        .json({ message: "User and password don't match or don't exist" });
    }
  } catch (err) {
    loggerError(err.message, "Error in login, getting user data", "auth");
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
    loggerError(err.message, "Error in login, unencrypting password", "auth");
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
          user: resultParse.userName,
          firstName: resultParse.firstName,
          lastName: resultParse.lastName,
          email: resultParse.email,
        },
        process.env.EN_KEY,
        { expiresIn: "1h" }
      );
    } catch (err) {
      loggerError(err.message, "Error in signup, creating token", "auth");
      return next(
        new HttpError(
          "Something went wrong. Failed to log in. Try to log in later.",
          500
        )
      );
    }
    loggerInfo(user + " is logged in", "auth");
    res.status(200).json(
      JSON.stringify({
        user: resultParse.userName,
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

// userRecovery(string email) sends an email to the specified email with the associated username attached
const userRecovery = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    loggerError(errors, "Invalid input in userRecovery", "httpParams");
    return next(new HttpError("Invalid input", 422));
  }

  let result;
  try {
    const query = `SELECT [userName] FROM [User].[User] WHERE [email] = '${req.body.email}'`;
    result = await queryDB(query);
    if (!result[1].recordsets[0][0]) {
      throw new HttpError("Email has no such user", 404);
    }

    async function sendEmail() {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "arksecondapp@gmail.com",
          pass: "arksecond123",
        },
        tsl: {
          // for local hosting
          rejectUnauthorized: false,
        },
      });
      console.log(transporter);

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"ArkSecond" <donotreply@arksecond.com>',
        to: "arksecondapp@gmail.com", //req.body.email
        subject: "Username Recovery",
        text: `Your username is: ${result[1].recordsets[0][0].userName}`,
      });

      if (info.rejected[0]) {
        throw new HttpError("Email could not be sent", 500);
      }
    }
    await sendEmail();

    res.status(200).json({});
  } catch (err) {
    console.log(err);
    loggerError(err.message, "Error in username recovery.", "auth");
    return next(err);
  }
};

// passwordRecovery(string user) retrieves the specified user's security question
const passwordRecovery = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    loggerError(errors, "Invalid input in passwordRecovery", "httpParams");
    return next(new HttpError("Invalid input", 422));
  }
  const { user } = req.query;
  console.log(user);

  let result;
  try {
    const query1 = `SELECT [sq].[question] FROM [User].[User] AS [u] JOIN [User].[UserSecurityQuestion] AS [usq] ON [usq].[userId] = [u].[Id] JOIN [User].[SecurityQuestion] AS [sq] ON [sq].[Id] = [usq].[securityQuestionId] WHERE [u].[userName] = '${user}'`;
    result = await queryDB(query1);
  } catch (err) {
    loggerError(
      err.message,
      "Error in password recovery confirmation, failed to search for users for answer",
      "auth"
    );
    return next(new HttpError("Something went wrong. Try again later", 500));
  }
  console.log(result);
  if (!result[1].recordsets[0][0]) {
    return next(new HttpError("No such user exists", 404));
  }
  res.status(200).json({ question: result[1].recordsets[0][0].question });
};

// passwordRecoveryComfirmation(string user, string answer) checks whether the answer matches the user's answer for their security question
const passwordRecoveryConfirmation = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    loggerError(
      errors,
      "Invalid input in passwordRecoveryConfirmation",
      "httpParams"
    );
    return next(new HttpError("Invalid input", 422));
  }
  const { user, answer } = req.body;

  let result;
  try {
    const query1 = `SELECT [answer] FROM [User].[User] AS [u] JOIN [User].[UserSecurityQuestion] AS [usq] ON [usq].[userId] = [u].[Id] WHERE [userName] = '${user}'`;
    result = await queryDB(query1);
  } catch (err) {
    loggerError(
      err.message,
      "Error in password recovery confirmation, failed to search for users for answer",
      "auth"
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
    loggerError(
      err.message,
      "Error in password recovery confirmation, unencrypting answer",
      "auth"
    );
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
      const query1 = `SELECT * FROM [User].[User] WHERE [userName] = '${user}'`;
      result = await queryDB(query1);
      resultParse = result[1].recordsets[0][0];
      if (!resultParse) {
        res.status(400).json({ message: "User doesn't exist" });
      }
    } catch (err) {
      loggerError(err.message, "Error in login, getting user data", "auth");
      return next(new HttpError("Something went wrong. Try again later.", 500));
    }
    let token;
    try {
      token = await jwt.sign(
        {
          user: resultParse.userName,
          firstName: resultParse.firstName,
          lastName: resultParse.lastName,
          email: resultParse.email,
        },
        process.env.EN_KEY,
        { expiresIn: "1h" }
      );
    } catch (err) {
      loggerError(err.message, "Error in signup, creating token", "auth");
      return next(
        new HttpError(
          "Something went wrong. Failed to log in. Try to log in later.",
          500
        )
      );
    }
    res.status(200).json(
      JSON.stringify({
        user: resultParse.userName,
        firstName: resultParse.firstName,
        lastName: resultParse.lastName,
        token,
      })
    );
  } else {
    return next(new HttpError("Answer is incorrect", 400));
  }
};

// updatePassword(string password, string confirmPassword, tokenized user) updates the user's password if the passwords match
const updatePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    loggerError(errors, "Invalid input in updatePassword", "httpParams");
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
    console.log(hashedPass);
    const query = `UPDATE [User].[User] SET [password] = '${hashedPass}' WHERE [userName] = '${user}'`;
    const response = await queryDB(query);
    console.log(response);
    res.status(200).json({});
  } catch (err) {
    loggerError(err.message, "Error in updating password", "auth");
    return next(err);
  }
};

////////////////////////////////////////////////////////////////

exports.getSecurityQuestions = getSecurityQuestions;
exports.signup = signup;
exports.login = login;
exports.userRecovery = userRecovery;
exports.passwordRecovery = passwordRecovery;
exports.passwordRecoveryConfirmation = passwordRecoveryConfirmation;
exports.updatePassword = updatePassword;
