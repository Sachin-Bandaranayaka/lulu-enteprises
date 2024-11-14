// controllers/invoiceController.js
// const { Invoice, InvoiceItem, Product } = require('../models');
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

exports.getLastInvoice = async (req, res) => {
  try {
    // Fetch the last invoice by sorting with createdAt in descending order
    const lastInvoice = await Invoice.findOne({
      order: [['createdAt', 'DESC']],
      include:[
        {
          model:InvoiceItem,
          as: 'items',
          include:[
            {
              model: Product,
              as: 'product',
              attributes: ['id','name','price']
            }
          ]
        }
      ]
    });

    if (!lastInvoice) {
      // If no invoice is found, return a 404 response
      return res.status(404).json({ success: false, message: 'No invoices found' });
    }

    res.json({ success: true, data: lastInvoice });
  } catch (error) {
    console.error('Error fetching last invoice:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
exports.deleteLastInvoice = async (req, res) => {
  try {
    // Find the last invoice by createdAt in descending order
    const lastInvoice = await Invoice.findOne({
      order: [['createdAt', 'DESC']],
      include: [
        { 
          model: InvoiceItem, 
          as: 'items',
          include: [
            {
              model:Product,
              as:'Product',
              attributes: ['id','name','stock'],
            },
          ], 
        },
      ],
    });

    if (!lastInvoice) {
      return res.status(404).json({ success: false, message: 'No invoices found' });
    }

    for (const item of lastInvoice.items) {
      const product = item.product;
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // Delete the invoice items first (if any), then the invoice itself
    await InvoiceItem.destroy({ where: { invoiceId: lastInvoice.id } });
    await lastInvoice.destroy();

    res.json({ success: true, message: 'Last invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting last invoice:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
// Add methods for getting invoices, updating invoices, etc.