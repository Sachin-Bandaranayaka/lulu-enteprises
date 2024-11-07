// controllers/expenseController.js
const { Expense } = require('../models');

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.json(expenses);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createExpense = async (req, res) => {
  const { type, amount, description } = req.body;
  try {
    const expense = await Expense.create({ type, amount, description });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).send(error.message);
  }
};