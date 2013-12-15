
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

//Connect to MongoDB
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest1');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000); // Whatever is in the environment variable PORT, or 3000 if there's nothing there
app.set('views', path.join(__dirname, 'views')); // Join all arguments together and normalize the resulting path
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Order matters! Nodejs will match the incoming request to the first
app.post('/userLogin', routes.userLogin(db), routes.index);
app.get('/userLogout', routes.userLogout(db), routes.index);
app.get('/', routes.checkAuthUser(db), routes.index);

app.get('/emplist', routes.emplist(db));
app.get('/newemp', routes.newemp);
app.get('/delemp', routes.delemp);

app.get('/userList',  routes.checkAuthUser(db), routes.userList(db));
app.get('/userListMobile',  routes.checkAuthUser(db), routes.userListMobile(db));
// app.get('/newUser', routes.newUser);
app.get('/deleteUser',  routes.checkAuthUser(db), routes.deleteUser);
app.get('/vehicleList',  routes.checkAuthUser(db), routes.vehicleList(db));
app.get('/vehicleListMobile',  routes.checkAuthUser(db), routes.vehicleListMobile(db));
// app.get('/newVehicle', routes.newVehicle);
app.get('/deleteVehicle',  routes.checkAuthUser(db), routes.deleteVehicle);

app.get('/vuPairList',  routes.checkAuthUser(db), routes.vuPairList(db));

app.post('/addemp', routes.addemp(db));
app.post('/rememp', routes.rememp(db));
//TODO write androiddata to the database
app.post('/androiddata', routes.androiddata);	//this can route directly to "/addemp"

app.post('/addUser', routes.addUser(db));
app.post('/removeUser', routes.removeUser(db));
app.post('/addVehicle', routes.addVehicle(db));
app.post('/removeVehicle', routes.removeVehicle(db));
app.post('/addVUPair', routes.addVUPair(db));
app.post('/removeVUPair', routes.removeVUPair(db));
app.post('/updateUserLocation',routes.updateUserLocation(db));
app.get('/cleanDatabase', routes.cleanDatabase(db));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


