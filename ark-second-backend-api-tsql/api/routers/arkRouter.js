const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

/////////////////////////////////////////////////////////////////////

const dbController = require("./controllers/dbController");
const finController = require("./controllers/finController");
const authParse = require("../../middleware/authParse");

/////////////////////////////////////////////////////////////////////

///////// GET BY COMPANY ID??

router.use(authParse);

// gets cumulative (specified) holdings per ticker by date
router.get(
  "/db/funds/holdings/date",
  body("fundType").isArray({ min: 1 }),
  body("date").isDate(),
  dbController.getFundsHoldingByDate
);

// gets each fund's holdings by ticker over a period of time
router.get(
  "/db/funds/holdings/ticker",
  body("fundType").isArray({ min: 1 }),
  body("ticker").isString(),
  body("fromDate").isDate(),
  body("toDate").isDate(),
  dbController.getFundHoldingByTicker
);

// gets a tickers cumulative change in shares across all funds
router.get(
  "/db/funds/change",
  body("ticker").isString(),
  body("fromDate").isDate(),
  body("toDate").isDate(),
  dbController.getChangeByTicker
);

// gets the list of tracked funds
router.get("/db/funds", dbController.getFunds);

// gets all the quotes for that ticker at certain periods between the fromDate (included) to the toDate (excluded)
router.get(
  "/fin/history",
  body("ticker").isString(),
  body("period").isString(),
  body("fromDate").isDate(),
  body("toDate").isDate(),
  finController.getHistory
);

// gets the current quote for that ticker
router.get("/fin/quote", body("ticker").isString(), finController.getQuote);

/////////////////////////////////////////////////////////////////////

module.exports = router;
