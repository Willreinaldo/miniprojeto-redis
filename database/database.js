const Sequelize = require('sequelize');
const connection = new Sequelize('users','root','williammonteiro10',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;