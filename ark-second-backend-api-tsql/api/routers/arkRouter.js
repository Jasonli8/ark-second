const express = require("express");
const { query } = require("express-validator");

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
  query("fundType").isString(),
  query("date").isDate(),
  dbController.getFundsHoldingByDate
);

// gets each fund's holdings by ticker over a period of time
router.get(
  "/db/funds/holdings/ticker",
  query("fundType").isString({ min: 1 }),
  query("ticker").isString(),
  query("fromDate").isDate(),
  query("toDate").isDate(),
  dbController.getFundHoldingByTicker
);

// gets a tickers cumulative change in shares across all funds
router.get(
  "/db/funds/change",
  query("ticker").isString(),
  query("fromDate").isDate(),
  query("toDate").isDate(),
  dbController.getChangeByTicker
);

// gets the list of tracked funds
router.get("/db/funds", dbController.getFunds);

// gets all the quotes for that ticker at certain periods between the fromDate (included) to the toDate (excluded)
router.get(
  "/fin/history",
  query("ticker").isString(),
  query("period").isIn(["d", "w", "m", "v"]),
  finController.getHistory
);

// gets the current quote for that ticker
router.get("/fin/quote", query("ticker").isString(), finController.getQuote);

/////////////////////////////////////////////////////////////////////

module.exports = router;
