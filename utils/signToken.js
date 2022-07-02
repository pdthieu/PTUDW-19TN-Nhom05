const jwt = require('jsonwebtoken');
const signToken = (res, id, role) => {
    const token = jwt.sign({ id, role }, process.env.JWT_CODE, {
        expiresIn: process.env.JWT_EXPIRES,
    });
    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPRIES * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false,
    };
    if (role == 'admin') {
        res.cookie('jwtadmin', token, cookieOption);
    } else res.cookie('jwt', token, cookieOption);
    return res;
};

module.exports = signToken;
