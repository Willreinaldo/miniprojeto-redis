const Sequelize = require('sequelize');

const connection = new Sequelize('user', 'postgres', 'williammonteiro', {
   host: 'localhost',
   dialect: 'postgres'
});

module.exports = connection;
