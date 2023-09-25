const express = require('express');
const authController = require('./../controller/authorizationController')
const betLimtController = require('./../controller/betlimitsController')
const middlewares = require("../middleWares/middleware");
const Usermiddlewares = require("../middleWares/user_middleware");
const router = express.Router();



// Admin Panal
router.post('/createBetLimit', authController.isProtected,betLimtController.createBetlimit);
router.post('/update',authController.isProtected,betLimtController.updateBetLimit);

module.exports = router