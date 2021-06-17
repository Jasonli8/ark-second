const fs = require("fs");
const log4js = require("log4js");

////////////////////////////////////////////////////////////////

log4js.configure({
  appenders: {
    error: { type: "file", filename: "./logs/error.log" },
    action: { type: "file", filename: "./logs/action.log" },
  },
  categories: {
    default: { appenders: ["error", "action"], level: process.env.LOG_LEVEL },
  },
});
const loggerError = log4js.getLogger("error");
const loggerAction = log4js.getLogger("action");

////////////////////////////////////////////////////////////////

const csvArchive = () => {
  if (fs.existsSync(process.env.CSV_PATH)) {
    const currDate = new Date();
    const date = `${currDate.getFullYear()}-${currDate.getMonth()}-${currDate.getDate()}`;
    fs.rename(
      process.env.CSV_PATH,
      `../csv/ARK_INNOVATION_ETF_ARKK_HOLDINGS_${date}.csv`,
      function (err, data) {
        if (err) {
          loggerError.error(err.message + " in csv archiving");
          return;
        }
        loggerAction.info(
          "CSV successfully archived as " +
            `../csv/ARK_INNOVATION_ETF_ARKK_HOLDINGS_${date}.csv`
        );
      }
    );
  }
};

////////////////////////////////////////////////////////////////

module.exports = csvArchive;
