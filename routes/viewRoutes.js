const express = require('express');
const router = express.Router();
const viewController = require('./../controller/viewController')
const authController = require('../controller/authorizationController')
const gameController = require("../controller/gameController");
const notificationController =  require("../controller/notificationController");




router.get('/adminLogin/',authController.isLogin ,viewController.login);
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
router.get("/admin/settlement", authController.isProtected, authController.isAdmin,viewController.getSettlementPage);
router.get("/admin/settlementIn", authController.isProtected, authController.isAdmin,viewController.getSettlementPageIn);
router.get("/admin/settlementHistory", authController.isProtected, authController.isAdmin,viewController.getSettlementHistoryPage);
router.get("/admin/commissionReport", authController.isProtected, authController.isAdmin,viewController.getCommissionReport);
router.get("/admin/whiteLableAnalysis", authController.isProtected, authController.isAdmin,viewController.WhiteLabelAnalysis);
router.get("/admin/gameAnalysis", authController.isProtected, authController.isAdmin,viewController.gameAnalysis);
router.get("/admin/streammanagement", authController.isProtected, authController.isAdmin,viewController.getStreamManagementPage);
router.get("/admin/Notification", authController.isProtected, authController.isAdmin,viewController.getNotificationsPage);
router.get("/admin/casinocontrol", authController.isProtected, authController.isAdmin,viewController.getCasinoControllerPage);
router.get("/pp", viewController.promotion);
router.get('/ALLGAMEFORTESTING', authController.isProtected, viewController.getAllCasinoPageFOrTEsting);
router.get("/SPORT",authController.isProtected, gameController.sport ,viewController.getSpoertPage);
router.get("/admin/betmoniter", authController.isProtected, authController.isAdmin, viewController.getBetMoniterPage);
router.get("/admin/alertbet", authController.isProtected, authController.isAdmin, viewController.getBetAlertPage);
router.get("/admin/voidbet", authController.isProtected, authController.isAdmin, viewController.getVoidBetPage);
router.get("/admin/betlimit", authController.isProtected, authController.isAdmin, viewController.getBetLimitPage);
router.get("/admin/onlineUsers", authController.isProtected, authController.isAdmin, viewController.onlineUsers);
router.get("/admin/liveMarket", authController.isProtected, authController.isAdmin, viewController.getLiveMarketsPage);
router.get("/admin/cms", authController.isProtected, authController.isAdmin, viewController.getCmsPage);
router.get("/admin/pageManager", authController.isProtected, authController.isAdmin, viewController.getPageManagement);
router.get("/admin/gameRules", authController.isProtected, authController.isAdmin, viewController.gameRulesPage);
router.get("/admin/userdetails", authController.isProtected, authController.isAdmin, viewController.userDetailsAdminSide);
router.get("/admin/catalogcontrol", authController.isProtected, authController.isAdmin,viewController.getCatalogControllerPage);
router.get("/admin/commissionMarkets", authController.isProtected, authController.isAdmin, viewController.CommissionMarkets)
router.get("/admin/catalogcontrol/compitations", authController.isProtected, authController.isAdmin,viewController.getCatalogCompetationControllerPage);
router.get("/admin/catalogcontrol/compitations/events", authController.isProtected, authController.isAdmin,viewController.getCatalogeventsControllerPage);

//user routs


//Real??
router.get("/", authController.isLogin, notificationController.myNotifications ,viewController.userdashboard);
router.get('/exchange', authController.isLogin, notificationController.myNotifications ,viewController.getUserExchangePage);
router.get('/exchange/cricket', authController.isLogin, notificationController.myNotifications ,viewController.cricketPage);
router.get('/exchange/football', authController.isLogin, notificationController.myNotifications ,viewController.footBallPage);
router.get('/exchange/tennis', authController.isLogin, notificationController.myNotifications ,viewController.TennisPage);
router.get('/exchange/inPlay', authController.isLogin, notificationController.myNotifications ,viewController.inplayMatches);
router.get("/allCards", authController.isLogin, notificationController.myNotifications ,viewController.cardsPage);
router.get("/slots", authController.isLogin, notificationController.myNotifications ,viewController.cardsPage);
router.get("/Royal_casino", authController.isLogin, notificationController.myNotifications ,viewController.royalGamingPage);
router.get("/virtuals", authController.isLogin, notificationController.myNotifications ,viewController.virtualsPage);
router.get("/OtherGames", authController.isLogin, notificationController.myNotifications ,viewController.OthersGames);
router.get("/cards", authController.isProtected, notificationController.myNotifications ,viewController.getCardInplayGame);
router.get("/Royal_casinoInplay", authController.isProtected, notificationController.myNotifications ,viewController.getCardInplayGame);
router.get("/live_casinoInPlay", authController.isProtected, notificationController.myNotifications ,viewController.getCardInplayGame);
router.get("/virtualsInPlay", authController.isProtected, notificationController.myNotifications ,viewController.getCardInplayGame);
router.get("/premium_sports", authController.isProtected, notificationController.myNotifications ,viewController.getSportBookGame);
router.get('/MyPlStatement', authController.isProtected, notificationController.myNotifications ,viewController.userPlReports );
router.get("/exchange_inPlay/match", authController.isLogin, notificationController.myNotifications ,viewController.getExchangePageIn);
router.get("/exchange/multimarkets", authController.isLogin, notificationController.myNotifications ,viewController.multimarkets);
router.get("/live_casino", authController.isLogin, notificationController.myNotifications ,viewController.getLiveCasinoPage);
router.get("/mybets", authController.isProtected, notificationController.myNotifications ,viewController.getMyBetsPageUser);
router.get("/myGameReport", authController.isProtected, notificationController.myNotifications ,viewController.getGameReportPageUser);
router.get("/event", authController.isProtected, notificationController.myNotifications ,viewController.getGameReportInPageUser);
router.get("/gameReport/match", authController.isProtected, notificationController.myNotifications ,viewController.getGameReportInINPageUser);
router.get("/myAccountStatment", authController.isProtected, notificationController.myNotifications ,viewController.myAccountStatment);
router.get("/myCommissionReports", authController.isProtected, notificationController.myNotifications ,viewController.getCommissionReportUserSide);
router.get("/myProfile", authController.isProtected, notificationController.myNotifications ,viewController.myProfile);
router.get("/profile", authController.isProtected, notificationController.myNotifications ,viewController.getMyProfileUser);
router.get("/Kyc", authController.isProtected, notificationController.myNotifications ,viewController.getMyKycPage);



//Testing//
// router.get("/exchange_sports/inplay", authController.isLogin, viewController.getExchangePage);
// router.get("/exchange_sports/cricket", authController.isProtected, viewController.getCricketpage);
// router.get("/exchange_sports/footBall", authController.isProtected, viewController.getFootballData);
// router.get("/exchange_sports/tennis", authController.isProtected, viewController.getTennisData);
// router.get("/exchange_sports/live_match", authController.isProtected, viewController.getMatchDetailsPage);
// router.get("/edit", authController.isProtected, viewController.edit);

module.exports = router