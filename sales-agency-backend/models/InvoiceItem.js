// models/InvoiceItem.js

module.exports = (sequelize, DataTypes) => {
    const InvoiceItem = sequelize.define('InvoiceItem', {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    });
  
    InvoiceItem.associate = (models) => {
      // An InvoiceItem belongs to an Invoice
      InvoiceItem.belongsTo(models.Invoice, {
        foreignKey: 'invoiceId',
        as: 'invoice',
      });
  
      // An InvoiceItem belongs to a Product
      InvoiceItem.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product',
      });
    };
  
    return InvoiceItem;
  };