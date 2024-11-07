// models/Customer.js

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    storeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Add any additional fields as needed
  });

  Customer.associate = (models) => {
    // A Customer can have many Invoices
    Customer.hasMany(models.Invoice, {
      foreignKey: 'customerId',
      as: 'invoices',
    });
  };

  return Customer;
};