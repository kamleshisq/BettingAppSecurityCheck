const express = require('express');
const router = express.Router()
const deshboard = require('../controller/deshBoard');
const authController = require("../controller/authorizationController");

//Admin Panal
router.get("/getDeshboardUserManagement", authController.isProtected ,deshboard.dashboardData);

module.exports = router