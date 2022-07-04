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

router
    .route('/manager/manager-neccessary')
    .get(managerController.isLogin, managerController.managerNeccessaryView);

router
    .route('/manager/add-neccessary')
    .get(managerController.isLogin, managerController.managerAddNeccessaryView);
router
    .route('/manager/info-neccessary')
    .get(managerController.isLogin, managerController.managerInfoNeccessaryView);

router
    .route('/manager/manager-neccessary-packet')
    .get(managerController.isLogin, managerController.managerNeccessaryPacketView);

router
    .route('/manager/add-neccessary-packet')
    .get(managerController.isLogin, managerController.managerAddNeccessaryPacketView);
router
    .route('/manager/info-neccessary-packet')
    .get(managerController.isLogin, managerController.managerInfoNeccessaryPacketView);

router
    .route('/manager/manager')
    .get(managerController.isLogin,managerController.managerHomepagelView)
    .post(managerController.isLogin,managerController.search)

router.route('/manager/addpatient')
    .get(managerController.isLogin, managerController.addPatientView)
    .post(managerController.isLogin, managerController.addNewPatient)

router.route('/manager/payment')
    .get(managerController.isLogin, managerController.paymentManagerView);

router.route('/manager/:id')
    .get(managerController.isLogin, managerController.inforDetailView);

router.route('/manager/delete/:id')
    .get(managerController.isLogin, managerController.deleteUser, managerController.managerHomepagelView);

module.exports = router;
