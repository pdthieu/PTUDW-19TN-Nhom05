module.exports = (sequelize, Datatype) => {
    const TransactionHistory = sequelize.define(
        'transaction_histories',
        {
            id: {
                primaryKey: true,
                allowNull: false,
                type: Datatype.UUID,
                defaultValue: Datatype.UUIDV4,
            },
            userId: {
                type: Datatype.UUID,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            balance: {
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
    return TransactionHistory;
};
