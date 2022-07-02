var express = require('express');
var router = express.Router();

const adminController = require('../controllers/admin-controller');

router
    .route('/admin/signup')
    .get(adminController.signUpView)
    .post(adminController.signUpValidator, adminController.signUp);

router
    .route('/admin/signin')
    .get(adminController.isNotLogin, adminController.signInView)
    .post(adminController.signInValidator, adminController.signIn);

module.exports = router;
