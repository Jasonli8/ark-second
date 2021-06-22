const HttpError = require("../../../components/models/http-error");
const queryDB = require("../../../components/helpers/queryDB");
const checkFund = require("../../../components/helpers/checkFund");
const checkDate = require("../../../components/helpers/checkDate");
const checkTicker = require("../../../components/helpers/checkTicker");

////////////////////////////////////////////////////////////////

// getFunds() returns funds
const getFunds = async (req, res, next) => {
  const query =
    "select [f].[fundName], [f].[description] from [Shares].[Fund] as [f]";
  queryDB(query)
    .then((result) => {
      if (result[0] === 200) {
        res.status(200).json(result[1].recordsets);
      } else {
        return next(new HttpError("Something went wrong.", result[0]));
      }
    })
    .catch((err) => {
      return next(
        new HttpError("Something went wrong. Couldn't get data", 500)
      );
    });
};

// getFundsHoldingByDate([string] fundType, date date) gets cumulative (specified) holdings per ticker by date
const getFundsHoldingByDate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input", 422));
  }

  const { fundType, date } = req.body;

  let formattedDate;
  try {
    fundType.forEach(async function (fund) {
      try {
        await checkFund(fund);
      } catch {
        return next(new HttpError("Something went wrong", 500));
      }
    });
    formattedDate = await checkDate(date);
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }

  let formattedFund = `[fundName] = ${fundType[0]}`;
  const fundTypeLen = fundType.len;
  for (var i = 1; i < fundTypeLen; i++) {
    formattedFund += ` OR [fundName] = ${fundType[i]}`
  }

  const query2 =
    `WITH All_Holding([fundName],[description],[companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue],[weight]) AS (SELECT [fundName],[description],[companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue],[weight] FROM [Shares].[Company] AS [c] JOIN [Shares].[Holding] AS [h] ON [h].[companyId] = [c].[Id] JOIN [Shares].[Fund] AS [f] ON [f].[Id] = [h].[fundId]) ` +
    `SELECT [fundName], [description],[companyId],[companyName],[ticker],[cusip],[date],SUM([shares]) AS [shares],SUM([marketValue]) AS [marketValue] FROM All_Holding WHERE [date] = ${formattedDate} AND ${formattedFund} GROUP BY [fundName],[description],[companyId],[companyName],[ticker],[cusip],[date]`;
  queryDB(query2)
    .then((result) => {
      if (result[0] === 200) {
        res.status(200).json(result[1].recordsets);
      } else {
        return next(new HttpError("Something went wrong.", result[0]));
      }
    })
    .catch((err) => {
      return next(
        new HttpError("Something went wrong. Couldn't get data", 500)
      );
    });
};

// getFundHoldingByTicker([string] fundType, string ticker, date fromDate, date toDate) gets each fund's holdings by ticker over a period of time
const getFundHoldingByTicker = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input", 422));
  }

  const { fundType, ticker, fromDate, toDate } = req.body;

  let formattedFromDate;
  let formattedToDate;
  try {
    fundType.forEach(async function (fund) {
      try {
        await checkFund(fund);
      } catch {
        return next(new HttpError("Something went wrong", 500));
      }
    });
    formattedFromDate = await checkDate(fromDate);
    formattedToDate = await checkDate(toDate);
    await checkTicker;
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }

  let formattedFund = `[fundName] = ${fundType[0]}`;
  const fundTypeLen = fundType.len;
  for (var i = 1; i < fundTypeLen; i++) {
    formattedFund += ` OR [fundName] = ${fundType[i]}`
  }

  const query =
    `WITH All_Holding([fundName],[description],[companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue],[weight]) AS (SELECT [fundName],[description],[companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue],[weight] FROM [Shares].[Company] AS [c] JOIN [Shares].[Holding] AS [h] ON [h].[companyId] = [c].[Id] JOIN [Shares].[Fund] AS [f] ON [f].[Id] = [h].[fundId]) ` +
    `SELECT [fundName], [description],[companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue] FROM All_Holding WHERE ${formattedFund} AND [ticker] = ${ticker} AND ([date] BETWEEN ${formattedFromDate} AND ${formattedToDate})`;
  queryDB(query)
    .then((result) => {
      if (result[0] === 200) {
        res.status(200).json(result[1].recordsets[0]);
      } else {
        return next(new HttpError("Something went wrong.", result[0]));
      }
    })
    .catch((err) => {
      return next(
        new HttpError("Something went wrong. Couldn't get data", 500)
      );
    });
};

