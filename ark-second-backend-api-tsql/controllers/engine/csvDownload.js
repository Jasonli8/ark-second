const fs = require("fs");
const log4js = require("log4js");
const nodefetch = require("node-fetch");
const fetch = require("fetch-cookie")(nodefetch);

////////////////////////////////////////////////////////////////

const HttpError = require("../../models/http-error");
const csvProcess = require("./csvProcessor");

////////////////////////////////////////////////////////////////

log4js.configure({
  appenders: {
    error: { type: "file", filename: "./logs/error.log" },
    action: { type: "file", filename: "./logs/action.log" },
  },
  categories: { default: { appenders: ["error", "action"], level: process.env.LOG_LEVEL } },
});
const loggerError = log4js.getLogger("error");
const loggerAction = log4js.getLogger("action");

var requestOptions = {
  method: "GET",
  headers: {
    Host: "ark-funds.com",
    "User-Agent": "PostmanRuntime/7.28.0",
  },
  redirect: "follow",
};

////////////////////////////////////////////////////////////////

const csvDownload = async () => {
  loggerAction.info("Beginning scheduled CSV import");
  fetch(
    "https://ark-funds.com/wp-content/fundsiteliterature/csv/ARK_INNOVATION_ETF_ARKK_HOLDINGS.csv",
    requestOptions
  )
    .then((response) => {
      const dest = process.env.CSV_PATH;
      const file = fs.createWriteStream(dest);
      response.body.pipe(file);

      file.on("finish", async function () {
        file.close();
      });

      file.on("error", (err) => {
        fs.unlink(dest);
        loggerError.error(err.message);
        return;
      });
    })
    .catch((err) => {
      loggerError.error(err.message);
    });
};

////////////////////////////////////////////////////////////////

module.exports = csvDownload;