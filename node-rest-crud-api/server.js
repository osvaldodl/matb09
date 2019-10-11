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
        password: 'dino',
        database: 'zonazul'
    });
    
    dbConn.connect(function(err) {
        if (err) throw err;
        res.send('Connected');
      });

})




// connect to database
app.post('/connect', function(req,res){

     dbConn = mysql.createConnection({
        host: req.body.host,
        user: req.body.user,  
        password: req.body.password,
        database: req.body.database
    });

    dbConn.connect(function(err) {
        if (err) throw err;
        return res.send('Connected');
      });

});


   
// Recuperar todos usuarios
app.get('/usuario', function (req, res) {
    dbConn.query('SELECT * FROM usuario', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'lista de usuarios.' });
    });
});
 
 
// Recuperar usuario por id
app.get('/usuario/:id', function (req, res) {
  
    let user_id = req.params.id;
  
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
  
    dbConn.query('SELECT * FROM usuario where id_usuario=?', user_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'users list.' });
    });
  
});
 
 
// Adicionar um usuario 
app.post('/usuario', function (req, res) {
  
    let user = req.body.user;
  
    if (!user) {
        return res.status(400).send({ error:true, message: 'Please provide user' });
    }
  
    dbConn.query("INSERT INTO usuario SET ? ", { user: user }, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
    });
});
 
 
//  Atualizar um usuario pelo seu id
app.put('/usuario', function (req, res) {
  
    let user_id = req.body.user_id;
    let user = req.body.user;
  
    if (!user_id || !user) {
        return res.status(400).send({ error: user, message: 'Please provide user and user_id' });
    }
  
    dbConn.query("UPDATE users SET usuario = ? WHERE id = ?", [user, user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'user has been updated successfully.' });
    });
});
 
 
//  Apagar um usuario
app.delete('/usuario', function (req, res) {
  
    let user_id = req.body.user_id;
  
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    dbConn.query('DELETE FROM usuario WHERE id = ?', [user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User has been updated successfully.' });
    });
}); 
 
// set port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
 
module.exports = app;