const express = require('express');
const authController = require('./../controller/authorizationController')
const betLimtController = require('./../controller/betlimitsController')
const router = express.Router();

router.post('/createBetLimit', authController.isProtected,betLimtController.createBetlimit);
router.post('/update',authController.isProtected,betLimtController.updateBetLimit);

module.exports = router