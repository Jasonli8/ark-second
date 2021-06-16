const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

/////////////////////////////////////////////////////////////////////

const userController = require("../controllers/userController");

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
  "/recovery",
  [check("user").isLength({ min: 1 })],
  userController.recovery
);

/////////////////////////////////////////////////////////////////////

module.exports = router;
