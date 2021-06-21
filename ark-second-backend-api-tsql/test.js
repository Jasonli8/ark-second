const queryDB = require("./components/helpers/queryDB")

const test = async () => {
    let ETF;
    try {
      const query = 'SELECT [csvName] FROM [Shares].[Fund]'
      const result = queryDB(query);
      ETF = result[1].recordset[0];
    } catch (err) {
        console.log(err.message);
    }
    console.log(ETF);
}

test();