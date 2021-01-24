var http = require("http");
var express = require('express');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');


var connection = mysql.createConnection({
  host     : 'localhost', 
  user     : 'root', 
  password : '', 
  database : 'rentomojo' 
});

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected with mysql database...')
})
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({     
  extended: true
}));

var server = app.listen(3001,  "127.0.0.1", function () {

  var host = server.address().address
  var port = server.address().port

  console.log("App listening at http://%s:%s", host, port)

});

app.get('/', function (req, res) {
   connection.query('select * from `contacts` limit 10', function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

app.get('/:email', function (req, res) {
   connection.query('select * from `contacts` where `email`=? limit 10', [req.params.email], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});


app.post('/contacts', function (req, res) {
   var params  = req.body;
   console.log(params);
   connection.query('INSERT INTO `contacts` SET ?', params, function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});


app.put('/contacts/update', function (req, res) {
   connection.query('UPDATE `contacts` SET `name`=?,`phone`=? where `email`=?', [req.body.name,req.body.phone,req.body.email], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

app.delete('/contacts/delete',(req,res)=>{
    connection.query('DELETE from `contacts` where `email`=?',[req.body.email],(error,results)=>{
        if(error)
        throw error;
        res.end(JSON.stringify(results));
    })
})