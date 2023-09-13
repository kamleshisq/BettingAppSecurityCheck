const express = require('express');
const route = express.Router();
const bannerController = require("../controller/bannerController");
const authController = require("../controller/authorizationController");


// Admin Panal
route.post("/createBanner", authController.isProtected, authController.isAdmin, bannerController.createBanner);
route.post("/updateBanner", authController.isProtected, authController.isAdmin, bannerController.updateBanner);


module.exports = route