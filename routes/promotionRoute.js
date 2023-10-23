const express = require('express');
const router1 = express.Router()
const promotionController = require("../controller/promotionController");


// Admin Panal
router1.post("/createPromotionPosition", promotionController.createPosition);
router1.post("/UpdatePromotionPosition", promotionController.updatePosition);
router1.post('/deletePosition', promotionController.deletePosition);




module.exports = router1