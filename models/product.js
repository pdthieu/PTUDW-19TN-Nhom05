module.exports = (sequelize, Datatype) => {
    const Product = sequelize.define(
        'products',
        {
            id: {
                primaryKey: true,
                allowNull: false,
                type: Datatype.UUID,
                defaultValue: Datatype.UUIDV4,
            },
            productName: {
                type: Datatype.STRING,
            },
            images: {
                type: Datatype.JSON,
            },
            currentPrice: {
                type: Datatype.DECIMAL(10, 2),
                default: 0,
            },
            unit: {
                type: Datatype.STRING,
            },
            category: {
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
    return Product;
};
