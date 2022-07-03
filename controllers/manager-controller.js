const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { Manager } = require('../models');
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
    return res.render('manager/signup', { title: 'Sign up' });
};

exports.signUpValidator = async (req, res, next) => {
    try {
        const body = await signUpSchema.validateAsync(req.body);
        return next();
    } catch (err) {
        console.log(err);
        return res.render('manager/signup', { title: 'Sign up', err: err.details[0].message });
    }
};
exports.signUp = async (req, res) => {
    const body = req.body;
    const existManager = await Manager.findOne({ where: { email: body.email } });
    if (existManager) {
        return res.render('manager/signup', { title: 'Sign up', err: 'Email already exist' });
    }
    await Manager.create(req.body);
    res.clearCookie('jwt');
    return res.redirect('/manager/signin');
};

exports.signInView = async (req, res) => {
    return res.render('manager/signIn', { title: 'Sign in' });
};

exports.signInValidator = async (req, res, next) => {
    try {
        console.log(req.body);
        const body = await signInSchema.validateAsync(req.body);
        return next();
    } catch (err) {
        console.log(err);
        return res.render('manager/signin', { title: 'Sign in', err: err.details[0].message });
    }
};

exports.signIn = async (req, res) => {
    const body = req.body;
    const manager = await Manager.unscoped().findOne({ where: { email: body.email } });

    if (!manager) {
        return res.render('manager/signin', { title: 'Sign in', err: 'Email or Password is wrong' });
    }

    const isValidPassword = await manager.isValidPassword(body.password, manager.password);
    if (isValidPassword) {
        res = signToken(res, manager.id, 'manager');
        return res.redirect('/homepage');
    } else {
        return res.render('manager/signin', { title: 'Sign in', err: 'Email or Password is wrong' });
    }
};

exports.isLogin = async (req, res, next) => {
    const token = req.cookies.jwt;
    try {
        const verify = jwt.verify(token, process.env.JWT_CODE);
        req.manager = verify;
        return next();
    } catch (err) {
        res.status(400).json({
            errMsg: 'Auth fails',
        });
        return res.redirect('/manager/homepage');
    }
};

exports.isNotLogin = async (req, res, next) => {
    const token = req.cookies.jwt;
    try {
        const verify = jwt.verify(token, process.env.JWT_CODE);
        req.manager = verify;
        return res.redirect('/homepage');
    } catch (err) {
        return next();
    }
};

var controller = {}
var database = require("../models")
var Users = database.User
controller.getAll = function(callback){
    Users
    .findAll()
    .then(function(users){
        callback(users);
    });
};

exports.managerHomepagelView = async (req, res) => {
    controller.getAll(function(users){
        res.locals.users = users;
        console.log(users)
        return res.render('manager/manager', { title: 'manager' });
    })
};

exports.addPatientView = async (req, res) => {
    return res.render('manager/addpatient', { title: 'patient' });
}

exports.paymentManagerView = async (req, res) => {
    return res.render('manager/payment_manager', { title: 'patient' });
}

exports.inforDetailView = async (req, res) => {
    var id = req.params.id;
    return res.render('manager/:id', { title: 'patient' });
}
