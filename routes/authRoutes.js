const express = require('express');
const router = express.Router()
const userController = require('../controller/userController')
const authController = require('../controller/authorizationController');

router.post('/login', authController.login);
router.post('/userLogin', authController.userLogin);
router.post('/userSignUp', authController.signUp);
router.get('/logOut', authController.isProtected, authController.logOut);

router.use(authController.isProtected)
router.get("/logOutAllUser", authController.restrictTo("allUserLogOut"), authController.logOutAllUser);
router.post("/logOutSelectedUser", authController.logOutSelectedUser);


module.exports = router;