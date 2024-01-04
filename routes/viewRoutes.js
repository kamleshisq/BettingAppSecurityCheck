const express = require('express');
const router = express.Router();
const viewController = require('./../controller/viewController')
const authController = require('../controller/authorizationController')
const gameController = require("../controller/gameController");
const notificationController =  require("../controller/notificationController");




router.get('/adminLogin/',authController.checkAdmin_isLogin ,viewController.login);
router.get('/sdmlogin/',authController.checksdm_isLogin ,viewController.login);
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
router.get("/htmlDATA", viewController.getHTMLSCOREIFRm);
router.get('/liveMarkets', viewController.liveAllMarkets)
router.get('/liveAllMarkets2', viewController.liveAllMarkets2)
router.post('/getFancyBookDATA', viewController.getFancyBookDATA)

// Admin Panal 

router.get('/admin/userManagement', authController.checkHouse, authController.isAdmin, viewController.userTable);
router.get('/admin/allOperators', authController.checkHouse, authController.isAdmin,authController.restrictTo("userName"), viewController.allOperators);
router.get("/createUSer", authController.checkHouse, authController.restrictTo("createDeleteUser"), viewController.createUser);
router.get("/accountStatement", authController.checkHouse, authController.restrictTo('accountControl'), viewController.accountStatement);
router.get("/updateUser", authController.checkHouse, authController.restrictTo("createDeleteUser"),viewController.updateUser);
router.get("/resetPassword", authController.checkHouse, authController.restrictTo("createDeleteUser"), viewController.resetPassword);
router.get("/DebitCredit", authController.checkHouse, authController.restrictTo("accountControl"), viewController.getCreditDebitPage);
router.get("/createRole", authController.checkHouse, authController.restrictTo("roleController"), viewController.createRole);
router.get("/updateRole", authController.checkHouse, authController.restrictTo("roleController"), viewController.getUpdateRolePage);
router.get("/admin/dashboard",  authController.checkHouse, authController.isAdmin,authController.restrictTo("dashboard"), viewController.dashboard);
router.get("/inactiveUser", authController.checkHouse, authController.restrictTo("userStatus"), viewController.inactiveUser);
router.get("/changeCurrentUserPass", authController.checkHouse, viewController.updatePass);
router.get("/changeUserPassword", authController.checkHouse, viewController.updateUserPass);
router.get("/admin/reports", authController.checkHouse, authController.isAdmin,viewController.ReportPage)
router.get("/admin/gamereport", authController.checkHouse, authController.isAdmin,viewController.gameReportPage)
router.get("/admin/gamereport/match", authController.checkHouse, authController.isAdmin,viewController.gameReportPageByMatch)
router.get("/admin/gamereport/match/market", authController.checkHouse, authController.isAdmin,viewController.gameReportPageByMatchByMarket)
router.get("/admin/gamereport/match/market/report", authController.checkHouse, authController.isAdmin,viewController.gameReportPageFinal)
router.get("/admin/myaccount", authController.checkHouse, authController.isAdmin,viewController.myaccount)
router.get("/admin/adminaccount", authController.checkHouse, authController.isAdmin,viewController.adminaccount)
router.get("/admin/useraccount", authController.checkHouse, authController.isAdmin,viewController.useracount)
router.get("/admin/userhistoryreport", authController.checkHouse, authController.isAdmin,viewController.userhistoryreport)
router.get("/admin/plreport", authController.checkHouse, authController.isAdmin,viewController.plreport)
router.get("/admin/roleManagement", authController.checkHouse, authController.isAdmin,viewController.roleManagement)
router.get("/admin/promotion", authController.checkHouse,authController.isAdmin, viewController.getPromotionPage);
router.get("/admin/houseManagement", authController.checkHouse, authController.isAdmin, authController.restrictToOperator("HouseManagement"),viewController.getoperationsPage);
router.get("/admin/settlement", authController.checkHouse, authController.isAdmin, authController.restrictToOperator("settlements"),viewController.getSettlementPage);
router.get("/admin/settlementIn", authController.checkHouse, authController.isAdmin, authController.restrictToOperator("settlements"),viewController.getSettlementPageIn);
router.get("/admin/settlementHistory", authController.checkHouse, authController.isAdmin, authController.restrictToOperator("settlements"),viewController.getSettlementHistoryPage);
router.get("/admin/commissionReport", authController.checkHouse, authController.isAdmin,viewController.getCommissionReport);
router.get("/admin/commissionReportEvent", authController.checkHouse, authController.isAdmin,viewController.getcommissionMarketWise1);
router.get("/admin/downlinecommissionReort", authController.checkHouse, authController.isAdmin,viewController.getSportwisedownlinecommreport);
router.get("/admin/uplinecommissionReport", authController.checkHouse, authController.isAdmin,viewController.getSportwiseuplinecommreport);
router.get("/admin/commissionReportUser", authController.checkHouse, authController.isAdmin,viewController.getcommissionUser);
router.get("/admin/whiteLableAnalysis", authController.checkHouse, authController.isAdmin, authController.restrictToOperator("whiteLabelAnalysis"),viewController.WhiteLabelAnalysis);
router.get("/admin/gameanalysis", authController.checkHouse, authController.isAdmin, authController.restrictToOperator("gameAnalysis"),viewController.gameAnalysis);
router.get("/admin/streammanagement", authController.checkHouse, authController.isAdmin,viewController.getStreamManagementPage);
router.get("/admin/streammanagement/event", authController.checkHouse, authController.isAdmin,viewController.getStreamEventListPage);
router.get("/admin/Notification", authController.checkHouse, authController.isAdmin,  authController.restrictToOperator("notification"),viewController.getNotificationsPage);
router.get("/admin/casinocontrol", authController.checkHouse, authController.isAdmin,viewController.getCasinoControllerPage);
router.get('/ALLGAMEFORTESTING', authController.checkHouse, viewController.getAllCasinoPageFOrTEsting);
router.get("/SPORT",authController.checkHouse, gameController.sport ,viewController.getSpoertPage);
router.get("/admin/betmoniter", authController.checkHouse, authController.isAdmin, authController.restrictToOperator("betsMonitaring"),viewController.getBetMoniterPage);
router.get("/admin/alertbet", authController.checkHouse, authController.isAdmin, authController.restrictToOperator("alertBets") ,viewController.getBetAlertPage);
router.get("/admin/voidbet", authController.checkHouse, authController.isAdmin, authController.restrictToOperator("voidBets"), viewController.getVoidBetPage);
router.get("/admin/betlimit", authController.checkHouse, authController.isAdmin, authController.restrictToOperator("betLimits"), viewController.getBetLimitPage);
router.get("/admin/betlimit/sport", authController.checkHouse, authController.isAdmin, authController.restrictToOperator("betLimits"), viewController.getSportBetLimit);
router.get("/admin/betlimit/sports", authController.checkHouse, authController.isAdmin, authController.restrictToOperator("betLimits"), viewController.getBetLimitSportWise);
router.get("/admin/betlimit/sports/event", authController.checkHouse, authController.isAdmin, authController.restrictToOperator("betLimits"), viewController.getBetLimitMatchWise);
router.get("/admin/betlimit/sports/match", authController.checkHouse, authController.isAdmin, authController.restrictToOperator("betLimits"), viewController.getBetLimitMatch);
router.get("/admin/onlineUsers", authController.checkHouse, authController.isAdmin, authController.restrictToOperator("onlineUsers"),viewController.onlineUsers);
router.get("/admin/liveMarket", authController.checkHouse, authController.isAdmin, viewController.getLiveMarketsPage);
router.get("/admin/cms", authController.checkHouse, authController.isAdmin, viewController.getCmsPage);
router.get("/admin/pageManager", authController.checkHouse, authController.isAdmin, viewController.getPageManagement);
router.get("/admin/gameRules", authController.checkHouse, authController.isAdmin, viewController.gameRulesPage);
router.get("/admin/userdetails", authController.checkHouse, authController.isAdmin, viewController.userDetailsAdminSide);
router.get("/admin/profiledetail", authController.checkHouse, authController.isAdmin, viewController.profile);
router.get("/admin/catalogcontrol", authController.checkHouse, authController.isAdmin,viewController.getCatalogControllerPage);
router.get("/admin/commissionMarkets", authController.checkHouse, authController.isAdmin, authController.restrictToOperator("commissionMarkets"),viewController.CommissionMarkets)
router.get("/admin/catalogcontrol/compitations", authController.checkHouse, authController.isAdmin,viewController.getCatalogCompetationControllerPage);
router.get("/admin/catalogcontrol/compitations/events", authController.checkHouse, authController.isAdmin,viewController.getCatalogeventsControllerPage);
router.get("/admin/eventcontrol", authController.checkHouse, authController.isAdmin,viewController.getEventControllerPage);
router.get("/admin/riskAnalysis", authController.checkHouse, authController.isAdmin,viewController.RiskAnalysis);
router.get("/admin/matchBets", authController.checkHouse, authController.isAdmin,viewController.marketBets);
router.get("/admin/paymentmethods", authController.checkHouse, authController.isAdmin,viewController.paymentMethodPage);
router.get("/admin/paymentapproval", authController.checkHouse, authController.isAdmin,viewController.paymentApprovalPage);
router.get("/admin/withdrawalRequest", authController.checkHouse, authController.isAdmin,viewController.getWithrowReqPage);
router.get("/admin/globalSettings", authController.checkHouse, authController.isAdmin,viewController.getGlobalSetting);

