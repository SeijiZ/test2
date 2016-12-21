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
	//return range =======================================================
	var rangeDicide = function(range){
		switch(range){
			case '1':
				var num = 2;
				return num;
				break;
			case '2':
				var num = 4;
				return num;
				break;
			case '3':
				var num = 6;
				return num;
				break;
		}
	}

	//return style =======================================================
	var styleDicide = function(style){
		switch (style){
			case '1':
				//				console.log("Western Style is selected");
				return "Western";
				break;
			case '2':
				//				console.log("Japanese Style is selected");
				return "Japanese";
				break;
			default:
				//				console.log("Both Style is selected");
				return {$in: ["Western", "Japanese"]};
				break;
		}
	}

	//return temperature =================================================
	var temperatureDecide = function(temperature){
		switch (temperature){
			case '1':
				//				console.log("Warm Temperature is selected");
				return "Warm";
				break;
			case '2':
				//				console.log("Cold Temperature is selected");
				return "Cold";
				break;
			default:
				//				console.log("Both Temperature is selected");
				return {$in: ["Warm", "Cold"]};
				break;
		}
	}

	console.log(req.query);
	var diffValue = rangeDicide(req.query.range);
	items.find({
		lat: {$gte: req.query.lat - diffValue, $lte: Number(req.query.lat) + Number(diffValue)},
		lng: {$gte: req.query.lng - diffValue, $lte: Number(req.query.lng) + Number(diffValue)},
		style: styleDicide(req.query.style),
		temperature: temperatureDecide(req.query.temperature)
	}).toArray(function(err, items){
		if(err){
			console.log(err);
			res.send(err);
		}else{
			console.log(items);
			res.json(items);
		}
	});
});

mainRouter.post('/post', function(req,res){
	req.body.rate = 3;
	console.log(req.body);
	items.insertOne(req.body).then(function(){
		res.send("Post Successed!!");
	});
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
			lat:         req.body.lat,
			lng:         req.body.lng,
			style:       req.body.style,
			temperature: req.body.temperature,
			comment:     req.body.comment,
			rate:        req.body.rate
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


//test data ==========================================================
//db.sampleColl.insert(
//	{lat: 30, lng: 135, style:"Japanese", temperature:"Warm", comment: "test1", rate:3},
//	{lat: 31, lng: 136, style:"Japanese", temperature:"Warm", comment: "test2", rate:3},
//	{lat: 32, lng: 137, style:"Japanese", temperature:"Warm", comment: "test3", rate:3},
//	{lat: 33, lng: 138, style:"Japanese", temperature:"Cold", comment: "test4", rate:3},
//	{lat: 34, lng: 139, style:"Japanese", temperature:"Cold", comment: "test5", rate:3},
//	{lat: 35, lng: 140, style: "Western", temperature:"Warm", comment: "test6", rate:3},
//	{lat: 36, lng: 141, style: "Western", temperature:"Warm", comment: "test7", rate:3},
//	{lat: 37, lng: 142, style: "Western", temperature:"Warm", comment: "test8", rate:3},
//	{lat: 38, lng: 143, style: "Western", temperature:"Cold", comment: "test9", rate:3},
//	{lat: 39, lng: 144, style: "Western", temperature:"Cold", comment:"test10", rate:3},
//	{lat: 40, lng: 145, style: "Western", temperature:"Cold", comment:"test11", rate:3}
//);
