const env = require("dotenv").config({path: "./environment/.env"});
const express = require("express");
const bodyParser = require("body-parser");
const schedule = require("node-schedule");
const {loggerError} = require("./components/helpers/logger")

const app = express();

////////////////////////////////////////////////////////////////

const HttpError = require("./components/models/http-error");
const arkRouter = require("./api/routers/arkRouter");
const userRouterNoAuth = require("./api/routers/userRouterNoAuth");
const userRouterAuth = require("./api/routers/userRouterAuth")
const csvDownload = require("./middleware/csvDownload");
const csvProcess = require("./middleware/csvProcessor");
const csvArchive = require("./middleware/csvArchive");

////////////////////////////////////////////////////////////////

const job = schedule.scheduleJob("0 0 */2 * * 1-5", async () => {
  try {
    await csvDownload();
    await csvProcess();
    await csvArchive();
  } catch (err) {
    loggerError(err.message, "App level scheduled CSV job failed.", "csv");
  }
});

////////////////////////////////////////////////////////////////

if (env.error) {
  throw result.error;
}

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/user", userRouterNoAuth);
app.use("/user", userRouterAuth);
app.use("/api", arkRouter);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  console.log(error)
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(error)
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
