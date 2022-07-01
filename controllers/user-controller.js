const Joi = require('joi');
const signInSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    birthday: Joi.number().integer().min(1900).max(2013),
    identityId: Joi.number(),
});
exports.signUpView = async (req, res) => {
    // try {
    //     const body = await signInSchema.validateAsync(req.body);
    // } catch (err) {
    //     console.log(err);
    //     return;
    // }
    return res.render('user/signup', { title: 'Express' });
};

exports.signUp = async (req, res) => {
    console.log(req.body);
};
