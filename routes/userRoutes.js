const express = require('express');
const router = express.Router()
const userController = require('../controller/userController')
const authController = require('../controller/authorizationController');
// const { route } = require('./roleRoutes');


// User Panal
router.post("/updateCurrentUserPass",authController.isProtected_User, userController.currentUserPasswordupdate);


// Admin Panal
router.use(authController.isProtected)
router.get("/createuser10000" , userController.createUser10000)

router.post("/admin_updateCurrentUserPass", userController.currentUserPasswordupdate); // use in both side
//createDeleteUser//
router.post('/createUser', authController.restrictTo("createDeleteUser"), authController.checkPass, userController.createUser);
router.post('/deleteUser', authController.restrictTo("createDeleteUser"), userController.deletUser);


//userStatus//
router.post('/updateUserStatusInactive', authController.restrictTo("userStatus"), authController.checkPass,userController.updateUserStatusCodeInactive );
router.post('/updateUserStatusActive', authController.restrictTo("userStatus"),authController.checkPass, userController.updateUserStatusCodeActive);



//betLockAndUnloack//
router.post('/updateUserStatusBettingLock', authController.restrictTo("betLockAndUnloack"), userController.updateUserStatusBattingLock);
router.post('/updateUserStatusBettingUnlock', authController.restrictTo("betLockAndUnloack"), userController.updateUserStatusBattingUnlock);


//changeUserPassword//
router.post('/changeUserPassword', authController.restrictTo("changeUserPassword"), authController.checkPass,userController.changePassword);


//userName//
router.get('/getAllUsers', authController.restrictTo("userName"), userController.getAllUser);
router.get('/getOnlineUsers', authController.restrictTo("userName"), userController.onLineUsers);
router.get('/searchUser', authController.restrictTo("userName"), userController.searchUser);
router.get('/getOwnChild', authController.restrictTo("userName"), userController.getOwnChild);
router.get('/getUser', authController.restrictTo("userName"), userController.getUser);
router.post('/updateUser',authController.restrictTo('userName'),userController.updateUser)
router.get("/getUserLoginLogs", authController.restrictTo("loginLogs"), userController.getUserLoginLog);

//for user
router.post("/edit", userController.edit);



module.exports = router;