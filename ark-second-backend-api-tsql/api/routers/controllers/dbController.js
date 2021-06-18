const queryDB = require("../../../components/helpers/queryDB");

////////////////////////////////////////////////////////////////

const HttpError = require("../../../components/models/http-error");

////////////////////////////////////////////////////////////////

// returns all the data from db
const getDB = async (req, res, next) => {
  const query =
    "select [c].[companyid], [c].[companyname], [c].[ticker], [c].[cusip], [h].[date], [h].[shares], [h].[marketvalue], [h].[weight] from [Shares].[Companies] as c join [Shares].[Holdings] as h on c.companyid = h.companyid";
  queryDB(query).then(result => {
    if (result[0] === 200) {
      res.status(200).json(result[1].recordsets[0])
    } else {
      return next(new HttpError("Something went wrong.", result[0]))
    }
  }).catch(err => {
    return next(new HttpError("Something went wrong. Couldn't get data", 500));
  });
};

// returns all companies
const getCompanies = async (req, res, next) => {
  const query =
    "select [c].[companyid], [c].[companyname], [c].[ticker], [c].[cusip] from [Shares].[Companies] as c";
  queryDB(query).then(result => {
    if (result[0] === 200) {
      res.status(200).json(result[1].recordsets[0])
    } else {
      return next(new HttpError("Something went wrong.", result[0]))
    }
  }).catch(err => {
    return next(new HttpError("Something went wrong. Couldn't get data", 500));
  });
};

// returns all companies and shares per today
const getShares = async (req, res, next) => {
  const query =
    "select [c].[companyid], [c].[companyname], [c].[ticker], [c].[cusip], [h].[date], [h].[shares] from [Shares].[Companies] as c join [Shares].[Holdings] as h on [c].[companyid] = [h].[companyid] where [h].[date] = (select top (1) MAX([h].[date]) over() from [Shares].[Holdings] as h)";
  queryDB(query).then(result => {
    if (result[0] === 200) {
      res.status(200).json(result[1].recordsets[0])
    } else {
      return next(new HttpError("Something went wrong.", result[0]))
    }
  }).catch(err => {
    return next(new HttpError("Something went wrong. Couldn't get data", 500));
  });
};

// returns all companies and market value today
const getMarketValue = async (req, res, next) => {
  const query =
    "select [c].[companyid], [c].[companyname], [c].[ticker], [c].[cusip], [h].[date], [h].[marketvalue] from [Shares].[Companies] as c join [Shares].[Holdings] as h on [c].[companyid] = [h].[companyid] where [h].[date] = (select top (1) MAX([h].[date]) over() from [Shares].[Holdings] as h)";
  queryDB(query).then(result => {
    if (result[0] === 200) {
      res.status(200).json(result[1].recordsets[0])
    } else {
      return next(new HttpError("Something went wrong.", result[0]))
    }
  }).catch(err => {
    return next(new HttpError("Something went wrong. Couldn't get data", 500));
  });
};

// returns all companies and weight today
const getWeight = async (req, res, next) => {
  const query =
    "select [c].[companyid], [c].[companyname], [c].[ticker], [c].[cusip], [h].[date], [h].[weight] from [Shares].[Companies] as c join [Shares].[Holdings] as h on [c].[companyid] = [h].[companyid] where [h].[date] = (select top (1) MAX([h].[date]) over() from [Shares].[Holdings] as h)";
  queryDB(query).then(result => {
    if (result[0] === 200) {
      res.status(200).json(result[1].recordsets[0])
    } else {
      return next(new HttpError("Something went wrong.", result[0]))
    }
  }).catch(err => {
    return next(new HttpError("Something went wrong. Couldn't get data", 500));
  });
};

// returns all data from today
const getToday = async (req, res, next) => {
  const query =
    "select [c].[companyid], [c].[companyname], [c].[ticker], [c].[cusip], [h].[date], [h].[shares], [h].[marketvalue], [h].[weight] from [Shares].[Companies] as c join [Shares].[Holdings] as h on [c].[companyid] = [h].[companyid] where [h].[date] = (select top (1) MAX([h].[date]) over() from [Shares].[Holdings] as h)";
  queryDB(query).then(result => {
    if (result[0] === 200) {
      res.status(200).json(result[1].recordsets[0])
    } else {
      return next(new HttpError("Something went wrong.", result[0]))
    }
  }).catch(err => {
    return next(new HttpError("Something went wrong. Couldn't get data", 500));
  });
};

// returns difference between all data between 2 dates --
// const getDB = async (req, res, next) => {
//   const query =
//     "select [c].[companyid], [c].[companyname], [c].[ticker], [c].[cusip], [h].[date], [h].[shares], [h].[marketvalue], [h].[weight] from [Shares].[Companies] as c join [Shares].[Holdings] as h on c.companyid = h.companyid";
//   queryDB(query).then(result => {
//     if (result[0] === 200) {
//       res.status(200).json(JSON.stringify(result[1].recordsets[0]))
//     } else {
//       res.status(result[0]);
//     }
//   }).catch(err => {
//     res.status(500);
//   });
// };

// returns all data for a specified company --
// const getDB = async (req, res, next) => {
//   const query =
//     "select [c].[companyid], [c].[companyname], [c].[ticker], [c].[cusip], [h].[date], [h].[shares], [h].[marketvalue], [h].[weight] from [Shares].[Companies] as c join [Shares].[Holdings] as h on c.companyid = h.companyid";
//   queryDB(query).then(result => {
//     if (result[0] === 200) {
//       res.status(200).json(JSON.stringify(result[1].recordsets[0]))
//     } else {
//       res.status(result[0]);
//     }
//   }).catch(err => {
//     res.status(500);
//   });
// };

// returns difference between all data for a specified company between 2 dates --
// const getDB = async (req, res, next) => {
//   const query =
//     "select [c].[companyid], [c].[companyname], [c].[ticker], [c].[cusip], [h].[date], [h].[shares], [h].[marketvalue], [h].[weight] from [Shares].[Companies] as c join [Shares].[Holdings] as h on c.companyid = h.companyid";
//   queryDB(query).then(result => {
//     if (result[0] === 200) {
//       res.status(200).json(JSON.stringify(result[1].recordsets[0]))
//     } else {
//       res.status(result[0]);
//     }
//   }).catch(err => {
//     res.status(500);
//   });
// };

////////////////////////////////////////////////////////////////

exports.getDB = getDB;
exports.getCompanies = getCompanies;
exports.getShares = getShares;
exports.getMarketValue = getMarketValue;
exports.getWeight = getWeight;
exports.getToday = getToday;
