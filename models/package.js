module.exports = (sequelize, Datatype) => {
    const Package = sequelize.define(
        'packages',
        {
            id: {
                primaryKey: true,
                allowNull: false,
                type: Datatype.UUID,
                defaultValue: Datatype.UUIDV4,
            },
            packageName: {
                type: Datatype.STRING,
            },
            dueDate: {
                type: Datatype.TIME,
            },
            maximumQuantity: {
                type: Datatype.INTEGER,
                default: 0,
            },
        },
        {
            underscored: true,
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
        }
    );
    return Package;
};
