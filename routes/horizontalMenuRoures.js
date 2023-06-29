const express = require("express");
const routes = express.Router();
const horizontalMenuController = require("../controller/horizontalMenuController");
const authController =  require("../controller/authorizationController");


routes.post("/createMenu",  horizontalMenuController.createHorizontalMenu);


module.exports = routes