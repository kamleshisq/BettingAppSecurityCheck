const express = require('express');
const router = express.Router()
const deshboard = require('../controller/deshBoard');

router.get("/getDeshboardUserManagement", deshboard.dashboardData);

module.exports = router