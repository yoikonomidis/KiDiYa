/*	################					################
 	################	KiDiYa Project	################
	################	----2014----	################
	################					################
*/

var Vehicle = require('../models/vehicle.js');
// Prints the vehicle list on the browser
exports.vehicleList = function(db){
	return function(req, res){
		Vehicle.find({},{}, function(e, vehicleList){
			res.render('vehicleList',{
				"vehicleList": vehicleList
			});
		});
	};
};

// Returns the vehicle list as a response
exports.vehicleListMobile = function(db){
	return function(req, res){
		Vehicle.find({},{}, function(e, vehicleList){
			var body = JSON.stringify(vehicleList);
			res.send(body);
		});
	};
};

exports.newVehicle = function(req,res){
	res.render('newVehicle', { title: 'Add Vehicle'});
};

// Inserts a vehicle in the vehicle list
exports.addVehicle = function(db){
	return function(req, res, next){
		new Vehicle(req.body).save( function(err, vehicleList){
			if(err){
				//if it failed, return error
				res.send("There was a problem adding the information to the database.");
			}
			else{
				next();
			}
		});
	}
}

// Updates a vehicle's information in the database
exports.updateVehicleInfo = function(db){
	return function(req, res, next){
		Vehicle.update({id:req.body.id}, {$set:{name:req.body.name}}, {upsert: true}, function(err){
			if(err){
				//if it failed, return error
				res.send("There was a problem updating the information to the database.");
			}
			else{
				console.logger("Vehicle Info Updated"); 
			}
		});
	}
}

exports.deleteVehicle = function(req, res){
	res.render('deleteVehicle', { title: 'Remove Vehicle'});
};

// Removes a vehicle from the vehicle list
exports.removeVehicle = function(db){
	return function(req,res, next){
		Vehicle.find({id:req.body.id}).remove(function(err,userList){
			if(err){
				//if it failed, return error
				res.send("There was a problem removing the user from the database.");
			}
			else{
				next();
			}
		});
	}
}

// Reserves a vehicle. If successful, it redirects to the vehicle list
// TODO: Convert to Mongoose
exports.reserveVehicle = function(db){
	// We save this in _this so as to use it below, otherwise it goes out of scope and we cannot call functions belonging to it
	var _this = this;
	return function(req, res, next){

	  	var collection = db.get('vehicleCollection');
	  	var id = req.body.vehicle.id;
		
		// We first unlock the vehicle
		collection.update({"vehicle.id":id}, {$set:{"vehicle.locked":0}}, function(err, updated){
		 	if(err){
		 		//if it failed, return error
		 		console.logger("There was a problem updating the information to the database.");
		 	}
		 	else{
		 		console.logger("Vehicle with id " + id + " was unlocked " + updated);

		 		// We reserve the vehicle
		 		collection.update({"vehicle.id":id}, {$set:{"vehicle.reserved":1}}, function(err){
		 			if(err){
		 				//if it failed, return error
		 				res.send("There was a problem updating the information to the database.");
		 			}
		 			else{
		 				console.logger("Vehicle with id " + id + " was reserved");
		 				next();
		 			}
		 		});
		 	}
		});
	}
}	

// Updates a vehicle's location in the database
exports.updateVehicleLocation = function(app, db, vehicle){
	return function(req, res, next){
		Vehicle.update({id:req.body.id}, {$set:{location:req.body.location}}, function(err){
			if(err){
				//if it failed, return error
				res.send("There was a problem adding the information to the database.");
			}
			else{
				// next(); // This is for the rest API
				app.io.route(vehicle.broadcastVehiclesLocation(app, db, req)); // This is for the Socket API
			}
		}); 
	}
}

// Broadcast the received updated location of a vehicle to the registered users
exports.broadcastVehiclesLocation = function(app, db, req){
	// return function(req){ // This is necessarry when this function is used as a callback in a REST routing scheme
		console.logger("Broadcast vehicles location...");

		Vehicle.find({id:req.body.id}, {id:1, name:1, location:1}, function(err, result){

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
	// }
}

//Periodically broadcast vehicles' location
// exports.broadcastVehiclesLocation = function(app, db, vehicleRoomIds){
// 	return function(){
// 		console.logger("Broadcast vehicles location...");

// 		for (var i = vehicleRoomIds.length; i > 0; i--) {
// 			Vehicle.find({name:parseInt(vehicleRoomIds[i])},{name:1,location:1}, function(err,result){
// 				if(err){
// 					//if it failed, return error
// 					console.logger(err);
// 					// res.send("There was a problem getting the data from the database.");
// 				}
// 				else{
// 					// console.log(result);
// 					app.io.room(parseInt(vehicleRoomIds[i])).broadcast('vehicleInfo', result);	
// 				}
// 			});
// 		}
// 	}
// }

// Register a user to the appropriate rooms so as to send vehicles' location
exports.getVehicleLocation = function(app, db, vehicle){
	return function(req){
		// console.logger(req.data);
		for (var i = req.data.length - 1; i >= 0; i--) {
			req.io.join(req.data[i]);
			app.io.route(vehicle.initializeVehiclesLocation(app, db, req.data[i]));
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

// Generate (random)location updates in the database
// NOTE: Development MODE only
exports.dummyUpdateVehiclesLocation = function(app, db, vehicleRoomIds){
	return function(req){
		console.logger("Update vehicles location...");
		for (var i = vehicleRoomIds.length; i > 0; i--) {
			
			Vehicle.update({name:parseInt(vehicleRoomIds[i])},{$set:{'location.longitude':(Math.random() * (21.120 - 24.0200) + 24.0200).toFixed(5)}}, {multi: true}, function(err,result){
				if(err){
					//if it failed, return error
					console.logger("There was a problem adding the information to the database.");
					console.logger(err)
				}
				else{
					// console.log(result);
				}
			});
			Vehicle.update({name:parseInt(vehicleRoomIds[i])},{$set:{'location.latitude':(Math.random() * (39.120 - 35.0200) + 35.0200).toFixed(5)}}, {multi: true}, function(err,result){
				if(err){
					//if it failed, return error
					console.logger("There was a problem adding the information to the database.");
					console.logger(err)
				}
				else{
					// console.log(result);
				}
			});
		}
	}
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

