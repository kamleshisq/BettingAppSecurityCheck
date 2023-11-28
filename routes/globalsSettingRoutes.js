const express = require('express');
const Router = express.Router();
const gameController = require('../controller/gameController');
const globalController = require('../controller/globalSettingsController');
const authorizationController = require('../controller/authorizationController');

Router.get('/createCMS', globalController.createData);
Router.post('/updateBasicDetails', authorizationController.isProtected , globalController.updateBasicDetails);

module.exports = Router


