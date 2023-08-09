const express = require("express");
const routes = express.Router();
const authController = require("../controller/authorizationController");
const houseController = require("../controller/housefundController");

routes.post("/addFund", authController.isProtected, houseController.addfund);

module.exports = routes