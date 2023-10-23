const express = require("express")
const Router = express.Router();
const auth = require('../controller/authorizationController');
const kycController = require("../controller/kycControlle");

// User Panal
Router.post('/uploadDoc', auth.isProtected_User, kycController.uploadphoto);


module.exports = Router