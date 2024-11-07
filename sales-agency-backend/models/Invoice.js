// models/Invoice.js

module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define('Invoice', {
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    });
  
    Invoice.associate = (models) => {
      // An Invoice belongs to a Customer
      Invoice.belongsTo(models.Customer, {
        foreignKey: 'customerId',
        as: 'customer',
      });
  
      // An Invoice has many InvoiceItems
      Invoice.hasMany(models.InvoiceItem, {
        foreignKey: 'invoiceId',
        as: 'items',
      });
    };
  
    return Invoice;
  };