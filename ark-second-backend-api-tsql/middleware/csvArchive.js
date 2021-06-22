const fs = require("fs");

////////////////////////////////////////////////////////////////

const queryDB = require("../components/helpers/queryDB");
const { loggerError, loggerInfo } = require("../components/helpers/logger");

////////////////////////////////////////////////////////////////

const csvArchive = async () => {
  console.log("Beginning scheduled CSV archive");
  let ETF;
  try {
    const query = "SELECT [csvName] FROM [Shares].[Fund]";
    const result = await queryDB(query);
    ETF = result[1].recordset;
    console.log(ETF);
  } catch (err) {
    loggerError(
      err.message,
      "Failed to get list of files to download in csvDownload",
      "csv"
    );
  }

  ETF.forEach(async function (fund) {
    if (fs.existsSync(`../csv/${fund.csvName}.csv`)) {
      const currDate = new Date();
      const date = `${currDate.getFullYear()}-${currDate.getMonth()}-${currDate.getDate()}`;
      fs.rename(
        `../csv/${fund.csvName}.csv`,
        `../csv/${fund.csvName}_${date}.csv`,
        function (err, data) {
          if (err) {
            loggerError(
              err.message,
              `Failed to archive CSV file ${fund.csvName} in csvArchive`,
              "csv"
            );
            return;
          }
          loggerInfo(
            "CSV successfully archived as " +
              `../csv/${fund.csvName}_${date}.csv`,
            "csv"
          );
        }
      );
    }
  })
  console.log("Finishing scheduled CSV archive");
};

////////////////////////////////////////////////////////////////

module.exports = csvArchive;
