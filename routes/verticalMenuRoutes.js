const express = require('express');
const vertixalMenuController = require("../controller/verticalMenuController");
const authController = require("../controller/authorizationController");
const route = express.Router();

route.post("/createVerticalMenu", authController.isProtected, authController.isAdmin, vertixalMenuController.createVerticalMenu);


module.exports = route