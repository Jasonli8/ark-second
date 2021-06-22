const express = require("express");
const bodyParser = require("body-parser");
const schedule = require("node-schedule");
const {loggerError} = require("./components/helpers/logger")

const app = express();

////////////////////////////////////////////////////////////////

const HttpError = require("./components/models/http-error");
const arkRouter = require("./api/routers/arkRouter");
const userRouter = require("./api/routers/userRouter");
const csvDownload = require("./middleware/csvDownload");
const csvProcess = require("./middleware/csvProcessor");
const csvArchive = require("./middleware/csvArchive");

////////////////////////////////////////////////////////////////

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  next();
});

const job = schedule.scheduleJob("*/30 * * * * 1-5", async () => {
  try {
    await csvDownload();
    await csvProcess();
    await csvArchive();
  } catch (err) {
    loggerError(err.message, "App level scheduled CSV job failed.", "csv");
  }
});

app.use("/api", arkRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      loggerError(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});

////////////////////////////////////////////////////////////////

app.listen(process.env.PORT);
