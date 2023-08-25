const express = require('express');
const router = express.Router()
const pagesController = require("../controller/pagesController");
const authController = require("../controller/authorizationController");

router.post("/createPage", authController.isProtected, authController.isAdmin, pagesController.createPage);



module.exports = router