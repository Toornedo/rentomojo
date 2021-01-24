var http = require("http");
var express = require('express');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');

//start mysql connection
var connection = mysql.createConnection({
  host     : 'localhost', //mysql database host name
  user     : 'root', //mysql database user name
  password : '', //mysql database password
  database : 'rentomojo' //mysql database name
});

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected with mysql database...')
})
//end mysql connection
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
//start body-parser configuration
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
//end body-parser configuration

//create app server
var server = app.listen(3001,  "127.0.0.1", function () {

  var host = server.address().address
  var port = server.address().port

  console.log("App listening at http://%s:%s", host, port)

});

//rest api to get all customers
app.get('/', function (req, res) {
   connection.query('select * from `contacts` limit 10', function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});
//rest api to get a single customer data
app.get('/:email', function (req, res) {
   connection.query('select * from `contacts` where `email`=? limit 10', [req.params.email], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

//rest api to create a new customer record into mysql database
app.post('/contacts', function (req, res) {
   var params  = req.body;
   console.log(params);
   connection.query('INSERT INTO `contacts` SET ?', params, function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

//rest api to update record into mysql database
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