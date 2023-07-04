const express = require('express');
const router = express.Router()
const pagesController = require("../controller/pagesController");
const authController = require("../controller/authorizationController");

router.post("/createPage",  pagesController.createPage);



module.exports = router