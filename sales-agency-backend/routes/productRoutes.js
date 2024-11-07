// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.post('/', productController.addProduct);
router.put('/:id', productController.updateProduct);
// Add more routes as needed

module.exports = router;