const Sequelize = require('sequelize');
const connection = new Sequelize('postgres','postgres','postgres',{
    host: 'localhost',
    dialect: 'postgres',
    port: 5434
});

module.exports = connection;