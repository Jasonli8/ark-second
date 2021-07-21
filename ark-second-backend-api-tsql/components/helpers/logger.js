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
    httpParams: {
      type: "file",
      filename: "./logs/httpParams.log",
    },
    error: {
      type: "file",
      filename: "./logs/error.log",
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
    httpParams: {
      appenders: ["httpParams"],
      level: process.env.LOG_LEVEL,
    },
    error: {
      appenders: ["error"],
      level: process.env.LOG_LEVEL,
    },
  },
});

////////////////////////////////////////////////////////////////

const loggerError = (err, aside, type) => {
  const logger = log4js.getLogger(type);
  logger.error(aside);
  logger.error(err);
};

const loggerInfo = (aside, type) => {
  const logger = log4js.getLogger(type);
  logger.info(aside);
};

const loggerDebug = (aside, type) => {
  const logger = log4js.getLogger(type);
  logger.debug(aside);
};

////////////////////////////////////////////////////////////////

exports.loggerError = loggerError;
exports.loggerInfo = loggerInfo;
exports.loggerDebug = loggerDebug;
