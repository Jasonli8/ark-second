const queryDB = require("./queryDB");
const HttpError = require("../models/http-error");

////////////////////////////////////////////////////////////////

// checkFund(string fundType) checks if the fundType is tracked in the DB
const checkFund = async (fundType) => {
  try {
    const query1 = "select [f].[fundName] from [Shares].[Fund] as [f]";
    const result = queryDB(query1);
    let fundIsValid = false;
    result[0].recordset.forEach(function (fund) {
      if (fund.fundName == fundType) {
        fundIsValid = true;
      }
    });
    if (!fundIsValid) {
      return next(new HttpError("Fund not found", 404));
    }
  } catch (err) {
    return next(new HttpError("Something went wrong. Try again later.", 500));
  }

  return true;
};

////////////////////////////////////////////////////////////////

module.exports = checkFund;