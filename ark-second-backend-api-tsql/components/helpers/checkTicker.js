const queryDB = require("./queryDB");
const HttpError = require("../models/http-error");

////////////////////////////////////////////////////////////////

// checkTicker(string ticker) checks if the ticker is tracked in the DB
const checkTicker = async (ticker) => {
  try {
    const query1 = "select distinct [c].[ticker] from [Shares].[Company] as [c]";
    const result = await queryDB(query1);
    let tickerIsValid = false;
    result[1].recordset.forEach(function (company) {
      if (company.ticker == ticker) {
        tickerIsValid = true;
      }
    });
    if (!tickerIsValid) {
      throw new HttpError("Ticker not found", 404);
    }
  } catch (err) {
    throw err;
  }
  return true;
};

////////////////////////////////////////////////////////////////

module.exports = checkTicker;