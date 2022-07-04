const register = (Handlebars) => {
    const helpers = {
        check: (value, comparator) => {
            return value == comparator ? 'No content' : value;
        },
    };

    if (Handlebars && typeof Handlebars.registerHelper === 'function') {
        // register helpers
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }
};

module.exports.register = register;
module.exports.helpers = register(null);
