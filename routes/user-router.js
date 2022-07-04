var express = require('express');
var router = express.Router();

const userController = require('../controllers/user-controller');

router
    .route('/user/signup')
    .get(userController.signUpView)
    .post(userController.signUpValidator, userController.signUp);

router
    .route('/user/signin')
    .get(userController.isNotLogin, userController.signInView)
    .post(userController.signInValidator, userController.signIn);

router.route('/user/logout').get(userController.logout);
module.exports = router;
