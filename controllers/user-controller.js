const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const signUpSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': `Email is not allowed to be empty`,
    }),
    fullName: Joi.string().required().messages({
        'string.empty': `Fullname is not allowed to be empty`,
    }),
    password: Joi.string().min(6).alphanum().required().messages({
        'string.empty': `Password is not allowed to be empty`,
        'string.min': `Password should have a minimum length of {#limit}`,
    }),
});
const signInSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': `Email is not allowed to be empty`,
    }),
    password: Joi.string().alphanum().required().messages({
        'string.empty': `Password is not allowed to be empty`,
    }),
});
exports.signUpView = async (req, res) => {
    return res.render('user/signup', { title: 'Sign up' });
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
        return res.render('user/signup', { title: 'Sign up', err: err.details[0].message });
    }
};
exports.signUp = async (req, res) => {
    const body = req.body;
    const existUser = await User.findOne({ where: { email: body.email } });
    if (existUser) {
        return res.render('user/signup', { title: 'Sign up', err: 'Email already exist' });
    }
    await User.create(req.body);
    res.clearCookie('jwt');
    return res.redirect('/user/signin');
};

exports.signInView = async (req, res) => {
    return res.render('user/signIn', { title: 'Sign in' });
};

exports.signInValidator = async (req, res, next) => {
    try {
        console.log(req.body);
        const body = await signInSchema.validateAsync(req.body);
        return next();
    } catch (err) {
        console.log(err);
        return res.render('user/signin', { title: 'Sign in', err: err.details[0].message });
    }
};

exports.signIn = async (req, res) => {
    const body = req.body;
    const user = await User.unscoped().findOne({ where: { email: body.email } });

    if (!user) {
        return res.render('user/signin', { title: 'Sign in', err: 'Email or Password is wrong' });
    }

    const isValidPassword = await user.isValidPassword(body.password, user.password);
    if (isValidPassword) {
        res = signtoken(res, user.id);
        return res.redirect('/homepage');
    } else {
        return res.render('user/signin', { title: 'Sign in', err: 'Email or Password is wrong' });
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
        return res.redirect('/user/homepage');
    }
};

exports.isNotLogin = async (req, res, next) => {
    const token = req.cookies.jwt;
    try {
        const verify = jwt.verify(token, process.env.JWT_CODE);
        req.user = verify;
        return res.redirect('/homepage');
    } catch (err) {
        return next();
    }
};
