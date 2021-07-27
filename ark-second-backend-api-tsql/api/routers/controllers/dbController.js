const { validationResult } = require("express-validator");

////////////////////////////////////////////////////////////////

const HttpError = require("../../../components/models/http-error");
const queryDB = require("../../../components/helpers/queryDB");
const checkFund = require("../../../components/helpers/checkFund");
const checkDate = require("../../../components/helpers/checkDate");
const checkTicker = require("../../../components/helpers/checkTicker");
const { loggerError } = require("../../../components/helpers/logger");

////////////////////////////////////////////////////////////////

const toArray = (str) => {
  const arr = str.split(",");
  return arr;
};

////////////////////////////////////////////////////////////////

// getFunds() returns funds
const getFunds = async (req, res, next) => {
  const query =
    "select [f].[fundName], [f].[description] from [Shares].[Fund] as [f] order by [f].[fundName] asc";
  try {
    await queryDB(query)
      .then((result) => {
        if (result[0] === 200) {
          res.status(200).json(result[1].recordsets);
        } else {
          throw new HttpError("Something went wrong.", result[0]);
        }
      })
      .catch((err) => {
        throw new HttpError("Something went wrong. Couldn't get data", 500);
      });
  } catch (err) {
    return next(err);
  }
};

// getRecent(string fundType, int companyId) gets most recent data on a company for a given fund
const getRecent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    loggerError(errors, "Invalid input in getRecent", "httpParams");
    return next(new HttpError("Invalid input", 422));
  }

  const { fundType, companyId } = req.query;
  const query = `WITH All_Holding([fundName],[description],[companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue],[weight],[sharesDifference],[marketValueDifference],[maxDate]) 
    AS (
    SELECT [fundName],[description],[companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue],[weight],([shares]-LAG([shares],1) OVER(PARTITION BY [ticker] ORDER BY [date])) AS [sharesDifference], ([marketValue]-LAG([marketValue],1) OVER(PARTITION BY [ticker] ORDER BY [date])) AS [marketValueDifference], (MAX([date]) OVER (PARTITION BY [ticker])) AS [maxDate]
    FROM [Shares].[Company] AS [c] 
    JOIN [Shares].[Holding] AS [h] ON [h].[companyId] = [c].[Id] 
    JOIN [Shares].[Fund] AS [f] ON [f].[Id] = [h].[fundId]
    WHERE [fundName]='${fundType}' AND [companyId]=${companyId}
    )
    SELECT [fundName],[description],[companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue],[weight],[sharesDifference],[marketValueDifference]
    FROM All_Holding
    WHERE [date]=[maxDate]
    ORDER BY companyID ASC`;

  try {
    await queryDB(query)
      .then((result) => {
        if (result[0] === 200) {
          res.status(200).json(result[1].recordsets);
        } else {
          throw new HttpError("Something went wrong.", result[0]);
        }
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    return next(err);
  }
};

// getCompanies(string fundType) gets list of all companies in a given fund
const getCompanies = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    loggerError(errors, "Invalid input in getCompanies", "httpParams");
    return next(new HttpError("Invalid input", 422));
  }

  const { fundType } = req.query;
  const query = `WITH All_Holding([fundName],[description],[companyId],[companyName],[ticker],[cusip])
    AS (
    SELECT [fundName],[description],[companyId],[companyName],[ticker],[cusip]
    FROM [Shares].[Company] AS [c] 
    JOIN [Shares].[Holding] AS [h] ON [h].[companyId] = [c].[Id] 
    JOIN [Shares].[Fund] AS [f] ON [f].[Id] = [h].[fundId]
    WHERE [fundName]='${fundType}'
    )
    SELECT DISTINCT [fundName],[description],[companyId],[companyName],[ticker],[cusip]
    FROM All_Holding
    ORDER BY companyID ASC`;

  try {
    await queryDB(query)
      .then((result) => {
        if (result[0] === 200) {
          res.status(200).json(result[1].recordsets);
        } else {
          throw new HttpError("Something went wrong.", result[0]);
        }
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    return next(err);
  }
};

// getFundsHoldingByDate([string] fundType, date date) gets cumulative (specified) holdings per ticker by date
const getFundsHoldingByDate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    loggerError(errors, "Invalid input in getFundsHoldingByDate", "httpParams");
    return next(new HttpError("Invalid input", 422));
  }

  const { fundType, date } = req.query;
  const funds = toArray(fundType);

  let formattedDate;
  try {
    await funds.forEach(async function (fund) {
      try {
        await checkFund(fund);
      } catch (err) {
        throw err;
      }
    });
    formattedDate = await checkDate(date);

    let formattedFund = `([fundName] = '${funds[0]}'`;
    const fundLen = funds.length;
    for (var i = 1; i < fundLen; i++) {
      formattedFund += ` OR [fundName] = '${funds[i]}'`;
    }
    formattedFund += ")";

    const query2 =
      `WITH All_Holding([fundName],[description],[companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue],[weight]) AS (SELECT [fundName],[description],[companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue],[weight] FROM [Shares].[Company] AS [c] JOIN [Shares].[Holding] AS [h] ON [h].[companyId] = [c].[Id] JOIN [Shares].[Fund] AS [f] ON [f].[Id] = [h].[fundId]) ` +
      `SELECT [fundName], [description],[companyId],[companyName],[ticker],[cusip],[date],SUM([shares]) AS [shares],SUM([marketValue]) AS [marketValue] FROM All_Holding WHERE [date] = '${formattedDate}' AND ${formattedFund} GROUP BY [fundName],[description],[companyId],[companyName],[ticker],[cusip],[date] ORDER BY [fundName], [companyName] ASC`;
    await queryDB(query2)
      .then((result) => {
        if (result[0] === 200) {
          res.status(200).json(result[1].recordsets[0]);
        } else {
          throw new HttpError("Something went wrong.", result[0]);
        }
      })
      .catch((err) => {
        throw new HttpError("Something went wrong. Couldn't get data", 500);
      });
  } catch (err) {
    return next(err);
  }
};

