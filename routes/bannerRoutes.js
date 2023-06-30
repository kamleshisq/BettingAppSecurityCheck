const express = require('express');
const route = express.Router();
const bannerController = require("../controller/bannerController");
const authController = require("../controller/authorizationController");


route.post("/createBanner", authController.isProtected, authController.isAdmin, bannerController.createBanner);


module.exports = route