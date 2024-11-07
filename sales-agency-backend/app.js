// sales-agency-backend/app.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Use routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/discountRules', require('./routes/discountRuleRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Server is accessible at: http://192.168.8.101:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });

module.exports = app;