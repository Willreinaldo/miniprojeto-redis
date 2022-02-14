const express = require('express');
const cors = require('cors');
const redis = require('redis');
const app = express();
const User = require("./database/User");
app.use(express.urlencoded({ extended: false }));
app.use(express.json()) // To parse the incoming requests with JSON payloads
app.set('view engine', 'ejs');
app.use(express.static('public'));


app.use((req, res, next) => {
    //Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
    //Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

//Conexão com o banco de dados SQL
const connection = require('./database/index');
connection
    .authenticate().then(() => {
        console.log("Connected");
    }).catch((error) => {
        console.log(error);
    })

//redis configuration
const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});
client.on("connect", function (error) {
    console.log("Conectado!");
});

client.on("error", function (error) {
    console.log(error);
});

//renderização do index
app.get("/", (req, res) => {
    User.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then(User => {        
        // Buscando pela chave
         client.get(User[0].id, function (err, reply) {
            if (reply != null) {
                const teste = JSON.parse(reply.toString());
                res.render("index", {
                    rascunho: teste,
                    User: User
                });
            } else {
                console.log("Chave não encontrada");
            }
        });
    });
});
//renderização do perfil
app.get("/perfil", (req, res) => {
    User.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then(User => {
        res.render("perfil", {
            User: User,
        });
    });
});
app.post("/delete", (req, res) => {
    var id = req.body.id

    client.del(id, function (err, resp) {
        if (err) throw err;
        console.log("chave deletada: ", resp);
    });
    if (User.length > 1) {
        User.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.redirect("/perfil");
            console.log(`${User} apagado com sucesso`)
        });
    }
    else if (User.length == 0) {
        User.update({ name: "", mail: "" }, {
            where: {
                id: id
            }
        }).then(() => {
            res.redirect("/perfil");
        })
    }
    else {
        res.redirect("/perfil");
    }
})
//POST dos dados de nome e email
app.post("/salvar", async (req, res) => {
    var name = req.body.name
    var mail = req.body.mail
    var user = await User.findOne({ where: { name: name } });

    console.log("ID:   =>", user.id);
    if (User.length > 0) {
        res.redirect("/perfil");
    }
    else {
        User.create({
            name: name,
            mail: mail
        }).then(() => {
            res.redirect("/perfil");
            console.log("Done!");
        });
    }
})

app.post("/edit", (req, res) => {
    var name = req.body.name;
    var mail = req.body.mail;
    var id = req.body.id

    User.update({ name: name, mail: mail }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/perfil");
    })
})

app.post("/postar", async (req, res) => {
    const obj = req.body.rascunho
    let id = req.body.id
    console.log("ID POSTAR", id);
    console.log("OBJ RASCUNHO =>",obj)
    await client.setex(id, 7200, JSON.stringify(obj), function (err, resp) {
        if (err) throw err;
        console.log(resp);
    })
    res.redirect("/");
    console.log("Rota redirecionada!");
});;

app.listen(8080, () => { console.log("App rodando"); });