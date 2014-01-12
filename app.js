/*	################					################
	################	KiDiYa Project	################
	################	----2013----	################
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
var user = require('./routes/user.js');
var vehicle = require('./routes/vehicle.js');
var vupair = require('./routes/vupair.js');
var utils = require('./routes/utils.js');
var fs = require('fs');

// connect to Mongo when the app initializes
var db = mongoose.connect('mongodb://localhost:27017/nodetest1');
var app = express().http().io();

// all environments
app.set('port', process.env.PORT || 3000); // Whatever is in the environment variable PORT, or 3000 if there's nothing there
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

var development = true;

// // development only
// if ('development' == app.get('env')) {
//   app.use(express.errorHandler());
//   development = true;
// }

// Order matters! Nodejs will match the incoming request to the first
// app.io.route('ready', function(req) {
// 	console.log("IO received");
//     req.io.emit('talk', {
//         message: 'io event from an io route on the server'
//     });
// });

app.post('/userLogin', user.userLogin(db), routes.index);
app.get('/userLogout', user.userLogout(db), routes.index);
app.get('/', user.checkAuthUser(db, development), routes.index);
app.get('/map',user.checkAuthUser(db, development), utils.map(fs));
app.get('/userList',  user.checkAuthUser(db, development), user.userList(db));
app.get('/userListMobile',  user.checkAuthUser(db, development), user.userListMobile(db));
app.post('/addUser', user.addUser(db), user.userList(db));
app.post('/removeUser', user.removeUser(db),user.userList(db));
app.get('/vehicleList',  user.checkAuthUser(db, development), vehicle.vehicleList(db));
app.get('/vehicleListMobile',  user.checkAuthUser(db, development), vehicle.vehicleListMobile(db));
app.post('/addVehicle', vehicle.addVehicle(db), vehicle.vehicleList(db));
app.post('/removeVehicle', vehicle.removeVehicle(db),vehicle.vehicleList(db));
app.post('/reserveVehicle', vehicle.reserveVehicle(db), vehicle.vehicleList(db));
app.get('/getVehicleLocationAjax', vehicle.getVehicleLocationAjax(db));
// app.get('/getVehicleLocationSocket', vehicle.getVehicleLocationSocket(db));

app.get('/vuPairList',  user.checkAuthUser(db, development), vupair.vuPairList(db));
app.get('/vuPairListMobile',  user.checkAuthUser(db, development), vupair.vuPairListMobile(db));
app.post('/addVUPair', vupair.addVUPair(db));
app.post('/removeVUPair', vupair.removeVUPair(db));

app.post('/updateUserLocation',user.updateUserLocation(db), user.userListMobile(db));
app.post('/updateVehicleLocation',vehicle.updateVehicleLocation(db), vehicle.vehicleListMobile(db));
app.get('/cleanDatabase', utils.cleanDatabase(db));

app.io.route('getVehicleLocation2', vehicle.getVehicleLocationSocket(db))

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});