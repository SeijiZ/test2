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

var express    = require('express');
var bodyParser = require('body-parser');
var logger     = require('morgan');
var http       = require('http');
var https      = require('https');
var path       = require('path');
var mongodb    = require('mongodb');
var app        = express();
var ObjectID   = mongodb.ObjectID;

var options = {
	ca:'',
	cert:'',
	key:'',
};


mongodb.MongoClient.connect("mongodb://localhost:27017/testdb", function(err, db){
	if(err){
		console.log(err);
	}else{
		console.log("connected to db");
		//collection name
		items = db.collection("sampleColl");
	}
});

app.use(express.static('public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(logger('dev'));

//routing
app.get('/', function(req,res){
	res.sendFile(path.join(__dirname+'/public/views/index.html'));
});
//select * from
app.get("/test1", function(req, res){
	items.find().toArray(function(err, items){
		res.json(items);
	});
});


//routing
app.get('/admin', function(req,res){
	res.sendFile(path.join(__dirname+'/public/views/admin.html'));
});

var sample = [
		{name: "test1",lat: 10,lng: 10, style: "Japanese"},
		{name: "test2",lat: 20,lng: 20, style: "Japanese"},
		{name: "test3",lat: 30,lng: 30, style: "Western"},
		{name: "test4",lat: 40,lng: 40, style: "Western"}
]

//admin routing ===========================================
app.get('/admin/read', function(req,res){
	items.find().toArray(function(err, items){
		res.json(items);
	});
});

app.post('/admin/add', function(req,res){
	items.insertOne(req.body).then(function(){
		res.send(req.body);
	});
	console.log(req.body);
});

app.put('/admin/update', function(req,res){
	console.log(req.body);
	items.updateOne(
		{_id: new ObjectID(req.body._id)},
		{$set: {
			name:  req.body.name,
			lat:   req.body.lat,
			lng:   req.body.lng,
			style: req.body.style
		}},
		{upsert:true},
		function(err,r){
		if(err){
			console.log(err);
		}else{
			console.log(r)
			res.send(r);
		}
	});
});

app.delete('/admin/delete', function(req,res){
	console.log(req.body);
	items.remove({_id: new ObjectID(req.body._id)}, function(err, r){
		if(err){
			console.log(err);
		}res.send(r);
	});
})

//http,https config=========================================
http.createServer(app).listen(3000);
https.createServer(options, app).listen(8888);

console.log('server runnning at http://localhost:3000');
console.log('server runnning at https://localhost:8888');
