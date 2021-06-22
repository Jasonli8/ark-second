const queryDB = require("./queryDB");
const HttpError = require("../models/http-error");

////////////////////////////////////////////////////////////////

// checkTicker(string ticker) checks if the ticker is tracked in the DB
const checkTicker = async (fundType) => {
  try {
    const query1 = "select [c].[ticker] from [Shares].[Company] as [c]";
    const result = queryDB(query1);
    let tickerIsValid = false;
    result[0].recordset.forEach(function (company) {
      if (company.ticker == ticker) {
        tickerIsValid = true;
      }
    });
    if (!tickerIsValid) {
      return next(new HttpError("Ticker not found", 404));
    }
  } catch (err) {
    return next(new HttpError("Something went wrong. Try again later.", 500));
  }
  return true;
};

////////////////////////////////////////////////////////////////

module.exports = checkTicker;