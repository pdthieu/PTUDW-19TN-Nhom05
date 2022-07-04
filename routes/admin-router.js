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

router.route('/manager/manager').get(adminController.managerHomepagelView);
router.route('/manager/addpatient').get(adminController.addPatientView);
router.route('/manager/payment').get(adminController.paymentManagerView);
router.route('/manager/:id').get(adminController.inforDetailView);

module.exports = router;
