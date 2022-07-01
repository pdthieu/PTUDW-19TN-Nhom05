var express = require('express');
var router = express.Router();

const userController = require('../controllers/user-controller');

/* GET users listing. */
router.get('/user/signup', userController.signUpView).post('/user/signup', userController.signUp);

module.exports = router;
