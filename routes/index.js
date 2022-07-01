const express = require('express');
const router = express.Router();
const userRouter = require('./users');

/* GET home page. */
router.get('/user', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.use(userRouter);

module.exports = router;
