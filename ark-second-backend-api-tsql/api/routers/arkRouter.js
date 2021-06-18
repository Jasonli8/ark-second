const express = require("express");
const dbController = require('./controllers/dbController');
const finController = require('./controllers/finController');
const authParse = require('../../middleware/authParse');

const router = express.Router();

/////////////////////////////////////////////////////////////////////

/*
db for database routes
fin for yahoo finance routes
*/

// router.use(authParse);

router.get('/db/companies', dbController.getCompanies);
router.get('/db/shares', dbController.getShares);
router.get('/db/market_value', dbController.getMarketValue);
router.get('/db/weighting', dbController.getWeight);
router.get('/db/today', dbController.getToday);
router.get('/db', dbController.getDB);

router.get('/fin/history/:ticker/:period/:interval', finController.getHistory);
router.get('/fin/quote/:ticker', finController.getQuote);

/////////////////////////////////////////////////////////////////////

module.exports = router;