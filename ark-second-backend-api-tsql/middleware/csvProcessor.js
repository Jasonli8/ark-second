const fs = require("fs");
const readline = require("readline");

////////////////////////////////////////////////////////////////

const HttpError = require("../components/models/http-error");
const queryDB = require("../components/helpers/queryDB");
const { loggerError, loggerInfo, loggerDebug } = require("../components/helpers/logger");

////////////////////////////////////////////////////////////////

const isEmpty = (target) => {
  if (!target || target === "") {
    return true;
  } else {
    return false;
  }
};

const csvProcess = async () => {
  loggerInfo("Starting to process current CSV.", "csv");
  let ETF;
  try {
    const query = "SELECT [Id], [fundName], [csvName] FROM [Shares].[Fund]";
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
    const dest = `../csv/${fund.csvName}.csv`;
    if (fs.existsSync(dest)) {
      loggerDebug(`CSV found for ${fund.csvName}`, "csv");
      const file = readline.createInterface({
        input: fs.createReadStream(dest),
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
            loggerDebug(`Finished ${fund.csvName}`, "csv")
            return;
          } else if (isEmpty(data[0]) || isEmpty(data[1])) {
            lineNum += 1;
            console.log("error with line: " + line);
            console.log("nullFields: " + nullFields);
            loggerError(null, "Error with the following data: " + line, "csv");
            return;
          }
          const name = data[2].substr(1, data[2].length - 2);
          const dateParts = data[0].split("/");
          const date = `'${dateParts[2]}-${dateParts[0]}-${dateParts[1]}'`;
          const query1 =
            `IF NOT EXISTS (SELECT * FROM [Shares].[Company] WHERE [companyName] = '${name}' AND [ticker] = '${data[3]}' AND [cusip] = '${data[4]}') ` +
            `IF EXISTS (SELECT * FROM [Shares].[Company] WHERE [companyName] = '${name}' OR [ticker] = '${data[3]}') ` +
            `UPDATE [Shares].[Company] SET [companyName] = '${name}', [ticker] = '${data[3]}', [cusip] = '${data[4]}' WHERE [companyName] = '${name}' OR [ticker] = '${data[3]}' ` +
            `ELSE INSERT INTO [Shares].[Company]([companyName], [ticker], [cusip]) VALUES ('${name}','${data[3]}','${data[4]}')`;
          const query2 =
            `IF EXISTS (SELECT * FROM [Shares].[Company] AS [c] JOIN [Shares].[Holding] AS [h] ON [c].[Id] = [h].[companyId] JOIN [Shares].[Fund] AS [f] ON [f].[Id] = [h].[fundId] WHERE [companyName] = '${name}' AND [fundName] = '${fund.fundName}' AND [date] = ${date}) ` +
            `WITH All_Holdings ([companyName], [fundName], [date], [shares], [marketValue], [weight]) AS (SELECT [companyName], '${fund.fundName}', [date], [shares], [marketValue], [weight] FROM [Shares].[Company] AS [c] JOIN [Shares].[Holding] AS [h] ON [c].[Id] = [h].[companyId] JOIN [Shares].[Fund] AS [f] ON [f].[Id] = [h].[fundId]) ` +
            `UPDATE All_Holdings SET [shares] = ${data[5]}, [marketValue] = ${data[6]}, [weight] = ${data[7]} WHERE [companyName] = '${name}' AND [fundName] = '${fund.fundName}' AND [date] = ${date} ` +
            `ELSE WITH All_Holdings ([companyName], [fundName], [date], [shares], [marketValue], [weight]) AS (SELECT [companyName], '${fund.fundName}', [date], [shares], [marketValue], [weight] FROM [Shares].[Company] AS [c] JOIN [Shares].[Holding] AS [h] ON [c].[Id] = [h].[companyId] JOIN [Shares].[Fund] AS [f] ON [f].[Id] = [h].[fundId]) ` +
            `INSERT INTO [Shares].[Holding]([companyId], [fundId], [date], [shares], [marketvalue], [weight]) SELECT [c].[Id], ${fund.Id}, ${date}, ${data[5]}, ${data[6]}, ${data[7]} FROM [Shares].[Company] AS [c] WHERE [c].[companyName] = '${name}'`;
          try {
            await queryDB(query1);
          } catch (err) {
            loggerError(
              err.message,
              "Failed a companies insertion test in csvProcessor.",
              "csv"
            );
            file.close();
            file.removeAllListeners();
            lineNum += 1;
            throw new HttpError("Couldn't insert data to companies table", 500);
          }
          try {
            await queryDB(query2);
          } catch (err) {
            loggerError(
              err.message,
              "Failed a holdings insertion test in csvProcessor.",
              "csv"
            );
            file.close();
            file.removeAllListeners();
            lineNum += 1;
            throw new HttpError("Couldn't insert data to holdings table", 500);
          }
        }
        lineNum += 1;
      });
    } else {
      loggerInfo(`No CSV available for ${fund.csvName}`, "csv");
    }
  })
  loggerInfo("Finishing to process current CSV.", "csv");
};

module.exports = csvProcess;
