var express     = require('express');
var bodyParser  = require('body-parser');
var logger      = require('morgan');
var http        = require('http');
var https       = require('https');
var path        = require('path');
var mysql       = require('mysql');
var connection  = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'testdb'
});
var table = "items";

var app         = express();
var mainRouter  = express.Router();
var adminRouter = express.Router();


var options = {
	ca:'',
	cert:'',
	key:'',
};

//connect to mysql ===================================================
connection.connect(function(err){
	if(err){
		console.error('error connectiong: ' + err.stack);
return;
	}
	console.log('connected as id ' + connection.threadId);
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
				return "'Western'";
				break;
			case '2':
				//				console.log("Japanese Style is selected");
				return "'Japanese'";
				break;
			default:
				//				console.log("Both Style is selected");
				return "'Western' OR style = 'Japanese'";
				break;
		}
	}

	//return temperature =================================================
	var temperatureDecide = function(temperature){
		switch (temperature){
			case '1':
				//				console.log("Warm Temperature is selected");
				return "'Warm'";
				break;
			case '2':
				//				console.log("Cold Temperature is selected");
				return "'Cold'";
				break;
			default:
				//				console.log("Both Temperature is selected");
				return "'Warm' OR temperature = 'Cold'";
				break;
		}
	}

	console.log(req.query);
	var diffValue = rangeDicide(req.query.range);
	var searchRange = {
		latMin: Number(req.query.lat) - Number(diffValue),
		latMax: Number(req.query.lat) + Number(diffValue),
		lngMin: Number(req.query.lng) - Number(diffValue),
		lngMax: Number(req.query.lng) + Number(diffValue),
	};
	var sqlCond = {
		lat:         "(lat BETWEEN " + searchRange.latMin + " AND " + searchRange.latMax + ")",
		lng:         "(lng BETWEEN " + searchRange.lngMin + " AND " + searchRange.lngMax + ")",
		style:       "(style = " + styleDicide(req.query.style) + ")",
		temperature: "(temperature = " + temperatureDecide(req.query.temperature) + ")"
	};
	var sql = "SELECT * FROM " + table + " WHERE " + sqlCond.lat + " AND " + sqlCond.lng + " AND " + sqlCond.style + " AND " + sqlCond.temperature;
	console.log(sql);

	connection.query(sql, function(err, rows, fields){
		if(err){
			//error ========
			console.log("err" + err);
			res.send(err);
		}else{
			//success =========
			console.log("selected items: " + rows);
			console.log(fields);
			res.json(rows);
		}
	});
});

mainRouter.post('/post', function(req,res){
	req.body.rate = 3;
	console.log(req.body);
	var sql = "INSERT INTO " + table + " (lat, lng, style, temperature, comment, rate) " + " VALUES " + " (" + req.body.lat + "," + req.body.lng + ",'" + req.body.style + "','" + req.body.temperature + "','" + req.body.comment + "'," + req.body.rate + " )";
	console.log(sql);
	connection.query(sql, function(err, rows, fields){
		if(err){
			console.log(err);
			res.send(err);
		}else{
			res.send("Post Successed");
		}
	});
});

//admin routing ======================================================
adminRouter.get('/', function(req,res){
	res.sendFile(path.join(__dirname+'/public/views/admin.html'));
});

adminRouter.get('/read', function(req,res){
	var sql = "SELECT * FROM " + table;
	console.log(sql);
	connection.query(sql, function(err, rows, field){
		if(err){
			console.log(err);
		}else{
			res.json(rows);
		}
	});
});

adminRouter.post('/add', function(req,res){
	var sql = "INSERT INTO " + table + 
		" (lat, lng, style, temperature, comment, rate) VALUES (" + req.body.lat + 
		"," + req.body.lng + 
		",'" + req.body.style + 
		"','" + req.body.temperature + 
		"','" + req.body.comment + 
		"'," + req.body.rate + " )";
	console.log(sql);
	connection.query(sql, function(err, rows, field){
		if(err){
			console.log(err);
			res.send("server err");
		}else{
			console.log(rows);
			res.send(req.body);
		}
	});
});

adminRouter.put('/update', function(req,res){
	console.log(req.body);
	var sql = "UPDATE " + table + 
		" SET lat = " + req.body.lat + 
		", lng = " + req.body.lng + 
		", style = '" + req.body.style + 
		"', temperature = '" + req.body.temperature + 
		"', comment = '" + req.body.comment + 
		"', rate = " + req.body.rate + 
		" WHERE lat = " + req.body.lat;
	connection.query(sql, function(err, rows, field){
		if(err){
			console.log(err);
			res.send("server err");
		}else{
			console.log("updated " + rows );
			res.send("item updated successfully");
		}
	});
});

adminRouter.delete('/delete/', function(req,res){
	console.log("req.query here " + req.query);
	var sql = "DELETE FROM " + table + " WHERE lat = " + req.query.lat;
	console.log(sql);
	connection.query(sql, function(err, rows, field){
		if(err){
			console.log(err);
			res.send("server err");
		}else{
			console.log(rows);
			res.send("item deleted successfully");
		}
	});
});

//http,https config===================================================
http.createServer(app).listen(3000);
https.createServer(options, app).listen(8888);

console.log('server runnning at http://localhost:3000');
console.log('server runnning at https://localhost:8888');

////mysql commands =======================================================
//create table items(
//	lat double not null,
//	lng double,
//	style varchar(15),
//	temperature varchar(15),
//	comment varchar(200),
//	rate int
//);
//
//insert into items (lat, lng, style, temperature, comment, rate) values (35.3, 140.5, 'Western', 'Cold', 'first mysql record', 3);

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
