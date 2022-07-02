const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
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
    return res.render('admin/signup', { title: 'Sign up' });
};

exports.signUpValidator = async (req, res, next) => {
    try {
        const body = await signUpSchema.validateAsync(req.body);
        return next();
    } catch (err) {
        console.log(err);
        return res.render('admin/signup', { title: 'Sign up', err: err.details[0].message });
    }
};
exports.signUp = async (req, res) => {
    const body = req.body;
    const existAdmin = await Admin.findOne({ where: { email: body.email } });
    if (existAdmin) {
        return res.render('admin/signup', { title: 'Sign up', err: 'Email already exist' });
    }
    await Admin.create(req.body);
    res.clearCookie('jwt');
    return res.redirect('/admin/signin');
};

exports.signInView = async (req, res) => {
    return res.render('admin/signIn', { title: 'Sign in' });
};

exports.signInValidator = async (req, res, next) => {
    try {
        console.log(req.body);
        const body = await signInSchema.validateAsync(req.body);
        return next();
    } catch (err) {
        console.log(err);
        return res.render('admin/signin', { title: 'Sign in', err: err.details[0].message });
    }
};

exports.signIn = async (req, res) => {
    const body = req.body;
    const admin = await Admin.unscoped().findOne({ where: { email: body.email } });

    if (!admin) {
        return res.render('admin/signin', { title: 'Sign in', err: 'Email or Password is wrong' });
    }

    const isValidPassword = await admin.isValidPassword(body.password, admin.password);
    if (isValidPassword) {
        res = signToken(res, admin.id, 'admin');
        return res.redirect('/homepage');
    } else {
        return res.render('admin/signin', { title: 'Sign in', err: 'Email or Password is wrong' });
    }
};

exports.isLogin = async (req, res, next) => {
    const token = req.cookies.jwtadmin;
    try {
        const verify = jwt.verify(token, process.env.JWT_CODE);
        req.admin = verify;
        return next();
    } catch (err) {
        res.status(400).json({
            errMsg: 'Auth fails',
        });
        return res.redirect('/admin/homepage');
    }
};

exports.isNotLogin = async (req, res, next) => {
    const token = req.cookies.jwtadmin;
    try {
        const verify = jwt.verify(token, process.env.JWT_CODE);
        req.admin = verify;
        return res.redirect('/homepage');
    } catch (err) {
        return next();
    }
};

exports.managerView = async (req, res) => {
    return res.render('admin/admin-manager', { title: 'Sign in' });
};

exports.addAdminView = async (req, res) => {
    return res.render('admin/add-admin', { title: 'Sign in' });
};
