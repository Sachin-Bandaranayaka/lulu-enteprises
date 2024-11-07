// controllers/productController.js
const { Product } = require('../models');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.addProduct = async (req, res) => {
  const { name, name_si, price, stock } = req.body;
  try {
    const product = await Product.create({ name, name_si, price, stock });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Add more methods for updating and deleting products if needed.