const fs = require("fs");

////////////////////////////////////////////////////////////////

const { loggerError, loggerInfo } = require("../components/helpers/logger");

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
          loggerError(
            err.message,
            "Failed to archive CSV file in csvArchive",
            "csv"
          );
          return;
        }
        loggerInfo(
          "CSV successfully archived as " +
            `../csv/ARK_INNOVATION_ETF_ARKK_HOLDINGS_${date}.csv`,
          "csv"
        );
      }
    );
  }
};

////////////////////////////////////////////////////////////////

module.exports = csvArchive;
