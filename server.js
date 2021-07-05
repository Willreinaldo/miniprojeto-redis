const express = require('express');
const app = express();
const User = require("./database/User");
app.use(express.urlencoded({ extended: false }));
app.use(express.json()) // To parse the incoming requests with JSON payloads
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get("/", (req, res) => {
    res.render('index');
});
//Conexão com o banco de dados SQL
const connection = require('./database/database');
connection
    .authenticate().then(() => {
        console.log("Connected");
    }).catch((error) => {
        console.log(error);
    })

//renderização do index
app.get("/index", (req, res) => {
    res.render("index");
});
//renderização do perfil
app.get("/perfil", (req, res) => {
    User.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then(User => {
        res.render("perfil", {
            User: User
        });
    });
});
//POST dos dados de nome e email
app.post("/salvar", (req, res) => {
    var name = req.body.name
    var mail = req.body.mail
    if (User.name != null) {

    }
    else {
        User.create({
            name: name,
            mail: mail
        }).then((name) => {
            res.redirect("/perfil");
            console.log("Done!");
        });
    }

});
app.listen(8080, () => { console.log("App rodando"); });