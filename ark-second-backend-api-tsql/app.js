const express = require("express");
const bodyParser = require("body-parser");
const schedule = require("node-schedule");
const log4js = require("log4js");

const app = express();

////////////////////////////////////////////////////////////////

const HttpError = require("./models/http-error");
const arkRouter = require("./routers/arkRouter");
const userRouter = require("./routers/userRouter");
const csvDownload = require("./controllers/engine/csvDownload");
const csvProcess = require("./controllers/engine/csvProcessor");

////////////////////////////////////////////////////////////////

log4js.configure({
  appenders: {
    scheduledJob: { type: "file", filename: "./logs/error.log" },
  },
  categories: { default: { appenders: ["scheduledJob"], level: process.env.LOG_LEVEL } },
});
const logger = log4js.getLogger("scheduledJob");

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

const job = schedule.scheduleJob("0 0 * * * 1-5", async () => {
  try {
    await csvDownload();
    await csvProcess();
  } catch (err) {
    logger.error("Scheduled task failed: CSV download and processing");
    logger.error(err.message);
  }
});

app.use("/api", arkRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

////////////////////////////////////////////////////////////////

app.listen(process.env.PORT);
