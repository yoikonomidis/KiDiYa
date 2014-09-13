/*	################					################
 	################	KiDiYa Project	################
	################	----2014----	################
	################					################
*/

var Vehicle = require('../models/vehicle.js');
var Station = require('../models/stations.js');

// Updates a vehicle's location in the database
exports.updateVehicleLocation = function(app, db, vehicle){
	return function(req){
		console.logger("Update vehicle location");
		Vehicle.update({id:req.data.id}, {$set:{name:req.data.name, location:req.data.location}}, {upsert: true}, function(err){
			if(err){
				//if it failed, return error
				res.send("There was a problem adding the information to the database.");
			}
			else{
				app.io.route(vehicle.broadcastVehiclesLocation(app, db, req)); // This is for the Socket API
			}
		}); 
	}
}

// Broadcast the received updated location of a vehicle to the registered users - Socket
exports.broadcastVehiclesLocation = function(app, db, req){
	// return function(req){ // This is necessarry when this function is used as a callback in a REST routing scheme
		console.logger("Broadcast vehicles location...");

		Vehicle.find({id:req.data.id}, {id:1, name:1, location:1}, function(err, result){

			if(err){
				//if it failed, return error
				console.logger(err);
				// res.send("There was a problem getting the data from the database.");
			}
			else{
				// console.log(result);
				app.io.room(req.data.name).broadcast('vehicleInfo', result);	
			}
		});
	// }
}

exports.getStations = function(app, db){
	return function(req){
		console.logger("Sending stations")
		Station.find({},{properties:1, geometry:1 },function(err,result){
			if(err){
				//if it failed, return error
				console.logger(err);
			}
			else{
				req.io.emit('stationInfo',result);
			}
		})
	}
}

// Deregister a user from a room - stop sending him vehicles' location
exports.deregisterVehiclesLocation = function(app, db, vehicle){
	return function(req){
		console.logger(req.data.vehicles);
		for (var i = req.data.vehicles.length - 1; i >= 0; i--) {
			req.io.leave(req.data.vehicles[i]);			
		};
	}
}

// Register a user to the appropriate rooms so as to send vehicles' location
exports.getVehicleLocation = function(app, db, vehicle){
	return function(req){
		console.logger(req.data.vehicles);
		for (var i = req.data.vehicles.length - 1; i >= 0; i--) {
			req.io.join(req.data.vehicles[i]);
			app.io.route(vehicle.initializeVehiclesLocation(app, db, req.data.vehicles[i]));
		};
	}
}

// Initialize vehicles locations on users map
exports.initializeVehiclesLocation = function(app, db, vehicleName){
	
		console.logger("Initialize vehicles location...");

		Vehicle.find({name:vehicleName}, {id:1, name:1, location:1}, function(err, result){
			if(err){
				//if it failed, return error
				console.logger(err);
				// res.send("There was a problem getting the data from the database.");
			}
			else{
				// console.log(result);
				app.io.room(vehicleName).broadcast('vehicleInfo', result);	
			}
		});
	
}

//This function cleans the Vehicle collection and repopulates it with 60 vehicles, 20 in each line.
exports.populateVehicleCollection = function(db){
	return function(req,res,next){
		(new Vehicle).cleanAll(function(err){
			if(err){
				//if it failed, return error
				console.log("Error");
				res.send("There was a problem updating the information to the database.");
			}
			else{
				for(var i=0;i<60;i++){
					if(i<20){
						var Bus = new Vehicle({id:i, name:"220", location:{longitude:((Math.random() * (21.120 - 24.0200) + 24.0200).toFixed(5)),latitude:((Math.random() * (39.120 - 35.0200) + 35.0200).toFixed(5))}}).save(function(err){
							if(err){
							//if it failed, return error
								console.log("Error");
								res.send("There was a problem adding the information to the database.");
							}
							else{
								console.log('Done');
							}
						});
					}
					if(i>=20 && i<40){
						var Bus = new Vehicle({id:i, name:"222", location:{longitude:((Math.random() * (21.120 - 24.0200) + 24.0200).toFixed(5)),latitude:((Math.random() * (39.120 - 35.0200) + 35.0200).toFixed(5))}}).save(function(err){
							if(err){
							//if it failed, return error
								console.log("Error");
								res.send("There was a problem adding the information to the database.");
							}
							else{
								console.log('Done');
							}
						});
					}
					if(i >= 40 && i<60){
						var Bus = new Vehicle({id:i, name:"235", location:{longitude:((Math.random() * (21.120 - 24.0200) + 24.0200).toFixed(5)),latitude:((Math.random() * (39.120 - 35.0200) + 35.0200).toFixed(5))}}).save(function(err){
							if(err){
							//if it failed, return error
								console.log("Error");
								res.send("There was a problem adding the information to the database.");
							}
							else{
								console.log('Done');
							}
						});
					}
		 		}
		 		next();
			}
		});
	}
}

//This function cleans the Station collection and repopulates it with 60 stations.
exports.populateStationCollection = function(db){
	return function(req,res,next){
		(new Station).cleanAll(function(err){
			if(err){
				//if it failed, return error
				console.log("Error");
				res.send("There was a problem updating the information to the database.");
			}
			else{
				for(var i=0;i<60;i++){					
					var mockStation = new Station({properties:{id:i, name:i}, geometry:{coordinates:[((Math.random() * (39.120 - 35.0200) + 35.0200).toFixed(5)), ((Math.random() * (21.120 - 24.0200) + 24.0200).toFixed(5))]}}).save(function(err){
						if(err){
						//if it failed, return error
							console.log("Error");
							res.send("There was a problem adding the information to the database.");
						}
						else{
							// console.log('Done');
						}
					});
					
		 		}
		 		next();
			}
		});
	}
}

