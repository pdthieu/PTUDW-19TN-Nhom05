const bcrypt = require('bcryptjs');
const crypto = require('crypto');
module.exports = (sequelize, Datatype) => {
    const Admin = sequelize.define(
        'admin',
        {
            id: {
                primaryKey: true,
                allowNull: false,
                type: Datatype.UUID,
                defaultValue: Datatype.UUIDV4,
            },
            fullName: {
                type: Datatype.STRING,
            },
            email: {
                type: Datatype.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: Datatype.STRING,
                allowNull: false,
            },
        },
        {
            underscored: true,
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            hooks: {
                beforeSave: async function (user) {
                    if (user.changed('password')) {
                        user.password = await bcrypt.hash(user.password, 10);
                    }
                },
            },
        }
    );
    
    Admin.prototype.isValidPassword = async function (candidatePassword, userPassword) {
        return await bcrypt.compare(candidatePassword, userPassword);
    };
    
    return Admin;
};
