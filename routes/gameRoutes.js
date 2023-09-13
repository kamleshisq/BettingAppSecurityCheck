const express = require('express');
const Router = express.Router();
const gameController = require('../controller/gameController');


Router.post("/addGame", gameController.addGame);
Router.post("/addxls", gameController.addXlsFIle);
Router.post("/getAllGame", gameController.getAllGame);
Router.post('/getGameByCategory', gameController.getGameByCategory);






module.exports = Router