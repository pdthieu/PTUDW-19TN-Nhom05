module.exports = (sequelize, Datatype) => {
    const OrderProductPackage = sequelize.define(
        'product_packages',
        {
            id: {
                primaryKey: true,
                allowNull: false,
                type: Datatype.UUID,
                defaultValue: Datatype.UUIDV4,
            },
            packageId: {
                type: Datatype.UUID,
                references: {
                    model: 'packages',
                    key: 'id',
                },
            },
            productId: {
                type: Datatype.UUID,
                references: {
                    model: 'products',
                    key: 'id',
                },
            },
            maximum_quantity: {
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
    return OrderProductPackage;
};
