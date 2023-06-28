const express = require('express');
const router = express.Router();
const walletController = require("../controller/walletController")

router.post('/balance', walletController.consoleBodyAndURL, walletController.getUserBalancebyiD);
router.post('/betrequest', walletController.betrequest);
router.post('/resultrequest', walletController.consoleBodyAndURL, walletController.betResult);
router.post('/rollbackrequest', walletController.consoleBodyAndURL, walletController.rollBack)

module.exports = router