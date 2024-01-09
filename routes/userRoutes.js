const express = require('express');
const router = express.Router()
const userController = require('../controller/userController')
const authController = require('../controller/authorizationController');
// const { route } = require('./roleRoutes');


// User Panal
router.post("/updateCurrentUserPass", userController.isOperator ,authController.isProtected_User, userController.currentUserPasswordupdate);


// Admin Panal
router.use(authController.isProtected)
router.get("/createuser10000" , userController.isOperator ,userController.createUser10000)

router.post("/admin_updateCurrentUserPass", userController.isOperator ,userController.currentUserPasswordupdate); // use in both side
//createDeleteUser//
router.post('/createUser', userController.isOperator ,authController.restrictTo("createDeleteUser"), authController.checkPass, userController.createUser);
router.post('/deleteUser', userController.isOperator ,authController.restrictTo("createDeleteUser"), userController.deletUser);


//userStatus//
router.post('/updateUserStatusInactive', userController.isOperator ,authController.restrictTo("userStatus"), authController.checkPass,userController.updateUserStatusCodeInactive );
router.post('/updateUserStatusActive', userController.isOperator ,authController.restrictTo("userStatus"),authController.checkPass, userController.updateUserStatusCodeActive);



//betLockAndUnloack//
router.post('/updateUserStatusBettingLock', userController.isOperator ,authController.restrictTo("betLockAndUnloack"), userController.updateUserStatusBattingLock);
router.post('/updateUserStatusBettingUnlock', userController.isOperator ,authController.restrictTo("betLockAndUnloack"), userController.updateUserStatusBattingUnlock); 


//changeUserPassword//
router.post('/changeUserPassword', userController.isOperator ,authController.restrictTo("changeUserPassword"), authController.checkPass,userController.changePassword);
router.post('/changeUserPasswordAdmin', userController.isOperator ,authController.restrictTo("changeUserPassword"), authController.checkPass,userController.changePasswordAdmin);


//userName//
router.get('/getAllUsers', userController.isOperator ,authController.restrictTo("userName"), userController.getAllUser);
router.get('/getOnlineUsers', userController.isOperator ,authController.restrictTo("userName"), userController.onLineUsers);
router.get('/searchUser', userController.isOperator ,authController.restrictTo("userName"), userController.searchUser);
router.get('/getOwnChild', userController.isOperator ,authController.restrictTo("userName"), userController.getOwnChild);
router.get('/getUser', userController.isOperator ,authController.restrictTo("userName"), userController.getUser);
router.post('/updateUser',userController.isOperator ,authController.restrictTo('userName'),userController.updateUser)
router.get("/getUserLoginLogs", userController.isOperator ,authController.restrictTo("loginLogs"), userController.getUserLoginLog);

//for user
router.post("/edit", userController.isOperator ,userController.edit);



module.exports = router;