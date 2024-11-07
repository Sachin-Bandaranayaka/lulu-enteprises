// sales-agency-backend/models/index.js

const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false
  }
);

const db = {};

// Import models
const DiscountRule = require('./DiscountRule')(sequelize, DataTypes);
const Product = require('./Product')(sequelize, DataTypes);
const Customer = require('./Customer')(sequelize, DataTypes);
const Invoice = require('./Invoice')(sequelize, DataTypes);
const InvoiceItem = require('./InvoiceItem')(sequelize, DataTypes);
const Expense = require('./Expense')(sequelize, DataTypes);

// Add models to db object
db.DiscountRule = DiscountRule;
db.Product = Product;
db.Customer = Customer;
db.Invoice = Invoice;
db.InvoiceItem = InvoiceItem;
db.Expense = Expense;

// Add sequelize instance and class to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;