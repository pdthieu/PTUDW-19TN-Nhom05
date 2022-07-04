const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { Admin, User, Product, ProductPackage, Package } = require('../models');
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
    return res.render('manager/signin', { title: 'Sign in' });
};

exports.signInValidator = async (req, res, next) => {
    try {
        const body = await signInSchema.validateAsync(req.body);
        return next();
    } catch (err) {
        return res.render('manager/signin', { title: 'Sign in', err: err.details[0].message });
    }
};

exports.signIn = async (req, res) => {
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
    const token = req.cookies.jwtmanager;
    try {
        const verify = jwt.verify(token, process.env.JWT_CODE);
        req.manager = verify;
        return res.redirect('manager');
    } catch (err) {
        return next();
    }
};
var controller = {};
var Users = database.User;
controller.getAll = async function (callback) {
    await Users.findAll().then(function (users) {
        callback(users);
    });
};
exports.managerHomepagelView = async (req, res) => {
    const users = await User.findAll({ where: {} });
    return res.render('manager/manager', { title: 'manager', users });
};
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
exports.search = async (req, res) => {
    try {
        const query = req.body.q;
        //const users = await User.findAll({ where: { fullName: query  } })
        const users = await User.findAll({ where: { fullName: { [Op.like]: `%${query}%` } } });
        return res.render('manager/manager', { title: 'Search result', users });
    } catch (error) {
        return res.redirect('/manager/manager', { title: 'manager' });
    }
};

exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    await database.User.destroy({ where: { id } });
    return res.redirect('/manager/manager');
};

exports.addPatientView = async (req, res) => {
    return res.render('manager/addpatient', { title: 'patient' });
};

exports.addNewPatient = async (req, res) => {
    try {
        await User.create({
            identityId: req.body.identityId,
            fullName: req.body.fullName,
            birthday: req.body.birthday,
            currentStatus: req.body.currentStatus,
            email: req.body.email,
            password: req.body.identityId,
        });
        return res.redirect('/manager/manager');
    } catch (error) {
        return res.render('manager/addpatient', { title: 'Add patient' });
    }
};

exports.paymentManagerView = async (req, res) => {
    //const payment = await TransactionHistory.findAll({ where: {} });
    return res.render('manager/payment_manager', { title: 'payment' });
};

exports.inforDetailView = async (req, res) => {
    var id = req.params.id;
    var user = await User.findOne({ where: { id: id } });
    return res.render('manager/infor-detail', { title: 'patient', user });
};

exports.managerNeccessaryView = async (req, res) => {
    const products = await Product.findAll({ where: {} });
    return res.render('manager/manager-neccessary', { title: 'Manager Neccessary', products });
};

exports.managerAddNeccessaryView = async (req, res) => {
    return res.render('manager/add-neccessary', { title: 'Add Neccessary' });
};

exports.addNeccessary = async (req, res) => {
    try {
        await Product.create({
            productName: req.body.productName,
            currentPrice: req.body.currentPrice,
            unit: req.body.unit,
            images: {},
            category: req.body.category,
        });
        return res.redirect('manager-neccessary');
    } catch (err) {
        return res.render('manager/add-neccessary', {
            title: 'error Add neccessary',
            err: err,
        });
    }
};

exports.updateNeccessary = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findOne({ where: { id } });
        if (product) {
            product.productName = req.body.productName;
            product.currentPrice = req.body.currentPrice;
            product.unit = req.body.unit;
            product.category = req.body.category;
            await product.save();
        }
        return res.redirect('/manager/manager-neccessary');
    } catch (err) {
        return res.redirect('/manager/manager-neccessary');
    }
};

exports.managerInfoNeccessaryView = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findOne({ where: { id } });
    if (product) {
        return res.render('manager/info-neccessary', { title: 'info neccessary', product, id });
    } else {
        return res.redirect('/manager/manager-neccessary');
    }
};

exports.deleteNeccessary = async (req, res) => {
    const id = req.params.id;
    try {
        await Product.destroy({ where: { id } });
        return res.redirect('/manager/manager-neccessary');
    } catch (err) {
        return res.redirect('/manager/manager-neccessary');
    }
};

exports.managerNeccessaryPackageView = async (req, res) => {
    return res.render('manager/manager-neccessary-package', {
        title: 'manager neccessary package',
        // newPackages,
    });
};

exports.addNeccessaryPackage = async (req, res) => {
    try {
        await ProductPackage.create({
            productName: req.body.productName,
            currentPrice: req.body.currentPrice,
            unit: req.body.unit,
            images: {},
            category: req.body.category,
        });
        return res.redirect('manager-neccessary-package');
    } catch (err) {
        return res.render('manager/add-neccessary-package', {
            title: 'error Add neccessary package',
            err: err,
        });
    }
};

exports.updateNeccessaryPackage = async (req, res) => {
    const id = req.params.id;
    try {
        const productPackage = await ProductPackage.findOne({ where: { id } });
        if (productPackage) {
            productPackage.productName = req.body.productName;
            productPackage.currentPrice = req.body.currentPrice;
            productPackage.unit = req.body.unit;
            productPackage.category = req.body.category;
            await productPackage.save();
        }
        return res.render('manager/info-neccessary-package', { title: 'Info Neccessary' });
    } catch (err) {
        return res.render('manager/info-neccessary-package', { title: 'Error Update Neccessary' });
    }
};

exports.managerAddNeccessaryPackageView = async (req, res) => {
    return res.render('manager/add-neccessary-package', { title: 'add neccessary package' });
};

exports.managerInfoNeccessaryPackageView = async (req, res) => {
    return res.render('manager/info-neccessary-package', { title: 'info neccessary package' });
};

exports.logout = async (req, res) => {
    res.clearCookie('jwtmanager');
    res.redirect('/homepage');
};
