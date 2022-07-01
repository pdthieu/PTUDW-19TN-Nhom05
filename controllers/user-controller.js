const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    fullName: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});
const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});
exports.signUpView = async (req, res) => {
    return res.render('user/signup', { title: 'Express' });
};

const signtoken = (res, id) => {
    const token = jwt.sign({ id: id }, process.env.JWT_CODE, {
        expiresIn: process.env.JWT_EXPIRES,
    });
    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPRIES * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false,
    };
    res.cookie('jwt', token, cookieOption);
    return res;
};

exports.signUpValidator = async (req, res, next) => {
    try {
        const body = await signUpSchema.validateAsync(req.body);
        return next();
    } catch (err) {
        console.log(err);
        return res.status(406).json(err[0]);
    }
};
exports.signUp = async (req, res) => {
    const body = req.body;
    const existUser = await User.findOne({ where: { email: body.email } });
    if (existUser) {
        return res.status(406).json({ errMsg: 'Email is already exist' });
    }
    await User.create(req.body);
    return res.render('user/signin', { title: 'Express' });
};

exports.signInView = async (req, res) => {
    return res.render('user/signIn', { title: 'Express' });
};

exports.signInValidator = async (req, res, next) => {
    try {
        console.log(req.body);
        const body = await signInSchema.validateAsync(req.body);
        return next;
    } catch (err) {
        console.log(err);
        return res.status(406).json(err[0]);
    }
};

exports.signIn = async (req, res) => {
    const body = req.body;
    const user = await User.unscoped().findOne({ where: { email: body.email } });
    if (!user) {
        return res.status(406).json({ errMsg: 'Email or Password is wrong' });
    }

    const isValidPassword = await user.isValidPassword(body.password, user.password);
    if (isValidPassword) {
        res = signtoken(res, user.id);
        return res.render('index', { title: 'Express' });
    }
};

exports.isLogin = async (req, res, next) => {
    const token = req.cookies.jwt;
    try {
        const verify = jwt.verify(token, process.env.JWT_CODE);
        req.user = verify;
        return next();
    } catch (err) {
        res.status(400).json({
            errMsg: 'Auth fails',
        });
        return res.render('user/signIn', { title: 'Express' });
    }
};

exports.isNotLogin = async (req, res, next) => {
    const token = req.cookies.jwt;
    try {
        const verify = jwt.verify(token, process.env.JWT_CODE);
        req.user = verify;
        return res.render('index', { title: 'Express' });
    } catch (err) {
        return next();
    }
};
