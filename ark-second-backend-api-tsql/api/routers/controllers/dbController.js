const queryDB = require("../../../components/helpers/queryDB");

////////////////////////////////////////////////////////////////

const HttpError = require("../../../components/models/http-error");

////////////////////////////////////////////////////////////////

// returns all holdings
const getDB = async (req, res, next) => {
  const query =
    "select [f].[fundName], [f].[description], [c].[companyName], [c].[ticker], [c].[cusip], [h].[date], [h].[shares], [h].[marketValue], [h].[weight] from [Shares].[Fund] as [f] join [Shares].[Holding] as h on [f].[Id] = [h].[fundId] join [Shares].[Company] as [c] on [c].[Id] = [h].[companyId]";
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

// returns funds
const getFunds = async (req, res, next) => {
  const query =
    "select [f].[fundName], [f].[description] from [Shares].[Fund] as [f]";
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

// returns companies in funds
const getFundCompanies = async (req, res, next) => {
  const fund = req.params.fund;
  const query = `select [f].[fundName], [f].[description], [c].[companyName], [c].[ticker], [c].[cusip] from [Shares].[Fund] as [f] join [Shares].[Holding] as h on [f].[Id] = [h].[fundId] join [Shares].[Company] as [c] on [c].[Id] = [h].[companyId] where [f].[fundName] = ${fund}`;
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

// returns all holdings in fund
const getFundAll = async (req, res, next) => {
  const fund = req.params.fund;
  const order = req.params.order;
  const query = `select [f].[fundName], [f].[description], [c].[companyName], [c].[ticker], [c].[cusip], [h].[date], [h].[shares], [h].[marketValue], [h].[weight] from [Shares].[Fund] as [f] join [Shares].[Holding] as h on [f].[Id] = [h].[fundId] join [Shares].[Company] as [c] on [c].[Id] = [h].[companyId] where [f].[fundName] = ${fund} order by [${order}]`;
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

// returns latest holdings in fund
const getFundNew = async (req, res, next) => {
  const fund = req.params.fund;
  const order = req.params.order;
  const query =
    `with all_holdings ([fundName],[description],[companyName],[ticker],[cusip],[date],[shares],[marketValue],[weight]) as ( select [f].[fundName], [f].[description], [c].[companyName], [c].[ticker], [c].[cusip], [h].[date], [h].[shares], [h].[marketValue], [h].[weight] from [Shares].[Fund] as [f]  join [Shares].[Holding] as h on [f].[Id] = [h].[fundId]  join [Shares].[Company] as [c] on [c].[Id] = [h].[companyId] ) ` +
    `select [ah].[fundName], [ah].[description], [ah].[companyName], [ah].[ticker], [ah].[cusip], [ah].[date], [ah].[shares], [ah].[marketValue], [ah].[weight] from [all_holdings] as [ah] ` +
    `join ( select [ah].[fundName], [ah].[companyName], MAX([ah].[date]) as [maxDate] from [all_holdings] as [ah] group by [ah].[fundName], [ah].[companyName]) as [md] on [md].[fundName] = [ah].[fundName] and [md].[companyName] = [ah].[companyName] ` +
    `where [ah].[fundName] = ${fund} and [ah].[date] = [md].[maxDate] ` +
    `order by ${order}`;
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

// returns all holdings in fund for a company
const getCompanyAll = async (req, res, next) => {
  const fund = req.params.fund;
  const order = req.params.order;
  const ticker = req.params.ticker;
  const query = `select [f].[fundName], [f].[description], [c].[companyName], [c].[ticker], [c].[cusip], [h].[date], [h].[shares], [h].[marketValue], [h].[weight] from [Shares].[Fund] as [f] join [Shares].[Holding] as h on [f].[Id] = [h].[fundId] join [Shares].[Company] as [c] on [c].[Id] = [h].[companyId] where [f].[fundName] = ${fund} and [c].[ticker] = ${ticker} order by [${order}]`;
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

// returns latest holding in fund for a company
const getCompanyNew = async (req, res, next) => {
  const fund = req.params.fund;
  const order = req.params.order;
  const ticker = req.params.ticker;
  const query =
    `with all_holdings ([fundName],[description],[companyName],[ticker],[cusip],[date],[shares],[marketValue],[weight]) as ( select [f].[fundName], [f].[description], [c].[companyName], [c].[ticker], [c].[cusip], [h].[date], [h].[shares], [h].[marketValue], [h].[weight] from [Shares].[Fund] as [f]  join [Shares].[Holding] as h on [f].[Id] = [h].[fundId]  join [Shares].[Company] as [c] on [c].[Id] = [h].[companyId] ) ` +
    `select [ah].[fundName], [ah].[description], [ah].[companyName], [ah].[ticker], [ah].[cusip], [ah].[date], [ah].[shares], [ah].[marketValue], [ah].[weight] from [all_holdings] as [ah] ` +
    `join ( select [ah].[fundName], [ah].[companyName], MAX([ah].[date]) as [maxDate] from [all_holdings] as [ah] group by [ah].[fundName], [ah].[companyName]) as [md] on [md].[fundName] = [ah].[fundName] and [md].[companyName] = [ah].[companyName] ` +
    `where [ah].[fundName] = ${fund} and [ah].[date] = [md].[maxDate] and [ah].[ticker] = ${ticker} ` +
    `order by ${order}`;
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

exports.getDB = getDB;
exports.getFunds = getFunds;
exports.getFundCompanies = getFundCompanies;
exports.getFundAll = getFundAll;
exports.getFundNew = getFundNew;
exports.getCompanyAll = getCompanyAll;
exports.getCompanyNew = getCompanyNew;
