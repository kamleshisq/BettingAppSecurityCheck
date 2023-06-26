const express = require('express');
const router = express.Router();
const viewController = require('./../controller/viewController')
const authController = require('../controller/authorizationController')
const gameController = require("../controller/gameController");


router.use(viewController.url123)

router.get('/adminLogin/', viewController.login);
router.get('/userlogin',viewController.userLogin );
router.get('/registration',viewController.registration );

// FOR TESTING API //
router.get('/API', viewController.APIcall);
router.get('/API2', viewController.APIcall2);
router.get("/sportDetails", viewController.getSportList);
router.get("/getCricketData", viewController.getCricketData);
// router.get("/getFootballData", viewController.getFootballData);
router.get("/getMarketDetails", viewController.getmarketDetailsByMarketId);
router.get("/getLiveTv", viewController.getLiveTv);
router.get("/getMarketResult", viewController.getMarketResult);


// router.use()
router.get('/admin/userManagement', authController.isProtected, authController.isAdmin,authController.restrictTo("userName"), viewController.userTable);
router.get("/createUSer", authController.isProtected, authController.restrictTo("createDeleteUser"), viewController.createUser);
router.get("/accountStatement", authController.isProtected, authController.restrictTo('accountControl'), viewController.accountStatement);
router.get("/updateUser", authController.isProtected, authController.restrictTo("createDeleteUser"),viewController.updateUser);
router.get("/resetPassword", authController.isProtected, authController.restrictTo("createDeleteUser"), viewController.resetPassword);
router.get("/DebitCredit", authController.isProtected, authController.restrictTo("accountControl"), viewController.getCreditDebitPage);
router.get("/createRole", authController.isProtected, authController.restrictTo("roleController"), viewController.createRole);
router.get("/updateRole", authController.isProtected, authController.restrictTo("roleController"), viewController.getUpdateRolePage);
router.get("/admin/dashboard",  authController.isProtected, authController.isAdmin,authController.restrictTo("dashboard"), viewController.dashboard);
router.get("/inactiveUser", authController.isProtected, authController.restrictTo("userStatus"), viewController.inactiveUser);
router.get("/changeCurrentUserPass", authController.isProtected, viewController.updatePass);
router.get("/changeUserPassword", authController.isProtected, viewController.updateUserPass);
router.get("/admin/reports", authController.isProtected, authController.isAdmin,viewController.ReportPage)
router.get("/admin/gamereport", authController.isProtected, authController.isAdmin,viewController.gameReportPage)
router.get("/admin/useracount", authController.isProtected, authController.isAdmin,viewController.useracount)
router.get("/admin/userhistoryreport", authController.isProtected, authController.isAdmin,viewController.userhistoryreport)
router.get("/admin/plreport", authController.isProtected, authController.isAdmin,viewController.plreport)
router.get("/admin/roleManagement", authController.isProtected, authController.isAdmin,viewController.roleManagement)
router.get("/admin/promotion", authController.isProtected,authController.isAdmin, viewController.getPromotionPage);
router.get("/admin/houseManagement", authController.isProtected, authController.isAdmin,viewController.getoperationsPage);
router.get("/admin/setalment", authController.isProtected, authController.isAdmin,viewController.getSettlementPage);
router.get("/admin/whiteLableAnalysis", authController.isProtected, authController.isAdmin,viewController.WhiteLabelAnalysis);
router.get("/admin/gameAnalysis", authController.isProtected, authController.isAdmin,viewController.gameAnalysis);
router.get("/admin/streammanagement", authController.isProtected, authController.isAdmin,viewController.getStreamManagementPage);
router.get("/admin/Notification", authController.isProtected, authController.isAdmin,viewController.getNotificationsPage);
router.get("/admin/casinocontrol", authController.isProtected, authController.isAdmin,viewController.getCasinoControllerPage);
router.get("/pp", viewController.promotion);
router.get('/ALLGAMEFORTESTING', authController.isProtected, viewController.getAllCasinoPageFOrTEsting);
router.get("/SPORT",authController.isProtected, gameController.sport ,viewController.getSpoertPage);
router.get("/admin/betmoniter", authController.isProtected, authController.isAdmin, viewController.getBetMoniterPage);
router.get("/admin/voidbet", authController.isProtected, authController.isAdmin, viewController.getVoidBetPage);
router.get("/admin/betlimit", authController.isProtected, authController.isAdmin, viewController.getBetLimitPage);
router.get("/admin/onlineUsers", authController.isProtected, authController.isAdmin, viewController.onlineUsers);
//user routs



router.get("/", authController.isLogin, viewController.userdashboard);
router.get("/exchange_sports/inplay", authController.isLogin, viewController.getExchangePage);
router.get("/exchange_sports/cricket", authController.isProtected, viewController.getCricketpage);
router.get("/exchange_sports/footBall", authController.isProtected, viewController.getFootballData);
router.get("/exchange_sports/tennis", authController.isProtected, viewController.getTennisData);
router.get("/exchange_sports/live_match", authController.isProtected, viewController.getMatchDetailsPage);
router.get("/edit", authController.isProtected, viewController.edit);
router.get("/myAccountStatment", authController.isProtected, viewController.myAccountStatment);

module.exports = router