// getChangeByTicker(string ticker, date fromDate, date toDate) gets a tickers cumulative change in shares across all funds
const getChangeByTicker = async (req, res, next) => {const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input", 422));
  }
  
  const { ticker, fromDate, toDate } = req.body;

  let formattedFromDate;
  let formattedToDate;
  try {
    formattedFromDate = await checkDate(fromDate);
    formattedToDate = await checkDate(toDate);
    await checkTicker;
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }

  const query =
    `WITH All_Holding([companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue]) AS (SELECT [companyId],[companyName],[ticker],[cusip],[date],SUM([shares]) AS [shares],SUM([marketValue]) AS [marketValue] FROM [Shares].[Company] AS [c] JOIN [Shares].[Holding] AS [h] ON [h].[companyId] = [c].[Id] WHERE [date] BETWEEN ${formattedFromDate} AND ${formattedToDate} AND [ticker] = ${ticker} GROUP BY [description],[companyId],[companyName],[ticker],[cusip],[date]) ` +
    `SELECT [companyId],[companyName],[ticker],[cusip],[date], ([shares] - LAG([shares], 1) OVER(ORDER BY [date])) AS [sharesDifference], ([marketValue] - LAG([marketValue], 1) OVER(ORDER BY [date])) AS [marketValueDifference] FROM All_Holding`;
  queryDB(query)
    .then((result) => {
      if (result[0] === 200) {
        res.status(200).json(result[1].recordsets[0]);
      } else {
        return next(new HttpError("Something went wrong.", result[0]));
      }
    })
    .catch((err) => {
      return next(
        new HttpError("Something went wrong. Couldn't get data", 500)
      );
    });
};

////////////////////////////////////////////////////////////////

exports.getFunds = getFunds;
exports.getFundsHoldingByDate = getFundsHoldingByDate;
exports.getFundHoldingByTicker = getFundHoldingByTicker;
exports.getChangeByTicker = getChangeByTicker;

////////////////////////////////////////////////////////////////

// // returns all holdings
// const getDB = async (req, res, next) => {
//   const query =
//     "select [f].[fundName], [f].[description], [c].[companyName], [c].[ticker], [c].[cusip], [h].[date], [h].[shares], [h].[marketValue], [h].[weight] from [Shares].[Fund] as [f] join [Shares].[Holding] as h on [f].[Id] = [h].[fundId] join [Shares].[Company] as [c] on [c].[Id] = [h].[companyId]";
//   queryDB(query)
//     .then((result) => {
//       if (result[0] === 200) {
//         res.status(200).json(result[1].recordsets[0]);
//       } else {
//         return next(new HttpError("Something went wrong.", result[0]));
//       }
//     })
//     .catch((err) => {
//       return next(
//         new HttpError("Something went wrong. Couldn't get data", 500)
//       );
//     });
// };

// // returns companies in funds
// const getFundCompanies = async (req, res, next) => {
//   const fund = req.params.fund;
//   const query = `select [f].[fundName], [f].[description], [c].[companyName], [c].[ticker], [c].[cusip] from [Shares].[Fund] as [f] join [Shares].[Holding] as h on [f].[Id] = [h].[fundId] join [Shares].[Company] as [c] on [c].[Id] = [h].[companyId] where [f].[fundName] = ${fund}`;
//   queryDB(query)
//     .then((result) => {
//       if (result[0] === 200) {
//         res.status(200).json(result[1].recordsets[0]);
//       } else {
//         return next(new HttpError("Something went wrong.", result[0]));
//       }
//     })
//     .catch((err) => {
//       return next(
//         new HttpError("Something went wrong. Couldn't get data", 500)
//       );
//     });
// };

// // returns all holdings in fund
// const getFundAll = async (req, res, next) => {
//   const fund = req.params.fund;
//   const order = req.params.order;
//   const query = `select [f].[fundName], [f].[description], [c].[companyName], [c].[ticker], [c].[cusip], [h].[date], [h].[shares], [h].[marketValue], [h].[weight] from [Shares].[Fund] as [f] join [Shares].[Holding] as h on [f].[Id] = [h].[fundId] join [Shares].[Company] as [c] on [c].[Id] = [h].[companyId] where [f].[fundName] = ${fund} order by [${order}]`;
//   queryDB(query)
//     .then((result) => {
//       if (result[0] === 200) {
//         res.status(200).json(result[1].recordsets[0]);
//       } else {
//         return next(new HttpError("Something went wrong.", result[0]));
//       }
//     })
//     .catch((err) => {
//       return next(
//         new HttpError("Something went wrong. Couldn't get data", 500)
//       );
//     });
// };

