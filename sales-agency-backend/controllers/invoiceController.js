// controllers/invoiceController.js
const { Invoice, InvoiceItem, Product, Customer } = require('../models');

exports.createInvoice = async (req, res) => {
  const { customerDetails, items, subtotal, discount, total } = req.body;
  try {
    // Find or create customer
    let customer = await Customer.findOne({ where: { storeName: customerDetails.storeName } });
    if (!customer) {
      customer = await Customer.create({
        storeName: customerDetails.storeName,
        contactNumber: customerDetails.contactNumber,
      });
    }

    // Create invoice
    const invoice = await Invoice.create({ customerId: customer.id, subtotal, discount, total });

    // Create invoice items and update product stock
    for (const item of items) {
      const product = await Product.findByPk(item.id);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: 'Not enough stock for product: ' + product.name });
      }

      await InvoiceItem.create({
        invoiceId: invoice.id,
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    res.status(201).json({ invoiceId: invoice.id });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Add methods for getting invoices, updating invoices, etc.