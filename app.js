//// settings
//
//var express = require('express');
//var http    = require('http');
//var https   = require('https');
//var path    = require('path');
//var app     = express();
//var mongo   = require('./mongo.js');
//
//var options = {
//	ca:'',
//	cert:'',
//	key:'',
//};
//
//app.use(express.static('public'));
//app.use('/bower_components', express.static(__dirname + '/bower_components'));
//
////routing
//app.get('/', function(req,res){
//	res.sendFile(path.join(__dirname+'/index.html'));
//});
//
////samplefile here
////var sample = {
////	lat: 30,
////	lng: 30
////};
//
//
//app.get("/test", function(req, res, next){
//	res.json(mongo.read);
//});
//
////http,https config=========================================
//http.createServer(app).listen(3000);
//https.createServer(options, app).listen(8888);
//
//console.log('server runnning at http://localhost:3000');
//console.log('server runnning at https://localhost:8888');

// settings

var express = require('express');
var http    = require('http');
var https   = require('https');
var path    = require('path');
var mongodb = require('mongodb');
var app     = express();

var options = {
	ca:'',
	cert:'',
	key:'',
};

mongodb.MongoClient.con

mongodb.MongoClient.connect("mongodb://localhost:27017/memo", function(err, db){
	if(err){
		console.log(err);
	}else{
		console.log("connected to db");;
		users = db.collection("users");
	}
});

app.use(express.static('public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

//routing
app.get('/', function(req,res){
	res.sendFile(path.join(__dirname+'/public/views/index.html'));
});
//select * from
app.get("/test1", function(req, res){
	users.find().toArray(function(err, items){
		res.json(items);
	});
});


//routing
app.get('/admin', function(req,res){
	res.sendFile(path.join(__dirname+'/public/views/admin.html'));
});

//http,https config=========================================
http.createServer(app).listen(3000);
https.createServer(options, app).listen(8888);

console.log('server runnning at http://localhost:3000');
console.log('server runnning at https://localhost:8888');
