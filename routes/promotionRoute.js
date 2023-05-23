const express = require('express');
const router = express.Router()
const promotionController = require("../controller/promotionController");

router.post("/createPromotionPosition", promotionController.createPosition)




module.exports = router