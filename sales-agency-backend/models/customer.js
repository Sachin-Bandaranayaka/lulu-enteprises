// models/Customer.js

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'Customer',
    {
      storeName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      underscored: true, // This converts camelCase to snake_case in the database
    }
  );

  Customer.associate = (models) => {
    // A Customer can have many Invoices
    Customer.hasMany(models.Invoice, {
      foreignKey: 'customerId',
      as: 'invoices',
    });
  };

  return Customer;
};