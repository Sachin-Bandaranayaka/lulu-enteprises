// models/index.js
const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const DataTypes = Sequelize.DataTypes;

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import model definition functions
const ProductModel = require('./Product');
const CustomerModel = require('./Customer');
const InvoiceModel = require('./Invoice');
const InvoiceItemModel = require('./InvoiceItem');
const ExpenseModel = require('./Expense');
const DiscountRuleModel = require('./DiscountRule');

// Initialize models by invoking the model functions
db.Product = ProductModel(sequelize, DataTypes);
db.Customer = CustomerModel(sequelize, DataTypes);
db.Invoice = InvoiceModel(sequelize, DataTypes);
db.InvoiceItem = InvoiceItemModel(sequelize, DataTypes);
db.Expense = ExpenseModel(sequelize, DataTypes);
db.DiscountRule = DiscountRuleModel(sequelize, DataTypes);

// Set up associations after all models are initialized
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;