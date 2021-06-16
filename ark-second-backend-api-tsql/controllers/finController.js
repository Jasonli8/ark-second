const yahooFinance = require("yahoo-finance");
const log4js = require("log4js");

////////////////////////////////////////////////////////////////

const HttpError = require("../models/http-error");

////////////////////////////////////////////////////////////////

log4js.configure({
  appenders: { error: { type: "file", filename: "./logs/error.log" } },
  categories: { default: { appenders: ["error"], level: process.env.LOG_LEVEL } },
});
const logger = log4js.getLogger("error");

////////////////////////////////////////////////////////////////

const getHistory = (req, res, next) => {
  const ticker = req.params.ticker;
  const period = req.params.period;
  const interval = req.params.interval;
  const start = interval.substring(0, 10);
  const end = interval.substring(11, 21);

  yahooFinance.historical(
    {
      symbol: `${ticker}`,
      from: `${start}`,
      to: `${end}`,
      period: `${period}`,
    },
    function (err, quotes) {
      if (err) {
        logger.error(err.message);
        throw new HttpError("Something went wrong. Couldn't get data.", 400);
      }

      res.status(200).json(quotes);
    }
  );
};

const getQuote = (req, res, next) => {
  const ticker = req.params.ticker;

  yahooFinance.quote(
    {
      symbol: `${ticker}`,
      modules: ["price"],
    },
    function (err, snapshot) {
      if (err) {
        logger.error(err.message);
        throw new HttpError("Something went wrong. Couldn't get data.", 400);
      }

      res.status(200).json(snapshot);
    }
  );
};

////////////////////////////////////////////////////////////////

exports.getHistory = getHistory;
exports.getQuote = getQuote;