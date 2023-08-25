const express = require("express")
const Router = express.Router();
const auth = require('../controller/authorizationController');
const kycController = require("../controller/kycControlle");

Router.post('/uploadDoc', auth.isProtected, kycController.uploadphoto);


module.exports = Router