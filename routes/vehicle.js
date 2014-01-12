/*	################					################
 	################	KiDiYa Project	################
	################	----2013----	################
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
		 		console.log("There was a problem updating the information to the database.");
		 	}
		 	else{
		 		console.log("Vehicle with id " + id + " was unlocked " + updated);

		 		// We reserve the vehicle
		 		collection.update({"vehicle.id":id}, {$set:{"vehicle.reserved":1}}, function(err){
		 			if(err){
		 				//if it failed, return error
		 				res.send("There was a problem updating the information to the database.");
		 			}
		 			else{
		 				console.log("Vehicle with id " + id + " was reserved");
		 				next();
		 			}
		 		});
		 	}
		});
	}
}

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

exports.getVehicleLocationAjax = function(db){
	return function(req,res){
		console.log("Request received");
		console.log(req.query);
		Vehicle.find({id:req.query.id}, function(err,vehicle){
			if(err){
				//if it failed, return error
				res.send("There was a problem getting the data from the database.");
			}
			else{
				var body = JSON.stringify(vehicle);
				//Uncomment this line to avoid cross-domain errors
				res.setHeader("Access-Control-Allow-Origin", "*");
				res.send(body);
				console.log(vehicle);
				console.log(body);
			}
		});
	}
}	

exports.getVehicleLocationSocket = function(db,data){
		Vehicle.find({id:data.id}, function(err,vehicle){
			if(err){
				//if it failed, return error
				console.log(err);
				// res.send("There was 0a problem getting the data from the database.");
			}
			else{
				// var body = JSON.stringify(vehicle);
				//Uncomment this line to avoid cross-domain errors
				// res.setHeader("Access-Control-Allow-Origin", "*");
				// res.send(body);
				console.log(vehicle[0].location);
			}
		});
	
}