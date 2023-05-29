const express = require('express');
const router = express.Router();
const viewController = require('./../controller/viewController')
const authController = require('../controller/authorizationController')

router.get('/', viewController.login);
router.get('/userLogin',viewController.userLogin );
router.get('/registration',viewController.registration );
router.get('/API', viewController.APIcall);
router.get('/API2', viewController.APIcall2);


// router.use()
router.get('/userManagement', authController.isProtected, authController.restrictTo("userName"), viewController.userTable);
router.get("/createUSer", authController.isProtected, authController.restrictTo("createDeleteUser"), viewController.createUser);
router.get("/accountStatement", authController.isProtected, authController.restrictTo('accountControl'), viewController.accountStatement);
router.get("/updateUser", authController.isProtected, authController.restrictTo("createDeleteUser"),viewController.updateUser);
router.get("/resetPassword", authController.isProtected, authController.restrictTo("createDeleteUser"), viewController.resetPassword);
router.get("/DebitCredit", authController.isProtected, authController.restrictTo("accountControl"), viewController.getCreditDebitPage);
router.get("/createRole", authController.isProtected, authController.restrictTo("roleController"), viewController.createRole);
router.get("/updateRole", authController.isProtected, authController.restrictTo("roleController"), viewController.getUpdateRolePage);
router.get("/dashboard",  authController.isProtected, authController.restrictTo("dashboard"), viewController.dashboard);
router.get("/inactiveUser", authController.isProtected, authController.restrictTo("userStatus"), viewController.inactiveUser);
router.get("/changeCurrentUserPass", authController.isProtected, viewController.updatePass);
router.get("/changeUserPassword", authController.isProtected, viewController.updateUserPass);
router.get("/reports", authController.isProtected, viewController.ReportPage)
router.get("/gamereport", authController.isProtected, viewController.gameReportPage)
router.get("/useracount", authController.isProtected, viewController.useracount)
router.get("/userhistoryreport", authController.isProtected, viewController.userhistoryreport)
router.get("/plreport", authController.isProtected, viewController.plreport)
router.get("/roleManagement", authController.isProtected, viewController.roleManagement)
router.get("/promotion", authController.isProtected, viewController.getPromotionPage);
router.get("/operation", authController.isProtected, viewController.getoperationsPage);
router.get("/setalment", authController.isProtected, viewController.getSettlementPage);
router.get("/gameanalysis", authController.isProtected, viewController.getGameAnalysisPage);
router.get("/streammanagement", authController.isProtected, viewController.getStreamManagementPage);
router.get("/Notification", authController.isProtected, viewController.getNotificationsPage);
router.get("/casinocontrol", authController.isProtected, viewController.getCasinoControllerPage);
router.get("/pp", viewController.promotion);

//user routs
router.get("/loginUser", authController.isProtected, authController.restrictTo("logOutUser"), viewController.onlineUsers);
router.get("/userDashboard", authController.isProtected, viewController.userdashboard);
router.get("/edit", authController.isProtected, viewController.edit);
router.get("/myAccountStatment", authController.isProtected, viewController.myAccountStatment);

module.exports = router