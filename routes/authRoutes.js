const express = require('express');
const router = express.Router()
const userController = require('../controller/userController')
const authController = require('../controller/authorizationController');
const middlewares = require("../middleWares/middleware");
const Usermiddlewares = require("../middleWares/user_middleware");

router.post('/login', authController.login);
router.post('/loginAndCreateUser', authController.createAndLoginUser);
router.post('/userLogin', authController.userLogin);
router.post('/userSignUp', authController.signUp);
router.get('/logOut', Usermiddlewares,authController.isProtected_User, authController.logOut);

// Admin Panal
router.use(middlewares,authController.isProtected)
router.get('/admin_logOut', authController.admin_logOut);  // use same routes in both
router.get("/logOutAllUser", authController.restrictTo("allUserLogOut"), authController.logOutAllUser);
router.post("/logOutSelectedUser", authController.logOutSelectedUser);


module.exports = router;