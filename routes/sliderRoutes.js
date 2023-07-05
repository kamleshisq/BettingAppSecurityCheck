const express = require('express');
const route = express.Router()
const sliderController = require('../controller/sliderController');
const authController = require("../controller/authorizationController");


route.post('/createSlider',  sliderController.createNewSlider);
route.post('/addImage', authController.isProtected, authController.isAdmin, sliderController.addImage);

module.exports = route