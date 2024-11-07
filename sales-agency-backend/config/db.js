// config/db.js

const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('./config.json')[env];

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