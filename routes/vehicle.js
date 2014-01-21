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
exports.updateVehicleLocation = function(db){
	return function(req,res,next){
		Vehicle.update({id:req.body.id},{$set:{location:req.body.location}}, function(err, userList){
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

// Register a user to the appropriate rooms so as to send vehicles' location
exports.getVehicleLocation = function(db){
	return function(req){
		console.logger(req.data);
		for (var i = req.data.length - 1; i >= 0; i--) {
			req.io.join(req.data[i]);
		};
	}
}

// Periodically broadcast vehicles' location
// TODO: Broadcast only when a location has been updated in the database
exports.broadcastVehiclesLocation = function(app, db, vehicleRoomIds){
	return function(){
		console.logger("Broadcast vehicles location...");

		for (var i = vehicleRoomIds.length; i > 0; i--) {
			Vehicle.find({name:i},{name:1,location:1}, function(err,result){
				if(err){
					//if it failed, return error
					console.logger(err);
					// res.send("There was 0a problem getting the data from the database.");
				}
				else{
					// console.log(result);
					app.io.room(i).broadcast('talk', result);	
				}
			});
		};
	}
}

// Generate (random)location updates in the database
// NOTE: Development MODE only
exports.dummyUpdateVehiclesLocation = function(app, db, vehicleRoomIds){
	return function(req){
		console.logger("Update vehicles location...");
		for (var i = vehicleRoomIds.length; i > 0; i--) {
			
			Vehicle.update({name:i},{$set:{'location.longitude':(Math.random() * (21.120 - 24.0200) + 24.0200).toFixed(5)}}, function(err){
				if(err){
					//if it failed, return error
					console.logger("There was a problem adding the information to the database.");
					console.logger(err)
				}
				else{
					// console.log(result);
				}
			});
			Vehicle.update({name:i},{$set:{'location.latitude':(Math.random() * (39.120 - 35.0200) + 35.0200).toFixed(5)}}, function(err){
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
