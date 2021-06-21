const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

/////////////////////////////////////////////////////////////////////

const authParse = require("../../middleware/authParse");
const userController = require("./controllers/userController");

/////////////////////////////////////////////////////////////////////

router.post(
  "/signup",
  [
    check("user").isLength({ min: 1, max: 50 }),
    check("firstName").isLength({ min: 1, max: 50 }),
    check("lastName").isLength({ min: 1, max: 50 }),
    check("email").isEmail(),
    check("email").isLength({ min: 1, max: 50 }),
    check("password").isLength({ min: 1, max: 50 }),
  ],
  userController.signup
);
router.post(
  "/login",
  [check("user").isLength({ min: 1 }), check("password").isLength({ min: 1 })],
  userController.login
);
router.post(
  "/recovery/user",
  [check("email").isEmail()],
  userController.userRecovery
);
router.get(
  "/recovery/password",
  [check("user").isLength({ min: 1 })],
  userController.passwordRecovery
);
router.post(
  "./recover/passwordConfirm",
  [check("user").isLength({ min: 1 }), check("answer").isLength({ min: 1 })],
  userController.passwordRecoveryComfirmation
);

router.use(authParse);

router.post(
  "./recover/updatePassword",
  [
    check("password").isLength({ min: 1 }),
    check("confirmPassword").isLength({ min: 1 }),
  ],
  userController.updatePassword
);

/////////////////////////////////////////////////////////////////////

module.exports = router;
