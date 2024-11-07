// sales-agency-backend/models/DiscountRule.js

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class DiscountRule extends Model {}

  DiscountRule.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    min_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'min_amount'
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    sequelize,
    modelName: 'DiscountRule',
    tableName: 'discount_rules',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return DiscountRule;
};