//User Panal
router.get("/", authController.isLogin, notificationController.myNotifications ,viewController.userdashboard);
// router.get("/homepageWithoutLogin", authController.isLogin, notificationController.myNotifications ,viewController.userdashboard222);
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
router.get("/cards", authController.isProtected_User, notificationController.myNotifications ,viewController.getCardInplayGame);
router.get("/Royal_casinoInplay", authController.isProtected_User, notificationController.myNotifications ,viewController.getCardInplayGame);
router.get("/live_casinoInPlay", authController.isProtected_User, notificationController.myNotifications ,viewController.getCardInplayGame);
router.get("/virtualsInPlay", authController.isProtected_User, notificationController.myNotifications ,viewController.getCardInplayGame);
router.get("/premium_sports", authController.isProtected_User, notificationController.myNotifications ,viewController.getSportBookGame);
router.get('/MyPlStatement', authController.isProtected_User, notificationController.myNotifications ,viewController.userPlReports );
router.get("/exchange_inPlay/match", authController.isLogin, notificationController.myNotifications ,viewController.getExchangePageIn);
router.get("/exchange/multimarkets", authController.isLogin, notificationController.myNotifications ,viewController.multimarkets);
router.get("/live_casino", authController.isLogin, notificationController.myNotifications ,viewController.getLiveCasinoPage);
router.get("/mybets", authController.isProtected_User, notificationController.myNotifications ,viewController.getMyBetsPageUser);
router.get("/myGameReport", authController.isProtected_User, notificationController.myNotifications ,viewController.getGameReportPageUser);
router.get("/event", authController.isProtected_User, notificationController.myNotifications ,viewController.getGameReportInPageUser);
router.get("/gameReport/match", authController.isProtected_User, notificationController.myNotifications ,viewController.getGameReportInINPageUser);
router.get("/myAccountStatment", authController.isProtected_User, notificationController.myNotifications ,viewController.myAccountStatment);
router.get("/withdrawalRequest", authController.isProtected_User, notificationController.myNotifications ,viewController.myWithrowReq);
router.get("/myCommissionReports", authController.isProtected_User, notificationController.myNotifications ,viewController.getCommissionReportUserSide);
router.get("/myCommissionReportsIn", authController.isProtected_User, notificationController.myNotifications ,viewController.getCommissionReporIntUserSide);
router.get("/myCommissionReportsInEvent", authController.isProtected_User, notificationController.myNotifications ,viewController.getCommissionReporEvent);
router.get("/myCommissionReportsMatch", authController.isProtected_User, notificationController.myNotifications ,viewController.getCommissionReporMatch);
router.get("/myProfile", authController.isProtected_User, notificationController.myNotifications ,viewController.myProfile);
router.get("/profile", authController.isProtected_User, notificationController.myNotifications ,viewController.getMyProfileUser);
router.get("/manageAccounts", authController.isProtected_User, notificationController.myNotifications ,viewController.getManagementAccount);
router.get("/Kyc", authController.isProtected_User, notificationController.myNotifications ,viewController.getMyKycPage);



//Testing//
// router.get("/exchange_sports/inplay", authController.isLogin, viewController.getExchangePage);
// router.get("/exchange_sports/cricket", authController.isProtected, viewController.getCricketpage);
// router.get("/exchange_sports/footBall", authController.isProtected, viewController.getFootballData);
// router.get("/exchange_sports/tennis", authController.isProtected, viewController.getTennisData);
// router.get("/exchange_sports/live_match", authController.isProtected, viewController.getMatchDetailsPage);
// router.get("/edit", authController.isProtected, viewController.edit);

module.exports = router