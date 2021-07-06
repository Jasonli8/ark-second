const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

/////////////////////////////////////////////////////////////////////

const authParse = require("../../middleware/authParse");
const userController = require("./controllers/userController");

/////////////////////////////////////////////////////////////////////

router.use(authParse);

// updates the user's password if the passwords match
router.post(
  "./recover/updatePassword",
  body("password").isLength({ min: 1 }),
  body("confirmPassword").isLength({ min: 1 }),
  userController.updatePassword
);

/////////////////////////////////////////////////////////////////////

module.exports = router;
