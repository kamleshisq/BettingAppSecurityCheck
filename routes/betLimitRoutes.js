const express = require('express');
const authController = require('./../controller/authorizationController')
const betLimtController = require('./../controller/betController')
const router = express.Router();

router.post('/createBetLimit',authController.isProtected,betLimtController.getBetListByUser)

module.exports = router