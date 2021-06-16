const sql = require("mssql");
const log4js = require("log4js");

////////////////////////////////////////////////////////////////

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: "localhost\\ARKSECOND",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(sqlConfig);
const poolConnect = pool.connect();

log4js.configure({
  appenders: {
    queryDB: { type: "file", filename: "./logs/error.log" },
  },
  categories: { default: { appenders: ["queryDB"], level: process.env.LOG_LEVEL } },
});
const logger = log4js.getLogger("queryDB");

////////////////////////////////////////////////////////////////

// returns an array with status code and queried data if available
const queryDB = async (query) => {
  await poolConnect;
  try {
    result = await pool.request().query(query);
    return [200, result];
  } catch (err) {
    logger.error(err.message + " for " + query);
    return [500];
  }
};

////////////////////////////////////////////////////////////////

module.exports = queryDB;