// getFundHoldingByTicker([string] fundType, string ticker, date fromDate, date toDate) gets each fund's holdings by ticker over a period of time
const getFundHoldingByTicker = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    loggerError(
      errors,
      "Invalid input in getFundHoldingByTicker",
      "httpParams"
    );
    return next(new HttpError("Invalid input", 422));
  }

  const { fundType, ticker, fromDate, toDate } = req.query;
  const funds = toArray(fundType);
  let formattedFromDate;
  let formattedToDate;
  try {
    funds.forEach(async function (fund) {
      try {
        await checkFund(fund);
      } catch {
        return next(new HttpError("Something went wrong", 500));
      }
    });
    formattedFromDate = await checkDate(fromDate);
    formattedToDate = await checkDate(toDate);
    await checkTicker(ticker);

    let formattedFund = `([fundName] = '${funds[0]}'`;
    const fundLen = funds.length;
    for (var i = 1; i < fundLen; i++) {
      formattedFund += ` OR [fundName] = '${funds[i]}'`;
    }
    formattedFund += ")";

    const query =
      `WITH All_Holding([fundName],[description],[companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue],[weight]) AS (SELECT [fundName],[description],[companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue],[weight] FROM [Shares].[Company] AS [c] JOIN [Shares].[Holding] AS [h] ON [h].[companyId] = [c].[Id] JOIN [Shares].[Fund] AS [f] ON [f].[Id] = [h].[fundId]) ` +
      `SELECT [fundName], [description],[companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue] FROM All_Holding WHERE ${formattedFund} AND [ticker] = '${ticker}' AND ([date] BETWEEN '${formattedFromDate}' AND '${formattedToDate}') ORDER BY [date], [fundName] ASC`;
    await queryDB(query)
      .then((result) => {
        if (result[0] === 200) {
          res.status(200).json(result[1].recordsets[0]);
        } else {
          throw new HttpError("Something went wrong.", result[0]);
        }
      })
      .catch((err) => {
        throw new HttpError("Something went wrong. Couldn't get data", 500);
      });
  } catch (err) {
    return next(err);
  }
};

// getChangeByTicker(string ticker, date fromDate, date toDate) gets a tickers cumulative change in shares across all funds
const getChangeByTicker = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    loggerError(errors, "Invalid input in getChangeByTicker", "httpParams");
    return next(new HttpError("Invalid input", 422));
  }

  const { ticker, fromDate, toDate } = req.query;

  let formattedFromDate;
  let formattedToDate;
  try {
    formattedFromDate = await checkDate(fromDate);
    formattedToDate = await checkDate(toDate);
    await checkTicker(ticker);

    const query =
      `WITH All_Holding([companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue]) AS (SELECT [companyId],[companyName],[ticker],[cusip],[date],SUM([shares]) AS [shares],SUM([marketValue]) AS [marketValue] FROM [Shares].[Company] AS [c] JOIN [Shares].[Holding] AS [h] ON [h].[companyId] = [c].[Id] WHERE [date] BETWEEN '${formattedFromDate}' AND '${formattedToDate}' AND [ticker] = '${ticker}' GROUP BY [companyId],[companyName],[ticker],[cusip],[date]) ` +
      `SELECT [companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue], ([shares] - LAG([shares], 1) OVER(ORDER BY [date])) AS [sharesDifference], ([marketValue] - LAG([marketValue], 1) OVER(ORDER BY [date])) AS [marketValueDifference] FROM All_Holding ORDER BY [date] DESC`;
    await queryDB(query)
      .then((result) => {
        if (result[0] === 200) {
          res.status(200).json(result[1].recordsets[0]);
        } else {
          console.log(result);
          throw new HttpError("Something went wrong.", result[0]);
        }
      })
      .catch((err) => {
        throw new HttpError("Something went wrong. Couldn't get data", 500);
      });
  } catch (err) {
    return next(err);
  }
};

////////////////////////////////////////////////////////////////

exports.getFunds = getFunds;
exports.getRecent = getRecent;
exports.getCompanies = getCompanies;
exports.getFundsHoldingByDate = getFundsHoldingByDate;
exports.getFundHoldingByTicker = getFundHoldingByTicker;
exports.getChangeByTicker = getChangeByTicker;
