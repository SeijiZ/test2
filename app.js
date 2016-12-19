var express     = require('express');
var bodyParser  = require('body-parser');
var logger      = require('morgan');
var http        = require('http');
var https       = require('https');
var path        = require('path');
var mongodb     = require('mongodb');
var ObjectID    = mongodb.ObjectID;

var app         = express();
var mainRouter  = express.Router();
var adminRouter = express.Router();


var options = {
	ca:'',
	cert:'',
	key:'',
};

//connect to mongodb =================================================
mongodb.MongoClient.connect("mongodb://localhost:27017/testdb", function(err, db){
	if(err){
		console.log(err);
	}else{
		console.log("connected to db");
		//collection name
		items = db.collection("sampleColl");
	}
});

//configs ============================================================
app.use(express.static('public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use('/', mainRouter);
app.use('/admin', adminRouter);


//index routing ======================================================
mainRouter.get('/', function(req,res){
	res.sendFile(path.join(__dirname+'/public/views/index.html'));
});

mainRouter.get("/search", function(req, res){
	console.log(req.query);
	items.find().toArray(function(err, items){
		res.json(items);
	});
});

mainRouter.post('/post', function(req,res){
//	items.insertOne(req.body).then(function(){
//		res.send(req.body);
//	});
	console.log(req.body);
	res.send("post succcess");
});

//admin routing ======================================================
adminRouter.get('/', function(req,res){
	res.sendFile(path.join(__dirname+'/public/views/admin.html'));
});

adminRouter.get('/read', function(req,res){
	items.find().toArray(function(err, items){
		res.json(items);
	});
});

adminRouter.post('/add', function(req,res){
	items.insertOne(req.body).then(function(){
		res.send(req.body);
	});
	console.log(req.body);
});

adminRouter.put('/update', function(req,res){
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

adminRouter.delete('/delete/', function(req,res){
	console.log(req.query._id);
	items.remove({_id: new ObjectID(req.query._id)}, function(err, r){
		if(err){
			console.log(err);
		}else{
			res.send(r);
		}
	});
})

//http,https config===================================================
http.createServer(app).listen(3000);
https.createServer(options, app).listen(8888);

console.log('server runnning at http://localhost:3000');
console.log('server runnning at https://localhost:8888');
