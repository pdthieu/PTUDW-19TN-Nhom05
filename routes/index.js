const express = require('express');
const router = express.Router();
const userRouter = require('./user-router');

/* GET home page. */
router.get('/homepage', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.use(userRouter);

module.exports = router;
