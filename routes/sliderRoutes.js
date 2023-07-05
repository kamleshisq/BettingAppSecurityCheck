const express = require('express');
const route = express.Router()
const sliderController = require('../controller/sliderController');
const authController = require("../controller/authorizationController");


route.post('/createSlider',  sliderController.createNewSlider);

module.exports = route