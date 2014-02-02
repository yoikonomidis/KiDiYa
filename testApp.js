
/*
 * Module dependencies.
 */
var express = require('express.io');
var http = require('http');
var path = require('path');
var app = express().http().io();
var io = require('./node_modules/socket.io/node_modules/socket.io-client');
// var client = require('socket.io-client');

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// var socket = io.connect('http://localhost:3000');
// while(1){
  	// socket.emit('updateVehicleLocation', {id:1,name:"220",location:{longitude:11,latitude: 11}});	
// 	console.log("message emitted");
// }


var sockets = new Array(100);
for (var i = sockets.length - 1; i >= 0; i--) {
	sockets[i]=io.connect('http://localhost:3000',{'force new connection': true});
	sockets[i].emit('updateVehicleLocation', {id:1,name:"220",location:{longitude:1+i,latitude: 1+i}});
};

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
