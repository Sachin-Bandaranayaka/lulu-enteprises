// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db');

// Import routes
const productRoutes = require('./routes/productRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
// ... other routes

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);
// ... other routes

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
});