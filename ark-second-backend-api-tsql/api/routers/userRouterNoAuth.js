const express = require("express");
const { body, query } = require("express-validator");

const router = express.Router();

/////////////////////////////////////////////////////////////////////

const authParse = require("../../middleware/authParse");
const userController = require("./controllers/userController");

/////////////////////////////////////////////////////////////////////

// retrieves all security questions from DB
router.get('/questions', userController.getSecurityQuestions);

// creates a new user
router.post(
  "/signup",
  body("user").isLength({ min: 1, max: 50 }),
  body("firstName").isLength({ min: 1, max: 50 }),
  body("lastName").isLength({ min: 1, max: 50 }),
  body("email").isEmail(),
  body("email").isLength({ min: 1, max: 50 }),
  body("password").isLength({ min: 1, max: 50 }),
  body("question").isString(),
  body("answer").isString(),
  userController.signup
);

// checks user credentials to authenticate
router.post(
  "/login",
  body("user").isLength({ min: 1 }),
  body("password").isLength({ min: 1 }),
  userController.login
);

// sends an email to the specified email with the associated username attached
router.post(
  "/recovery/user",
  body("email").isEmail(),
  userController.userRecovery
);

// retrieves the specified user's security question
router.get(
  "/recovery/password",
  query("user").isLength({ min: 1 }),
  userController.passwordRecovery
);

// checks whether the answer matches the user's answer for their security question
router.post(
  "/recovery/passwordConfirm",
  body("user").isLength({ min: 1 }),
  body("answer").isLength({ min: 1 }),
  userController.passwordRecoveryConfirmation
);

/////////////////////////////////////////////////////////////////////

module.exports = router;
