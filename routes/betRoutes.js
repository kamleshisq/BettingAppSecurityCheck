const express = require('express');
const router = express.Router();
const betController = require("../controller/betController");

router.get("/betListByUserId", betController.getBetListByUser);






module.exports = router;