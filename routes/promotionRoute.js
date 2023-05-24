const express = require('express');
const router1 = express.Router()
const promotionController = require("../controller/promotionController");

router1.post("/createPromotionPosition", promotionController.createPosition)




module.exports = router1