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

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, name_si, price, stock } = req.body;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (name !== undefined) product.name = name;
    if (name_si !== undefined) product.name_si = name_si;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Add more methods as needed.