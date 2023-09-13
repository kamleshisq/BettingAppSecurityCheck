const express = require('express');
const route = express.Router()
const sliderController = require('../controller/sliderController');
const authController = require("../controller/authorizationController");

// Admin Panal
route.post('/createSlider', authController.isProtected, authController.isAdmin, sliderController.createNewSlider);
route.post('/addImage', authController.isProtected, authController.isAdmin, sliderController.addImage);
route.post('/editSliderInImage', authController.isProtected, authController.isAdmin, sliderController.editSliderinImage);
route.post('/updateSlider', authController.isProtected, authController.isAdmin, sliderController.updateSlider);

module.exports = route