const fs = require("fs");
const readline = require("readline");

////////////////////////////////////////////////////////////////

const HttpError = require("./components/models/http-error");
const queryDB = require("./components/helpers/queryDB");
const {
  loggerError,
  loggerInfo,
  loggerDebug,
} = require("./components/helpers/logger");

////////////////////////////////////////////////////////////////

const isEmpty = (target) => {
  if (!target || target === "") {
    return true;
  } else {
    return false;
  }
};

const csvRepair = async () => {
  loggerInfo("Starting to repair db with archived csv's.", "csv");

  let ETF;
  try {
    const query1 = "SELECT [Id], [fundName], [csvName] FROM [Shares].[Fund]";
    const result = await queryDB(query1);
    ETF = result[1].recordset;
  } catch (err) {
    loggerError(
      err.message,
      "Failed to get list of files to download in csvDownload",
      "csv"
    );
  }

  try {
    await fs.readdir("../csv/", async function (err, filenames) {
      if (err) {
        throw new Error(err);
      }
      try {
        await filenames.forEach(async function (filename) {
          const dest = "../csv/" + filename;
          if (fs.existsSync(dest)) {
            loggerDebug(`CSV found for ${filename}`, "csv");
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
                  loggerDebug(`Finished ${filename}`, "csv");
                  return;
                } else if (isEmpty(data[0]) || isEmpty(data[1])) {
                  lineNum += 1;
                  console.log("error with line: " + line);
                  console.log("nullFields: " + nullFields);
                  loggerError(
                    null,
                    "Error with the following data: " + line,
                    "csv"
                  );
                  return;
                }
                const fundName = data[1];
                let id;
                for (var fund in ETF) {
                  if (ETF[fund].fundName === fundName) {
                    id = ETF[fund].Id;
                    break;
                  }
                }
                const name = data[2].substr(1, data[2].length - 2);
                const ticker = data[3].indexOf("\"") !== -1 ? data[3].substr(1, data[3].length - 2) : data[3];
                const dateParts = data[0].split("/");
                const date = `'${dateParts[2]}-${dateParts[0]}-${dateParts[1]}'`;
                const query2 =
                  `IF NOT EXISTS (SELECT * FROM [Shares].[Company] WHERE [companyName] = '${name}' AND [ticker] = '${ticker}' AND [cusip] = '${data[4]}') ` +
                  `IF EXISTS (SELECT * FROM [Shares].[Company] WHERE [companyName] = '${name}' OR [ticker] = '${ticker}') ` +
                  `UPDATE [Shares].[Company] SET [companyName] = '${name}', [ticker] = '${ticker}', [cusip] = '${data[4]}' WHERE [companyName] = '${name}' OR [ticker] = '${ticker}' ` +
                  `ELSE INSERT INTO [Shares].[Company]([companyName], [ticker], [cusip]) VALUES ('${name}','${ticker}','${data[4]}')`;
                const query3 =
                  `IF EXISTS (SELECT * FROM [Shares].[Company] AS [c] JOIN [Shares].[Holding] AS [h] ON [c].[Id] = [h].[companyId] JOIN [Shares].[Fund] AS [f] ON [f].[Id] = [h].[fundId] WHERE [companyName] = '${name}' AND [fundName] = '${fundName}' AND [date] = ${date}) ` +
                  `WITH All_Holdings ([companyName], [fundName], [date], [shares], [marketValue], [weight]) AS (SELECT [companyName], [fundName], [date], [shares], [marketValue], [weight] FROM [Shares].[Company] AS [c] JOIN [Shares].[Holding] AS [h] ON [c].[Id] = [h].[companyId] JOIN [Shares].[Fund] AS [f] ON [f].[Id] = [h].[fundId]) ` +
                  `UPDATE All_Holdings SET [shares] = ${data[5]}, [marketValue] = ${data[6]}, [weight] = ${data[7]} WHERE [companyName] = '${name}' AND [fundName] = '${fundName}' AND [date] = ${date} ` +
                  `ELSE WITH All_Holdings ([companyName], [fundName], [date], [shares], [marketValue], [weight]) AS (SELECT [companyName], [fundName], [date], [shares], [marketValue], [weight] FROM [Shares].[Company] AS [c] JOIN [Shares].[Holding] AS [h] ON [c].[Id] = [h].[companyId] JOIN [Shares].[Fund] AS [f] ON [f].[Id] = [h].[fundId]) ` +
                  `INSERT INTO [Shares].[Holding]([companyId], [fundId], [date], [shares], [marketvalue], [weight]) SELECT [c].[Id], ${id}, ${date}, ${data[5]}, ${data[6]}, ${data[7]} FROM [Shares].[Company] AS [c] WHERE [c].[companyName] = '${name}'`;
                try {
                  await queryDB(query2);
                } catch (err) {
                  loggerError(
                    err.message,
                    "Failed a companies insertion test in csvRepair.",
                    "csv"
                  );
                  file.close();
                  file.removeAllListeners();
                  lineNum += 1;
                  throw new HttpError(
                    "Couldn't insert data to companies table",
                    500
                  );
                }
                try {
                  await queryDB(query3);
                } catch (err) {
                  loggerError(
                    err.message,
                    "Failed a holdings insertion test in csvRepair.",
                    "csv"
                  );
                  file.close();
                  file.removeAllListeners();
                  lineNum += 1;
                  throw new HttpError(
                    "Couldn't insert data to holdings table",
                    500
                  );
                }
              }
              lineNum += 1;
            });
          } else {
            loggerInfo(`No CSV available for ${filename}`, "csv");
          }
        });
      } catch (err) {
        throw new Error(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
  loggerInfo("Repairs finished.", "csv");
};

csvRepair();
