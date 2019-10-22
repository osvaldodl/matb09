var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cors = require('cors');

var dbConn;
  
app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
  
  
// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});

app.get('/default', function(req, res){
    dbConn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  
        password: '',
        database: 'zonazul'
    });
    
    dbConn.connect(function(err) {
        if (err) throw err;
        res.send('Connected');
      });

})


// connect to database
app.post('/connect', function(req,res){
    console.log(req.body);
    dbConn = mysql.createConnection({
        host: req.body.host,
        port: req.body.port,
        user: req.body.user,  
        password: req.body.password,
        database: req.body.base
    });

    dbConn.connect(function(err) {
        if (err) return res.send( `Um erro ocorreu:  ${error} `);
        return res.status(200).send('Connected');
      });

});

   
// Recuperar todos usuarios
app.get('/usuario', function (req, res) {

    dbConn.query('SELECT * FROM usuario', function (error, results, fields) {
        if (error) return res.send( `Um erro ocorreu:  ${error} `);
        return res.status(200).send({ error: false, data: results, message: 'lista de usuarios.' });
    });
});
 
  
// set port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
 
module.exports = app;