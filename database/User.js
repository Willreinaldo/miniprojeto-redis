  
const Sequelize = require("sequelize");
const connection = require("./index");
const Users = connection.define('users', {
    name: {
        type: Sequelize.STRING(50),
       allowNull: false
    },
    mail: {
        type: Sequelize.STRING(50),
        allowNuull: false
    }
});
Users.sync({force: false}).then(() => {
    console.log('table user created!');
})

module.exports = Users;