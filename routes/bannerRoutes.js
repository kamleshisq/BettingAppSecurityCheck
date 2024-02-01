const express = require('express');
const route = express.Router();
const bannerController = require("../controller/bannerController");
const authController = require("../controller/authorizationController");
const middlewares = require("../middleWares/middleware");
const Usermiddlewares = require("../middleWares/user_middleware");

// Admin Panal
// route.use(middlewares)
route.post("/createBanner", authController.isProtected, authController.isAdmin, bannerController.createBanner);
route.post("/createMedia", authController.isProtected, authController.isAdmin, bannerController.createMedia);
route.post("/updateBanner", authController.isProtected, authController.isAdmin, bannerController.updateBanner);


module.exports = route