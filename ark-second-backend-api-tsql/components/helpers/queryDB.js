const sql = require("mssql");

////////////////////////////////////////////////////////////////

const { loggerError, loggerDebug } = require("./logger");

////////////////////////////////////////////////////////////////

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
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

////////////////////////////////////////////////////////////////

// returns an array with status code and queried data if available
const queryDB = async (query) => {
  loggerDebug("Querying request called: " + query, "dbReq")
  await poolConnect;
  try {
    result = await pool.request().query(query);
    return [200, result];
  } catch (err) {
    loggerError(err.message, "Following querying request failed: " + query, "dbReq");
    return [500];
  }
};

////////////////////////////////////////////////////////////////

module.exports = queryDB;