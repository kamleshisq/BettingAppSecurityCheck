const express = require('express');
const router = express.Router();
const viewController = require('./../controller/viewController')
const authController = require('../controller/authorizationController')
const gameController = require("../controller/gameController");


router.use(viewController.url123)

router.get('/adminLogin/', viewController.login);
router.get('/',viewController.userLogin );
router.get('/registration',viewController.registration );
router.get('/API', viewController.APIcall);
router.get('/API2', viewController.APIcall2);


// router.use()
router.get('/admin/userManagement', authController.isProtected, authController.restrictTo("userName"), viewController.userTable);
router.get("/createUSer", authController.isProtected, authController.restrictTo("createDeleteUser"), viewController.createUser);
router.get("/accountStatement", authController.isProtected, authController.restrictTo('accountControl'), viewController.accountStatement);
router.get("/updateUser", authController.isProtected, authController.restrictTo("createDeleteUser"),viewController.updateUser);
router.get("/resetPassword", authController.isProtected, authController.restrictTo("createDeleteUser"), viewController.resetPassword);
router.get("/DebitCredit", authController.isProtected, authController.restrictTo("accountControl"), viewController.getCreditDebitPage);
router.get("/createRole", authController.isProtected, authController.restrictTo("roleController"), viewController.createRole);
router.get("/updateRole", authController.isProtected, authController.restrictTo("roleController"), viewController.getUpdateRolePage);
router.get("/admin/dashboard",  authController.isProtected, authController.restrictTo("dashboard"), viewController.dashboard);
router.get("/inactiveUser", authController.isProtected, authController.restrictTo("userStatus"), viewController.inactiveUser);
router.get("/changeCurrentUserPass", authController.isProtected, viewController.updatePass);
router.get("/changeUserPassword", authController.isProtected, viewController.updateUserPass);
router.get("/admin/reports", authController.isProtected, viewController.ReportPage)
router.get("/admin/gamereport", authController.isProtected, viewController.gameReportPage)
router.get("/admin/useracount", authController.isProtected, viewController.useracount)
router.get("/admin/userhistoryreport", authController.isProtected, viewController.userhistoryreport)
router.get("/admin/plreport", authController.isProtected, viewController.plreport)
router.get("/admin/roleManagement", authController.isProtected, viewController.roleManagement)
router.get("/admin/promotion", authController.isProtected, viewController.getPromotionPage);
router.get("/admin/operation", authController.isProtected, viewController.getoperationsPage);
router.get("/setalment", authController.isProtected, viewController.getSettlementPage);
router.get("/gameanalysis", authController.isProtected, viewController.getGameAnalysisPage);
router.get("/streammanagement", authController.isProtected, viewController.getStreamManagementPage);
router.get("/Notification", authController.isProtected, viewController.getNotificationsPage);
router.get("/admin/casinocontrol", authController.isProtected, viewController.getCasinoControllerPage);
router.get("/pp", viewController.promotion);
router.get('/ALLGAMEFORTESTING', viewController.getAllCasinoPageFOrTEsting);
router.get("/SPORT",gameController.sport ,viewController.getSpoertPage);

//user routs
router.get("/loginUser", authController.isProtected, authController.restrictTo("logOutUser"), viewController.onlineUsers);
router.get("/userDashboard", authController.isProtected, viewController.userdashboard);
router.get("/edit", authController.isProtected, viewController.edit);
router.get("/myAccountStatment", authController.isProtected, viewController.myAccountStatment);

module.exports = router