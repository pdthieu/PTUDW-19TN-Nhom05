module.exports = (sequelize, Datatype) => {
    const OrderPackage = sequelize.define(
        'order_packages',
        {
            id: {
                primaryKey: true,
                allowNull: false,
                type: Datatype.UUID,
                defaultValue: Datatype.UUIDV4,
            },
            orderId: {
                type: Datatype.UUID,
                references: {
                    model: 'orders',
                    key: 'id',
                },
            },
            orderId: {
                type: Datatype.UUID,
                references: {
                    model: 'packages',
                    key: 'id',
                },
            },
            quantity: {
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
    return OrderPackage;
};
