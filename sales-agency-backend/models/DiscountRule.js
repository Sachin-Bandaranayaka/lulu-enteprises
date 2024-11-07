// models/DiscountRule.js

module.exports = (sequelize, DataTypes) => {
  const DiscountRule = sequelize.define('DiscountRule', {
    minAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    percentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  // No associations in this example, but you can add them if needed
  DiscountRule.associate = (models) => {
    // Define associations if necessary
  };

  return DiscountRule;
};