// // returns latest holdings in fund
// const getFundNew = async (req, res, next) => {
//   const fund = req.params.fund;
//   const order = req.params.order;
//   const query =
//     `with all_holdings ([fundName],[description],[companyName],[ticker],[cusip],[date],[shares],[marketValue],[weight]) as ( select [f].[fundName], [f].[description], [c].[companyName], [c].[ticker], [c].[cusip], [h].[date], [h].[shares], [h].[marketValue], [h].[weight] from [Shares].[Fund] as [f]  join [Shares].[Holding] as h on [f].[Id] = [h].[fundId]  join [Shares].[Company] as [c] on [c].[Id] = [h].[companyId] ) ` +
//     `select [ah].[fundName], [ah].[description], [ah].[companyName], [ah].[ticker], [ah].[cusip], [ah].[date], [ah].[shares], [ah].[marketValue], [ah].[weight] from [all_holdings] as [ah] ` +
//     `join ( select [ah].[fundName], [ah].[companyName], MAX([ah].[date]) as [maxDate] from [all_holdings] as [ah] group by [ah].[fundName], [ah].[companyName]) as [md] on [md].[fundName] = [ah].[fundName] and [md].[companyName] = [ah].[companyName] ` +
//     `where [ah].[fundName] = ${fund} and [ah].[date] = [md].[maxDate] ` +
//     `order by ${order}`;
//   queryDB(query)
//     .then((result) => {
//       if (result[0] === 200) {
//         res.status(200).json(result[1].recordsets[0]);
//       } else {
//         return next(new HttpError("Something went wrong.", result[0]));
//       }
//     })
//     .catch((err) => {
//       return next(
//         new HttpError("Something went wrong. Couldn't get data", 500)
//       );
//     });
// };

// // returns all holdings in fund for a company
// const getCompanyAll = async (req, res, next) => {
//   const fund = req.params.fund;
//   const order = req.params.order;
//   const ticker = req.params.ticker;
//   const query = `select [f].[fundName], [f].[description], [c].[companyName], [c].[ticker], [c].[cusip], [h].[date], [h].[shares], [h].[marketValue], [h].[weight] from [Shares].[Fund] as [f] join [Shares].[Holding] as h on [f].[Id] = [h].[fundId] join [Shares].[Company] as [c] on [c].[Id] = [h].[companyId] where [f].[fundName] = ${fund} and [c].[ticker] = ${ticker} order by [${order}]`;
//   queryDB(query)
//     .then((result) => {
//       if (result[0] === 200) {
//         res.status(200).json(result[1].recordsets[0]);
//       } else {
//         return next(new HttpError("Something went wrong.", result[0]));
//       }
//     })
//     .catch((err) => {
//       return next(
//         new HttpError("Something went wrong. Couldn't get data", 500)
//       );
//     });
// };

// // returns latest holding in fund for a company
// const getCompanyNew = async (req, res, next) => {
//   const fund = req.params.fund;
//   const order = req.params.order;
//   const ticker = req.params.ticker;
//   const query =
//     `with all_holdings ([fundName],[description],[companyName],[ticker],[cusip],[date],[shares],[marketValue],[weight]) as ( select [f].[fundName], [f].[description], [c].[companyName], [c].[ticker], [c].[cusip], [h].[date], [h].[shares], [h].[marketValue], [h].[weight] from [Shares].[Fund] as [f]  join [Shares].[Holding] as h on [f].[Id] = [h].[fundId]  join [Shares].[Company] as [c] on [c].[Id] = [h].[companyId] ) ` +
//     `select [ah].[fundName], [ah].[description], [ah].[companyName], [ah].[ticker], [ah].[cusip], [ah].[date], [ah].[shares], [ah].[marketValue], [ah].[weight] from [all_holdings] as [ah] ` +
//     `join ( select [ah].[fundName], [ah].[companyName], MAX([ah].[date]) as [maxDate] from [all_holdings] as [ah] group by [ah].[fundName], [ah].[companyName]) as [md] on [md].[fundName] = [ah].[fundName] and [md].[companyName] = [ah].[companyName] ` +
//     `where [ah].[fundName] = ${fund} and [ah].[date] = [md].[maxDate] and [ah].[ticker] = ${ticker} ` +
//     `order by ${order}`;
//   queryDB(query)
//     .then((result) => {
//       if (result[0] === 200) {
//         res.status(200).json(result[1].recordsets[0]);
//       } else {
//         return next(new HttpError("Something went wrong.", result[0]));
//       }
//     })
//     .catch((err) => {
//       return next(
//         new HttpError("Something went wrong. Couldn't get data", 500)
//       );
//     });
// };
