const express = require('express');
const router = express.Router();
const userRouter = require('./user-router');
const adminRouter = require('./admin-router');

/* GET home page. */
router.get('/homepage', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/manager-neccesary', function (req, res, next) {
    res.render('manager_neccessary', { title: 'manager neccessary' });
});

router.get('/manager-neccesary-packet', function (req, res, next) {
    res.render('manager_neccessary_packet', { title: 'manager neccessary packet' });
});

router.use(userRouter);
router.use(adminRouter);

module.exports = router;
