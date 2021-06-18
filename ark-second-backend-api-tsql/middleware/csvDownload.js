const fs = require("fs");
const nodefetch = require("node-fetch");
const { nextTick } = require("process");
const fetch = require("fetch-cookie")(nodefetch);

////////////////////////////////////////////////////////////////

const HttpError = require("../components/models/http-error");
const {loggerError, loggerInfo} = require("../components/helpers/logger");

////////////////////////////////////////////////////////////////

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
  loggerInfo("Beginning scheduled CSV download", "csv");
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
        loggerError(err.message, "Failed to pipe into local file in csvDownload", "csv");
        return;
      });
    })
    .catch((err) => {
      loggerError(err.message, "Failed to fetch file in csvDownload.", "csv");
      return nextTick(new HttpError("Couldn't download CSV", 500))
    });
};

////////////////////////////////////////////////////////////////

module.exports = csvDownload;