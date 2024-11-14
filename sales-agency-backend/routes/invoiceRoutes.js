// routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

router.post('/', invoiceController.createInvoice);
router.delete('/lastInvoice', invoiceController.deleteLastInvoice);
// Add more routes as needed

router.get('/lastInvoice', invoiceController.getLastInvoice);

module.exports = router;