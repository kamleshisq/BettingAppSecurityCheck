const express = require('express');
const router = express.Router();
const viewController = require('./../controller/viewController')
const authController = require('../controller/authorizationController')

router.get('/', viewController.login);
router.get('/userLogin',viewController.userLogin );
router.get('/registration',viewController.registration );
router.get('/API', viewController.APIcall);


router.use(authController.isProtected)
router.get('/userManagement', authController.restrictTo("userName"), viewController.userTable);
router.get("/createUSer", authController.restrictTo("createDeleteUser"), viewController.createUser);
router.get("/accountStatement", authController.restrictTo('accountControl'), viewController.accountStatement);
router.get("/updateUser", authController.restrictTo("createDeleteUser"),viewController.updateUser);
router.get("/resetPassword", authController.restrictTo("createDeleteUser"), viewController.resetPassword);
router.get("/DebitCredit", authController.restrictTo("accountControl"), viewController.getCreditDebitPage);
router.get("/createRole", authController.restrictTo("roleController"), viewController.createRole);
router.get("/updateRole", authController.restrictTo("roleController"), viewController.getUpdateRolePage);
router.get("/dashboard",  authController.restrictTo("dashboard"), viewController.dashboard);
router.get("/inactiveUser", authController.restrictTo("userStatus"), viewController.inactiveUser);
router.get("/changeCurrentUserPass", viewController.updatePass);
router.get("/changeUserPassword", viewController.updateUserPass);
router.get("/reports", viewController.ReportPage)

//user routs
router.get("/loginUser", authController.restrictTo("logOutUser"), viewController.onlineUsers);
router.get("/userDashboard", viewController.userdashboard);
router.get("/edit", viewController.edit);
router.get("/myAccountStatment", viewController.myAccountStatment);

module.exports = router