const express = require('express');
const router = express.Router()
const accountController = require('../controller/accountController');
const authController = require("../controller/authorizationController");
const middlewares = require("../middleWares/middleware");
const Usermiddlewares = require("../middleWares/user_middleware");


// User Panal
router.post("/getMyAccStatement",authController.isProtected_User, accountController.getMyAccountStatement);
router.get("/getExposer", authController.isProtected_User,accountController.getexposure);
router.post("/paymentDeposite", authController.isProtected_User,accountController.paymentDeposite);

// Admin Panal
router.use(authController.isProtected, authController.restrictTo('accountControl'))

router.post("/deposit", authController.checkPass ,accountController.deposit);
router.get("/getAllStatement", accountController.getAllAccStatement);
router.post("/withdrawl", authController.checkPass ,accountController.withdrawl);
router.post("/withdrawlSettle", authController.checkPass ,accountController.withdrawSettle);
router.post("/depositSettle", authController.checkPass ,accountController.depositSettle);
router.post("/getUserAccStatement", accountController.getUserAccountStatement);
router.get("/getUserAccStatement1", accountController.getUserAccountStatement1);






module.exports = router