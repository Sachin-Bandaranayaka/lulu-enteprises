// sales-agency-backend/app.js

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();

const invoiceRoutes = require('./routes/invoiceRoutes');

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/discountRules', require('./routes/discountRuleRoutes'));
app.use('/api/invoices', invoiceRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;


// Sync database and start server
sequelize.sync()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Server is accessible at: http://192.168.8.101:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
    process.exit(1);
  });

module.exports = app;