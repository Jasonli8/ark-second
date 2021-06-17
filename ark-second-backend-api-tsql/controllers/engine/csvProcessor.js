const fs = require("fs");
const readline = require("readline");
const log4js = require("log4js");

////////////////////////////////////////////////////////////////

const HttpError = require("../../models/http-error");
const queryDB = require("./queryDB");

////////////////////////////////////////////////////////////////

log4js.configure({
  appenders: {
    cvsProcessor: { type: "file", filename: "./logs/error.log" },
  },
  categories: {
    default: { appenders: ["cvsProcessor"], level: process.env.LOG_LEVEL },
  },
});
const logger = log4js.getLogger("cvsProcessor");

////////////////////////////////////////////////////////////////

const isEmpty = (target) => {
  if (!target || target === "") {
    return true;
  } else {
    return false;
  }
};

const csvProcess = async () => {
  if (fs.existsSync(process.env.CSV_PATH)) {
    const file = readline.createInterface({
      input: fs.createReadStream(process.env.CSV_PATH),
      output: process.stdout,
      terminal: false,
    });
  
    let lineNum = 1;
    file.on("line", async (line) => {
      if (lineNum !== 1) {
        const data = line.split(",");
        let nullFields = 0;
        for (let i = 0; i < 8; i++) {
          if (isEmpty(data[i])) {
            nullFields++;
          }
        }
        if (nullFields === 8) {
          file.close();
          file.removeAllListeners();
          lineNum += 1;
          console.log("end of data");
          return;
        } else if (isEmpty(data[0]) || isEmpty(data[1])) {
          lineNum += 1;
          console.log("error with line: " + line);
          console.log("nullFields: " + nullFields);
          logger.error("Error with the following data: " + line);
          return;
        }
        const name = data[2].substr(1, data[2].length - 2);
        const dateParts = data[0].split("/");
        const date = `'${dateParts[2]}-${dateParts[0]}-${dateParts[1]}'`;
        const query1 =
          `IF NOT EXISTS (SELECT * FROM [Shares].[Companies] WHERE [companyname] = '${name}' AND [ticker] = '${data[3]}' AND [cusip] = '${data[4]}') ` +
          `IF EXISTS (SELECT * FROM [Shares].[Companies] WHERE [companyname] = '${name}' OR [ticker] = '${data[3]}') ` +
          `UPDATE [Shares].[Companies] SET [companyname] = '${name}', [ticker] = '${data[3]}', [cusip] = '${data[4]}' WHERE [companyname] = '${name}' OR [ticker] = '${data[3]}' ` +
          `ELSE INSERT INTO [Shares].[Companies]([companyname], [ticker], [cusip]) VALUES ('${name}','${data[3]}','${data[4]}')`;
        const query2 =
          `IF EXISTS (SELECT * FROM [Shares].[Companies] AS [c] JOIN [Shares].[Holdings] AS [h] ON [c].[companyid] = [h].[companyid] WHERE [c].[companyname] = '${name}' AND [h].[date] = ${date}) ` +
          `UPDATE [Shares].[Holdings] SET [shares] = ${data[5]}, [marketvalue] = ${data[6]}, [weight] = ${data[7]} WHERE (SELECT [c].[companyname] FROM [Shares].[Companies] AS [c] WHERE [c].[companyid] = [Shares].[Holdings].[companyid]) = '${name}' AND [date] = ${date} ` +
          `ELSE INSERT INTO [Shares].[Holdings]([companyid], [date], [shares], [marketvalue], [weight]) SELECT [c].[companyid], ${date}, ${data[5]}, ${data[6]}, ${data[7]} FROM [Shares].[Companies] AS [c] WHERE [c].[companyname] = '${name}'`;
        try {
          await queryDB(query1);
        } catch (err) {
          logger.error(err.message + " in company insertion");
          file.close();
          file.removeAllListeners();
          lineNum += 1;
          throw new HttpError("Couldn't insert data to companies table", 500);
        }
        try {
          await queryDB(query2);
        } catch (err) {
          logger.error(err.message + " in holdings insertion");
          file.close();
          file.removeAllListeners();
          lineNum += 1;
          throw new HttpError("Couldn't insert data to holdings table", 500);
        }
      }
      lineNum += 1;
    });
  }
};

module.exports = csvProcess;
