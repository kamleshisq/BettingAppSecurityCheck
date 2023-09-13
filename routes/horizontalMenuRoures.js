const express = require("express");
const routes = express.Router();
const horizontalMenuController = require("../controller/horizontalMenuController");
const authController =  require("../controller/authorizationController");


// Admin Panal
routes.post("/createMenu", authController.isProtected, authController.isAdmin ,horizontalMenuController.createHorizontalMenu);
routes.post("/updateMenu", authController.isProtected, authController.isAdmin, horizontalMenuController.updateHorizontalMenu);


module.exports = routes