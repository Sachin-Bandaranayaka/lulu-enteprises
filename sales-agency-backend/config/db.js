// config/db.js

const { Sequelize } = require('sequelize');
const config = require('./config.json')['development']; // Adjust for your environment

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// Optional: Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;