const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const signToken = require('../utils/signToken');
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
    return res.render('user/signin', { title: 'Sign in' });
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
        res = signToken(res, user.id, 'user');
        return res.redirect('/homepage');
    } else {
        return res.render('user/signin', { title: 'Sign in', err: 'Email or Password is wrong' });
    }
};

exports.isLogin = async (req, res, next) => {
    const token = req.cookies.jwt;
    try {
        const verify = jwt.verify(token, process.env.JWT_CODE);
        console.log(verify);
        if (verify.role != 'user') throw 'auth fails';
        req.user = verify;
        return next();
    } catch (err) {
        console.log(err);
        return res.redirect('/user/signin');
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

exports.userProductView = async (req, res) => {
    return res.render('user/product');
};

exports.logout = async (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/homepage');
};
