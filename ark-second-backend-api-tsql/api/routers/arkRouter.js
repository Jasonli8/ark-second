const express = require("express");

const router = express.Router();

/////////////////////////////////////////////////////////////////////

const dbController = require('./controllers/dbController');
const finController = require('./controllers/finController');
const authParse = require('../../middleware/authParse');

/////////////////////////////////////////////////////////////////////

/*
db for database routes
fin for yahoo finance routes
*/

// router.use(authParse);

router.get('/db/:fund/holdings/:ticker/new/:order', dbController.getCompanyNew);
router.get('/db/:fund/holdings/:ticker/all/:order', dbController.getCompanyAll);
router.get('/db/:fund/holdings/new/:order', dbController.getFundNew);
router.get('/db/:fund/holdings/all/:order', dbController.getFundAll);
router.get('/db/:fund/companies', dbController.getFundCompanies);
router.get('/db/fund', dbController.getFunds);
router.get('/db', dbController.getDB);

router.get('/fin/history/:ticker/:period/:interval', finController.getHistory);
router.get('/fin/quote/:ticker', finController.getQuote);

/////////////////////////////////////////////////////////////////////

module.exports = router;