const log4js = require("log4js");

////////////////////////////////////////////////////////////////

log4js.configure({
  appenders: {
    csv: {
      type: "file",
      filename: "./logs/csv.log",
    },
    auth: {
      type: "file",
      filename: "./logs/auth.log",
    },
    dbReq: {
      type: "file",
      filename: "./logs/dbReq.log",
    },
    finReq: {
      type: "file",
      filename: "./logs/finReq.log",
    },
  },
  categories: {
    default: {
      appenders: ["csv"],
      level: process.env.LOG_LEVEL,
    },
    auth: {
      appenders: ["auth"],
      level: process.env.LOG_LEVEL,
    },
    dbReq: {
      appenders: ["dbReq"],
      level: process.env.LOG_LEVEL,
    },
    finReq: {
      appenders: ["finReq"],
      level: process.env.LOG_LEVEL,
    },
  },
});

const csvLog = log4js.getLogger("csv");
const authLog = log4js.getLogger("auth");
const dbReqLog = log4js.getLogger("dbReq");
const finReqLog = log4js.getLogger("finReq");
////////////////////////////////////////////////////////////////

const loggerError = (err, aside, type) => {
  switch (type) {
    case "csv":
      csvLog.error(aside);
      if (err) {
        csvLog.error(err);
      }
    case "auth":
      authLog.error(aside);
      if (err) {
        authLog.error(err);
      }
    case "dbReq":
      dbReqLog.error(aside);
      if (err) {
        dbReqLog.error(err);
      }
    case "finReq":
      finReqLog.error(aside);
      if (err) {
        finReqLog.error(err);
      }
  }
};

const loggerInfo = (aside, type) => {
  switch (type) {
    case "csv":
      csvLog.info(aside);
    case "auth":
      authLog.info(aside);
    case "dbReq":
      dbReqLog.info(aside);
    case "finReq":
      finReqLog.info(aside);
  }
};

const loggerDebug = (aside, type) => {
  switch (type) {
    case "csv":
      csvLog.debug(aside);
    case "auth":
      authLog.debug(aside);
    case "dbReq":
      dbReqLog.debug(aside);
    case "finReq":
      finReqLog.debug(aside);
  }
};

////////////////////////////////////////////////////////////////

exports.loggerError = loggerError;
exports.loggerInfo = loggerInfo;
exports.loggerDebug = loggerDebug;
