module.exports = (sequelize, Datatype) => {
    const Order = sequelize.define(
        'orders',
        {
            id: {
                primaryKey: true,
                allowNull: false,
                type: Datatype.UUID,
                defaultValue: Datatype.UUIDV4,
            },
            creditId: {
                type: Datatype.UUID,
                references: {
                    model: 'credit_id',
                    key: 'id',
                },
            },
            amount: {
                type: Datatype.DECIMAL(10, 2),
                default: 0,
            },
            balanceAfterChange: {
                type: Datatype.DECIMAL(10, 2),
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
    return Order;
};
