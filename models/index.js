const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

//connect to SQL DB
const sequelize = new Sequelize({
    database: process.env.SQL_DATABASE,
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    dialect: process.env.SQL_DIALECT,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

sequelize
    .authenticate()
    .then(() => {
        
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Admin = require('./admin')(sequelize, Sequelize);
db.Credit = require('./credit')(sequelize, Sequelize);
db.OrderPackage = require('./order-package')(sequelize, Sequelize);
db.OrderProductPackage = require('./order-product-package')(sequelize, Sequelize);
db.Order = require('./order')(sequelize, Sequelize);
db.Package = require('./package')(sequelize, Sequelize);
db.ProductPackage = require('./product-package')(sequelize, Sequelize);
db.Product = require('./product')(sequelize, Sequelize);
db.Relation = require('./relation')(sequelize, Sequelize);
db.TransactionHistory = require('./transaction-history')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);

db.User.hasMany(db.Relation, {
    foreignKey: 'userId',
    as: 'relations',
});
db.Relation.belongsTo(db.User, {
    foreignKey: 'relatedId',
    as: 'relatedUser',
});

db.User.hasMany(db.Credit, {
    foreignKey: 'userId',
    as: 'credits',
});
db.Credit.belongsTo(db.User, {
    foreignKey: 'userId',
    as: 'user',
});

db.Credit.hasMany(db.TransactionHistory, {
    foreignKey: 'creditId',
    as: 'transactions',
});
db.TransactionHistory.belongsTo(db.Credit, {
    foreignKey: 'creditId',
    as: 'credit',
});

db.TransactionHistory.hasMany(db.Order, {
    foreignKey: 'transactionId',
    as: 'orders',
});
db.Order.belongsTo(db.TransactionHistory, {
    foreignKey: 'transactionId',
    as: 'transactionHistory',
});

db.Order.hasMany(db.OrderPackage, {
    foreignKey: 'orderId',
    as: 'orderPackages',
});
db.OrderPackage.belongsTo(db.Order, {
    foreignKey: 'orderId',
    as: 'order',
});

db.OrderPackage.hasMany(db.OrderProductPackage, {
    foreignKey: 'orderPackageId',
    as: 'orderProductPackages',
});
db.OrderProductPackage.belongsTo(db.OrderPackage, {
    foreignKey: 'orderPackageId',
    as: 'orderPackage',
});

db.OrderPackage.hasMany(db.Package, {
    foreignKey: 'packageId',
    as: 'packages',
});
db.Package.belongsTo(db.OrderPackage, {
    foreignKey: 'packageId',
    as: 'orderPackage',
});

db.Product.hasMany(db.OrderProductPackage, {
    foreignKey: 'productId',
    as: 'OrderProductPackages',
});
db.OrderProductPackage.belongsTo(db.Product, {
    foreignKey: 'productId',
    as: 'product',
});

db.Product.hasMany(db.ProductPackage, {
    foreignKey: 'productId',
    as: 'productPackages',
});
db.ProductPackage.belongsTo(db.Product, {
    foreignKey: 'productId',
    as: 'product',
});

db.Package.hasMany(db.ProductPackage, {
    foreignKey: 'packageId',
    as: 'productPackages',
});
db.ProductPackage.belongsTo(db.Package, {
    foreignKey: 'packageId',
    as: 'package',
});

module.exports = db;
