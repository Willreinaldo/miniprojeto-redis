const express = require('express');
const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json()) // To parse the incoming requests with JSON payloads
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get("/", (req, res) => {
	res.render('index');
});
const connection = require('./database/database');
connection
	.authenticate().then(()=> {
		console.log("Connected");
	}).catch((error)=> {
		console.log(error);
	})

app.post("/salvar", (req, res) => {
   /* var title = req.body.title;
    var description = req.body.description;
    Publication.create({
        title: title,
        description: description
    }).then(() => {*/
        res.redirect("/");
    });


app.listen(8080, () => { console.log("App rodando"); });