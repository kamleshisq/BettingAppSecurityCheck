const express = require('express');
const route = express.Router()
const sliderController = require('../controller/sliderController');
const authController = require("../controller/authorizationController");


route.post('/createSlider', authController.isProtected, authController.isAdmin, sliderController.createNewSlider);

module.exports = route