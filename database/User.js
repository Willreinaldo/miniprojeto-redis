const Sequelize = require("sequelize");
const connection = require("./database");

const User = connection.define('',{
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    mail:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

User.sync({force: false}).then(() => {});

module.exports = User;