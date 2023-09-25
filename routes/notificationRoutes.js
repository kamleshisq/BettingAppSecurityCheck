const express = require('express')
const route = express.Router();
const notificationControl = require('../controller/notificationController');
const authController = require("../controller/authorizationController");


// Admin Panal
route.use(authController.isProtected,  authController.isAdmin);
route.post('/createNotification', notificationControl.createNewNotification);
route.get('/myNotifications', notificationControl.getMyNotification);
route.get('/updateStatus', notificationControl.updateNotificationStatus);
route.get('/deleteNotification', notificationControl.deleteNotification);
module.exports = route