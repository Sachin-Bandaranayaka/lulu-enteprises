// app.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

// Import routes
const productRoutes = require('./routes/productRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
// Add other routes as needed

const app = express();

app.use(cors());
app.use(express.json()); // Use built-in middleware

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);
// Add other routes as needed

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
});