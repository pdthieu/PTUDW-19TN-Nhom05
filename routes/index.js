const express = require('express');
const router = express.Router();
const userRouter = require('./user-router');
const adminRouter = require('./admin-router');
const managerRouter = require('./manager-router');

/* GET home page. */
router.get('/homepage', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.use(userRouter);
router.use(adminRouter);
router.use(managerRouter);

module.exports = router;
