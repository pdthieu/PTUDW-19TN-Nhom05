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
            fullName: {
                type: Datatype.STRING,
            },
            username: {
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
        }
    );
    return User;
};
