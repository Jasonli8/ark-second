const { validationResult } = require("express-validator");
const yahooFinance = require("yahoo-finance");

////////////////////////////////////////////////////////////////

const HttpError = require("../../../components/models/http-error");
const { loggerError } = require("../../../components/helpers/logger");
const checkDate = require("../../../components/helpers/checkDate");
const checkTicker = require("../../../components/helpers/checkTicker");

////////////////////////////////////////////////////////////////

// getHistory(string ticker, string period, date fromDate, date toDate) gets all the quotes for that ticker at certain periods between the fromDate (included) to the toDate (excluded)
const getHistory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    loggerError(errors, "Invalid input in getHistory", "httpParams");
    return next(new HttpError("Invalid input", 422));
  }

  const { ticker, period, fromDate, toDate } = req.query;

  const validPeriods = ["d", "w", "m", "v"];
  const isValidPeriod = validPeriods.includes(period);
  if (!isValidPeriod) {
    return next(new HttpError("Period is invalid", 400));
  }

  let formattedFromDate;
  let formattedToDate;
  try {
    formattedFromDate = await checkDate(fromDate);
    formattedToDate = await checkDate(toDate);
    await checkTicker(ticker);
    yahooFinance.historical(
      {
        symbol: `${ticker}`,
        from: `${formattedFromDate}`,
        to: `${formattedToDate}`,
        period: `${period}`,
      },
      function (err, quotes) {
        if (err) {
          loggerError(
            err.message,
            `Failed to retrieve historical yahoo data for ${ticker} from ${formattedFromDate} to ${formattedToDate} with period ${period}.`,
            "finReq"
          );
          return process.nextTick(() => {
            next(err);
          });
        }
        res.status(200).json(quotes);
      }
    );
  } catch (err) {
    console.log(err);
    return process.nextTick(() => {
      next(err);
    });
  }
};

// getQuote(string ticker) gets the current quote for that ticker
const getQuote = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    loggerError(errors, "Invalid input in getQuote", "httpParams");
    return next(new HttpError("Invalid input", 422));
  }

  const { ticker } = req.query;

  try {
    await checkTicker(ticker);
    yahooFinance.quote(
      {
        symbol: `${ticker}`,
        modules: ["price"],
      },
      function (err, snapshot) {
        if (err) {
          loggerError(
            err.message,
            `Failed to get quote in finController for ${ticker}`,
            "finReq"
          );
          return process.nextTick(() => {
            next(
              new HttpError(
                `Something went wrong. Couldn't get data for ${ticker}`,
                400
              )
            );
          });
        }

        res.status(200).json(snapshot);
      }
    );
  } catch (err) {
    console.log(err);
    return process.nextTick(() => {
      next(err);
    });
  }
};

////////////////////////////////////////////////////////////////

exports.getHistory = getHistory;
exports.getQuote = getQuote;
