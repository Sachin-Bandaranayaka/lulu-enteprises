// models/Expense.js

module.exports = (sequelize, DataTypes) => {
    const Expense = sequelize.define('Expense', {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  
    // No associations in this example, but you can add them if needed
    Expense.associate = (models) => {
      // Define associations if necessary
    };
  
    return Expense;
  };