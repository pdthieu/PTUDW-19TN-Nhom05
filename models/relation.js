module.exports = (sequelize, Datatype) => {
    const Relation = sequelize.define(
        'relations',
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
            relatedId: {
                type: Datatype.UUID,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
        },
        {
            underscored: true,
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
        }
    );
    return Relation;
};
