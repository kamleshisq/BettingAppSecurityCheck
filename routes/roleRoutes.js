const express = require('express');
const router = express.Router()
const roleController = require('../controller/roleController');
const userController = require('../controller/userController')
const authController = require('../controller/authorizationController');


//Admin Panal

router.get('/getAuthROle', authController.isProtected, authController.restrictTo("roleController"),roleController.getAuthROle);
// router.use(authController.isProtected, authController.restrictTo("roleController"))

router.post('/createRole', roleController.createRole);
router.post('/addAuthorization', roleController.addAuthorization);
router.post('/deleteAuthorization', roleController.deleteAuthorization);
router.get('/getAllRoles',roleController.getAllRole);
router.post('/updateRoleLavel', roleController.updateRoleLevel);
router.get("/getRoleById", roleController.getRoleById);
router.post("/updateRoleById", roleController.updateRoleById , roleController.updateRoleLevel);
router.post("/deleteRole" , roleController.deleteRole);

module.exports = router;