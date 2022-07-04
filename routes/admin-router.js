var express = require('express');
var router = express.Router();

const adminController = require('../controllers/admin-controller');
const admin = require('../models/admin');

router
    .route('/admin/signup')
    .get(adminController.signUpView)
    .post(adminController.signUpValidator, adminController.signUp);

router
    .route('/admin/signin')
    .get(adminController.isNotLogin, adminController.signInView)
    .post(adminController.signInValidator, adminController.signIn);

router.route('/admin/manager').get(adminController.isLogin, adminController.managerView);
router
    .route('/admin/manager/:id')
    .post(adminController.isLogin, adminController.lockAdmin, adminController.managerView);
router
    .route('/admin/add')
    .get(adminController.isLogin, adminController.addAdminView)
    .post(adminController.isLogin, adminController.addManager);

router.route('/admin/logout').get(adminController.logout);
module.exports = router;
