const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { Admin, User } = require('../models');
const signToken = require('../utils/signToken');
var database = require('../models');

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
    const existManager = await Admin.findOne({ where: { email: body.email } });
    if (existManager) {
        return res.render('manager/signup', { title: 'Sign up', err: 'Email already exist' });
    }
    await Admin.create(req.body);
    res.clearCookie('jwt');
    return res.redirect('signin');
};

exports.signInView = async (req, res) => {
    console.log('signin view controller');
    return res.render('manager/signin', { title: 'Sign in' });
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
    console.log('signin controller');
    const body = req.body;
    const manager = await Admin.unscoped().findOne({
        where: { email: body.email, type: 'manager' },
    });

    if (!manager) {
        return res.render('manager/signin', {
            title: 'Sign in',
            err: 'Email or Password is wrong',
        });
    }

    const isValidPassword = await manager.isValidPassword(body.password, manager.password);
    if (isValidPassword) {
        res = signToken(res, manager.id, 'manager');
        return res.redirect('manager');
    } else {
        return res.render('manager/signin', {
            title: 'Sign in',
            err: 'Email or Password is wrong',
        });
    }
};

exports.isLogin = async (req, res, next) => {
    const token = req.cookies.jwtmanager;
    try {
        const verify = jwt.verify(token, process.env.JWT_CODE);
        if (verify.role != 'manager') throw 'auth fails';
        req.manager = verify;
        return next();
    } catch (err) {
        return res.redirect('/manager/signin');
    }
};

exports.isNotLogin = async (req, res, next) => {
    console.log('is not login controller');
    const token = req.cookies.jwt;
    try {
        const verify = jwt.verify(token, process.env.JWT_CODE);
        req.manager = verify;
        return res.redirect('manager');
    } catch (err) {
        return next();
    }
};

exports.managerHomepagelView = async (req, res) => {
    // console.log('manager homepage view controller');
    // var controller = {};
    // var Users = database.User;
    // controller.getAll = async function (callback) {
    //     await Users.findAll().then(function (users) {
    //         callback(users);
    //     });
    // };
    // await controller.getAll(function (users) {
    //     res.locals.users = users;
    //     console.log(users);
    //     return res.render('manager/manager', { title: 'manager' });
    // });

    const users = await User.findAll({ where: {} });
    return res.render('manager/manager', { title: 'manager', users });
};

exports.addPatientView = async (req, res) => {
    console.log('add patient controller');
    return res.render('manager/addpatient', { title: 'patient' });
};

exports.paymentManagerView = async (req, res) => {
    console.log('payment manager view controller');
    return res.render('manager/payment_manager', { title: 'patient' });
};

exports.inforDetailView = async (req, res) => {
    console.log('infor detail view controller');
    var id = req.params.id;
    console.log(id);
    return res.render('manager/infor-detail', { title: 'patient' });
};

exports.managerNeccessaryView = async (req, res) => {
    console.log('manager neccessary controller');
    return res.render('manager/manager-neccessary', { title: 'manager neccessary' });
};

exports.managerAddNeccessaryView = async (req, res) => {
    console.log('add neccessary view controller');
    return res.render('manager/add-neccessary', { title: 'add neccessary' });
};

exports.managerInfoNeccessaryView = async (req, res) => {
    console.log('info neccessary view controller');
    return res.render('manager/info-neccessary', { title: 'info neccessary' });
};

exports.managerNeccessaryPacketView = async (req, res) => {
    console.log('manager neccessary packet controller');
    return res.render('manager/manager-neccessary-packet', { title: 'manager neccessary packet' });
};

exports.managerAddNeccessaryPacketView = async (req, res) => {
    console.log('add neccessary packet view controller');
    return res.render('manager/add-neccessary-packet', { title: 'add neccessary packet' });
};

exports.managerInfoNeccessaryPacketView = async (req, res) => {
    console.log('info neccessary packet view controller');
    return res.render('manager/info-neccessary-packet', { title: 'info neccessary packet' });
};
