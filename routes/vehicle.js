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
		Vehicle.update({_id:req.body._id}, {$set:{N:req.body.N}}, {upsert: true}, function(err){
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
		Vehicle.find({_id:req.body._id}).remove(function(err,userList){
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
	  	var _id = req.body.vehicle._id;
		
		// We first unlock the vehicle
		collection.update({"vehicle._id":_id}, {$set:{"vehicle.locked":0}}, function(err, updated){
		 	if(err){
		 		//if it failed, return error
		 		console.logger("There was a problem updating the information to the database.");
		 	}
		 	else{
		 		console.logger("Vehicle with id " + _id + " was unlocked " + updated);

		 		// We reserve the vehicle
		 		collection.update({"vehicle._id":_id}, {$set:{"vehicle.reserved":1}}, function(err){
		 			if(err){
		 				//if it failed, return error
		 				res.send("There was a problem updating the information to the database.");
		 			}
		 			else{
		 				console.logger("Vehicle with id " + _id + " was reserved");
		 				next();
		 			}
		 		});
		 	}
		});
	}
}	

// Updates a vehicle's location in the database
exports.updateVehicleLocation = function(app, db, vehicle){
	return function(req){
		Vehicle.update({_id:req.data._id}, {$set:{L:req.data.L}}, function(err){
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

// TODO: Remove duplicate - merge with Socket-based
// Updates a vehicle's location in the database - REST
exports.updateVehicleLocationREST = function(app, db, vehicle){
	return function(req, res, next){
		Vehicle.update({_id:req.body._id}, {$set:{L:req.body.L}}, function(err){
			if(err){
				//if it failed, return error
				res.send("There was a problem adding the information to the database.");
			}
			else{
				next(); // This is for the rest API
			}
		}); 
	}
}

// Broadcast the received updated location of a vehicle to the registered users - Socket
exports.broadcastVehiclesLocation = function(app, db, req){
	// return function(req){ // This is necessarry when this function is used as a callback in a REST routing scheme
		console.logger("Broadcast vehicles location...");

		Vehicle.find({_id:req.data._id}, {_id:1, N:1, L:1}, function(err, result){

			if(err){
				//if it failed, return error
				console.logger(err);
				// res.send("There was a problem getting the data from the database.");
			}
			else{
				// console.log(result);
				app.io.room(req.data.N).broadcast('vehicleInfo', result);	
			}
		});
	// }
}

// TODO: Remove duplicate - merge with Socket-based
// Broadcast the received updated location of a vehicle to the registered users - REST
exports.broadcastVehiclesLocationREST = function(app, db){
	return function(req){ // This is necessarry when this function is used as a callback in a REST routing scheme
		console.logger("Broadcast vehicles location...");

		Vehicle.find({_id:req.body._id}, {_id:1, N:1, L:1}, function(err, result){

			if(err){
				//if it failed, return error
				console.logger(err);
				// res.send("There was a problem getting the data from the database.");
			}
			else{
				// console.log(result);
				app.io.room(req.body.N).broadcast('vehicleInfo', result);	
			}
		});
	}
}

// //Periodically broadcast vehicles' location
// exports.broadcastVehiclesLocation = function(app, db, vehicleRoomIds){
// 	return function(){
// 		console.logger("Broadcast vehicles location...");

// 		for (var i = vehicleRoomIds.length-1; i >= 0; i--) {
// 			//NOTE: change commenting to broadcast a single bus
// 			Vehicle.find({N:parseInt(vehicleRoomIds[i])},{N:1,L:1}, function(err,result){
// 			// Vehicle.find({_id:1},{N:1,L:1}, function(err,result){
// 				if(err){
// 					//if it failed, return error
// 					console.logger(err);
// 					// res.send("There was a problem getting the data from the database.");
// 				}
// 				else{
// 					// console.log(result);
// 					//NOTE: change commenting to broadcast a single room
// 					app.io.room(parseInt(vehicleRoomIds[i])).broadcast('vehicleInfo', result);	
// 					// app.io.room(parseInt(vehicleRoomIds[0])).broadcast('vehicleInfo', result);
// 				}
// 			});
// 		}
//  	}
//  }

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

		Vehicle.find({N:vehicleName}, {_id:1, N:1, L:1}, function(err, result){
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
			//NOTE: change commenting to update a single bus
			Vehicle.update({N:parseInt(vehicleRoomIds[i])},{$set:{'L.H':(Math.random() * (21.120 - 24.0200) + 24.0200).toFixed(5)}}, {multi: true}, function(err,result){
			// Vehicle.update({_id:1},{$set:{'L.H':(Math.random() * (21.120 - 24.0200) + 24.0200).toFixed(5)}}, {multi: true}, function(err,result){
				if(err){
					//if it failed, return error
					console.logger("There was a problem adding the information to the database.");
					console.logger(err)
				}
				else{
					// console.log(result);
				}
			});
			Vehicle.update({N:parseInt(vehicleRoomIds[i])},{$set:{'L.V':(Math.random() * (39.120 - 35.0200) + 35.0200).toFixed(5)}}, {multi: true}, function(err,result){
			// Vehicle.update({_id:1},{$set:{'L.V':(Math.random() * (39.120 - 35.0200) + 35.0200).toFixed(5)}}, {multi: true}, function(err,result){
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
				console.log("Error_0");
				// res.send("There was a problem updating the information to the database.");
			}
			else{
				for(var i=0;i<60;i++){
					if(i<20){
						var Bus = new Vehicle({_id:i, N:"220", L:{H:((Math.random() * (21.120 - 24.0200) + 24.0200).toFixed(5)),V:((Math.random() * (39.120 - 35.0200) + 35.0200).toFixed(5))}}).save(function(err){
							if(err){
							//if it failed, return error
								console.log("Error_1");
								// console.log(Bus);
								// res.send("There was a problem adding the information to the database.");
							}
							else{
								console.log('Done');
								// console.log(Bus);
							}
						});
					}
					if(i>=20 && i<40){
						var Bus = new Vehicle({_id:i, N:"222", L:{H:((Math.random() * (21.120 - 24.0200) + 24.0200).toFixed(5)),V:((Math.random() * (39.120 - 35.0200) + 35.0200).toFixed(5))}}).save(function(err){
							if(err){
							//if it failed, return error
								console.log("Error_2");
								// res.send("There was a problem adding the information to the database.");
							}
							else{
								console.log('Done');
							}
						});
					}
					if(i >= 40 && i<60){
						var Bus = new Vehicle({_id:i, N:"235", L:{H:((Math.random() * (21.120 - 24.0200) + 24.0200).toFixed(5)),V:((Math.random() * (39.120 - 35.0200) + 35.0200).toFixed(5))}}).save(function(err){
							if(err){
							//if it failed, return error
								console.log("Error_3");
								// res.send("There was a problem adding the information to the database.");
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

