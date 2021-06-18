const log4js = require("log4js");

////////////////////////////////////////////////////////////////

log4js.configure({
  appenders: {
    csv: {
      type: "file",
      category: ["csv"],
      filename: "./logs/csv.log",
    },
    auth: {
      type: "file",
      category: ["auth"],
      filename: "./logs/auth.log",
    },
    dbReq: {
      type: "file",
      category: ["dbReq"],
      filename: "./logs/dbReq.log",
    },
    finReq: {
      type: "file",
      category: ["finReq"],
      filename: "./logs/finReq.log",
    },
  },
  categories: {
    default: {
      appenders: ["csv", "auth", "dbReq", "finReq"],
      level: process.env.LOG_LEVEL,
    },
  },
});

////////////////////////////////////////////////////////////////

const loggerError = (err, aside, type) => {
  const logger = log4js.getLogger(type);
  logger.error(aside);
  if (err) {
    logger.error(err);
  }
};

const loggerInfo = (aside, type) => {
  const logger = log4js.getLogger(type);
  logger.error(aside);
};

////////////////////////////////////////////////////////////////

exports.loggerError = loggerError;
exports.loggerInfo = loggerInfo;
