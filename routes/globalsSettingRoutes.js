const express = require('express');
const Router = express.Router();
const gameController = require('../controller/gameController');
const globalController = require('../controller/globalSettingsController');

Router.get('/createCMS', globalController.createData);

module.exports = Router


