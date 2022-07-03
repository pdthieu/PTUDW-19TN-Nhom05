var express = require('express');
var router = express.Router();

const managerController = require('../controllers/manager-controller');

router
    .route('/manager/signup')
    .get(managerController.signUpView)
    .post(managerController.signUpValidator, managerController.signUp);

router
    .route('/manager/signin')
    .get(managerController.isNotLogin, managerController.signInView)
    .post(managerController.signInValidator, managerController.signIn);

   
module.exports = router;
