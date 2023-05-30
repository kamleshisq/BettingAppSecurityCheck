const express = require('express');
const router = express.Router();
const walletController = require("../controller/walletController")

router.post('/balance', walletController.consoleBodyAndURL, walletController.getUserBalancebyiD)


module.exports = router