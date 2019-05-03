var express = require('express');
var router = express.Router();
var Stellar = require('../controller/operations');
var Mable = require('../controller/marble');
const logger = require('../../util/logger');


const USER_ORG = process.env.USER


function appendHeader(res) {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Content-Security-Policy', "script-src 'self'");
}
//######################################################################
//######################################################################
//######################################################################
//######################################################################


router.post('/stellar/create/account', function (req, res, next) {
  console.log(`/stellar/create/account`);

  new Stellar().createAccount(req.body).then((result) => {
    res.status(200);
    //appendHeader(res)
    res.json(result)

  })
});

router.post('/stellar/create/payment', function (req, res, next) {
  console.log(`/stellar/create/payment`);

  new Stellar().createPayment(req.body).then((result) => {
    res.status(200);
    //appendHeader(res)
    res.json(result)

  })
});

router.post('/stellar/check/balances', function (req, res, next) {
  console.log('/stellar/check/balances');

  new Stellar().checkBalances(req.body).then((result) => {
    res.status(200);
    //appendHeader(res)
    res.json(result)

  })
});

router.post('/blockchain/transfer/marble', function (req, res, next) {
  var functionName = '[TransferMarble]'

  console.log('/blockchain/transfer/marble');

  new Mable(USER_ORG).transferMarble(req.body).then((result) => {
    res.status(200);
    //appendHeader(res)
    res.json(result)

  }).catch((error) => {
    logger.error(`${functionName} Failed to Transfer Marble: ${error.error.message}`);
    res.status(error.error.status);
    res.json({
      code: error.error.status,
      message: `Failed to Transfer Marble: ${error.error.message}`
    });
  });
});

router.post('/blockchain/create/marble', function (req, res, next) {
  var functionName = '[CreateMarble]'
  console.log('/blockchain/create/marble');
  logger.debug(`Use Enrollment ID of the blockchain user : ${USER_ORG}`)
  new Mable(USER_ORG).createMarble(req.body).then((result) => {
    res.status(200);
    appendHeader(res)
    res.json(result)

  })
    .catch((error) => {
      logger.error(`${functionName} Failed to Create Marble: ${error.error.message}`);
      res.status(error.error.status);
      res.json({
        code: error.error.status,
        message: `Failed to Create Marble: ${error.error.message}`
      });
    });
});

router.get('/blockchain/getmarble/:marble_id',function (req, res, next) {
  let functionName = '[API: GET/blockchain/<id>]'
  new Mable(USER_ORG).GetMarbleByID(req.params.marble_id).then((result) => {
    res.status(200);
    // appendHeader(res)
    res.json(result);

  })
    .catch((error) => {
      logger.error(`${functionName} Error getting info Marble : ${error.error.message}`);
      res.status(error.error.status);
      res.json({
        code: error.error.status,
        message: `Error getting info CcrDocument By Key Fields: ${error.error.message}`
      });
    });
});

module.exports = router;
