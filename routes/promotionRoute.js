const express = require('express');
const router1 = express.Router()
const authController = require('../controller/authorizationController');
const promotionController = require("../controller/promotionController");


// Admin Panal
router1.post("/createPromotionPosition",authController.isLogin_Admin ,promotionController.createPosition);
router1.post("/UpdatePromotionPosition",authController.isLogin_Admin, promotionController.updatePosition);
router1.post('/deletePosition',authController.isLogin_Admin, promotionController.deletePosition);




module.exports = router1