/*	################					################
	################	KiDiYa Project	################
	################	----2014----	################
	################					################
*/

/**
 * Module dependencies.
 */
var express = require('express.io');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var routes = require('./routes');
var vehicle = require('./routes/vehicle.js');
var utils = require('./routes/utils.js');
var fs = require('fs');

var getopt = require('posix-getopt');
var moment = require('moment');

// connect to Mongo when the app initializes
var db = mongoose.connect('mongodb://localhost:27017/nodetest1');
var app = express().http().io();

var httpPort = 3000;
var development = true;
var optionsParser, option;
var time = null;

// // development only
// if ('development' == app.get('env')) {
//   app.use(express.errorHandler());
//   development = true;
// }

// Parse the options from the command line and modify the corresponding variables
optionsParser = new getopt.BasicParser('p:(port)h(help)d:(development)', process.argv);

while((option = optionsParser.getopt()) !== undefined){
	switch (option.option){
	
		case 'p' :
			httpPort = option.optarg;
			break;
		case 'd' :
			if(option.optarg == "true"){
				development = true;
			}
			else{
				development = false;
			}
			console.log('Development mode set to: ' + development);
			break;
		case 'h' :
			console.log('\t-h --help\t\t for this info');
			console.log('\t-d --development=MODE\t set development mode');
			console.log('\t-p --port=PORT\t\t set http port');
			process.exit();
			break;
	}
}

// Update time variable every second
var updateTime = function(){
	time = moment().format();
	setTimeout(updateTime, 1000);
};
updateTime();

// Logger with time. Use that instead of the default console.log() so as to also get the timestamp of the logged event
console.logger = function(str){
	if(!development){
		return;
	}

	var message = "";
	if(time){
		message += time;
		time = null;
	}
	console.log(message + ": " + str);
};

// all environments
app.set('port', httpPort || 3000); // Whatever is in the environment variable PORT, or 3000 if there's nothing there
app.set('views', path.join(__dirname, 'views')); // Join all arguments together and normalize the resulting path
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
// app.use(express.cookieParser('your secret here'));
// app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// When no related to the request page found in views, respond with 404 error
app.use(function(req, res, next){
  res.status(404);
    res.render('404', { url: req.url });
});
// This is error middleware. Whenever next(err) is called from a function, error middleware functions are called
app.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  console.logger(err.stack);
  res.render('500', {
      status: err.status || 500
    , error: err
  });
});

// Order matters! Nodejs will match the incoming request to the first
//################ REST API ################
app.get('/', routes.index);
app.get('/map', utils.map(fs));
app.get('/populateVehicleCollection', vehicle.populateVehicleCollection(db), routes.index);
app.get('/populateStationCollection', vehicle.populateStationCollection(db), routes.index);

//################ SOCKET API ################
app.io.route('updateVehicleLocation', vehicle.updateVehicleLocation(app, db, vehicle));
app.io.route('getVehicleLocation', vehicle.getVehicleLocation(app, db, vehicle));
app.io.route('deregisterVehiclesLocation', vehicle.deregisterVehiclesLocation(app, db, vehicle));
app.io.route('getStations', vehicle.getStations(app, db, vehicle));

// For development purposes only
// Test Accelerometer-related messages
app.io.route('updateAccelerometer', function(){
	console.logger("Accelerometer");
});

// The array containing all the vehicle ids  which also serve as express.io room identifiers
// var vehicleRoomIds = [ 	"220",
// 	 					"222",
// 						 "235"
// 					 	]


// Broadcast the vehicles location to the registered users
// TODO: instead of periodically sending the information, send it on database update events
// if(development){
// 	setInterval(vehicle.broadcastVehiclesLocation(app, db, vehicleRoomIds), 1000);
// }

// Update database with random vehicles location - Simulate vehicle movement when in Development MODE
// if(development){
// 	setInterval(vehicle.dummyUpdateVehiclesLocation(app, db, vehicleRoomIds), 1000);
// }

//################ START SERVER ################
app.listen(app.get('port'), function(){
  console.logger('Express server listening on port ' + app.get('port'));
});

//################ HANDLE EXIT-UNCAUGHT EXCEPTIONS ################
// Perform other terminating procedures when exiting with (Ctrl+C)
process.on('SIGINT', function() {
  console.logger("Gracefully shutting down from  SIGINT (Crtl-C).");
  // Some other terminating procedures should go here
  process.exit();
});

// Catch uncaught exceptions and terminate the program
process.on('uncaughtException', function (err) {
	console.error('An uncaughtException was found, the program will end.');
	console.log(err);
	// Do some logging.
	process.exit(1);
});
