const express = require('express');
const router = express.Router();
const walletController = require("../controller/walletController")


// User Panal
router.post('/balance', walletController.consoleBodyAndURL, walletController.getUserBalancebyiD);
router.post('/betrequest', walletController.consoleBodyAndURL, walletController.betrequest);
router.post('/resultrequest',  walletController.betResult);
router.post('/rollbackrequest', walletController.consoleBodyAndURL, walletController.rollBack);

module.exports = router