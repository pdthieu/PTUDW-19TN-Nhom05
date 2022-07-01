module.exports = (sequelize, Datatype) => {
    const OrderProductPackage = sequelize.define(
        'order_product_packages',
        {
            id: {
                primaryKey: true,
                allowNull: false,
                type: Datatype.UUID,
                defaultValue: Datatype.UUIDV4,
            },
            orderPackageId: {
                type: Datatype.UUID,
                references: {
                    model: 'order_packages',
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
            quantity: {
                type: Datatype.INTEGER,
                default: 0,
            },
            price: {
                type: Datatype.DECIMAL(10, 2),
                default: 0,
            },
            status: {
                type: Datatype.STRING,
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
