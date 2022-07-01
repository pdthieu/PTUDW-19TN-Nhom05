const bcrypt = require('bcryptjs');
const crypto = require('crypto');
module.exports = (sequelize, Datatype) => {
    const User = sequelize.define(
        'users',
        {
            id: {
                primaryKey: true,
                allowNull: false,
                type: Datatype.UUID,
                defaultValue: Datatype.UUIDV4,
            },
            identityId: {
                type: Datatype.STRING,
            },
            fullName: {
                type: Datatype.STRING,
            },
            birthday: {
                type: Datatype.TIME,
            },
            addressId: {
                type: Datatype.UUID,
                references: {
                    model: 'addresses',
                    key: 'id',
                },
            },
            currentStatus: {
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
            available: {
                type: Datatype.BOOLEAN,
                default: true,
            },
        },
        {
            defaultScope: {
                attributes: {
                    exclude: ['password'],
                },
            },
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

    User.prototype.isValidPassword = async function (candidatePassword, userPassword) {
        return await bcrypt.compare(candidatePassword, userPassword);
    };

    return User;
};
