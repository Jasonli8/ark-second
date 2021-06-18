const yahooFinance = require("yahoo-finance");

////////////////////////////////////////////////////////////////

const HttpError = require("../../../components/models/http-error");
const { loggerError } = require("../../../components/helpers/logger");

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
        loggerError(err.message, "Failed to get history of quote in finController", "finReq");
        throw new HttpError("Something went wrong. Couldn't get data.", 500);
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
        loggerError(err.message, "Failed to get quote in finController", "finReq");
        throw new HttpError("Something went wrong. Couldn't get data.", 400);
      }

      res.status(200).json(snapshot);
    }
  );
};

////////////////////////////////////////////////////////////////

exports.getHistory = getHistory;
exports.getQuote = getQuote;