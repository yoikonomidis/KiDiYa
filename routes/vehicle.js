/*	################					################
 	################	KiDiYa Project	################
	################	----2013----	################
	################					################
*/

// Prints the vehicle list on the browser
exports.vehicleList = function(db){
	return function(req, res){
		var collection = db.get('vehicleCollection');
		collection.find({}, {}, function(e, vehicleList){
			res.render('vehicleList',{
				"vehicleList": vehicleList
			});
		});
	};
};

// Returns the vehicle list as a response
exports.vehicleListMobile = function(db){
	return function(req, res){
		var collection = db.get('vehicleCollection');
		collection.find({}, {}, function(e, vehicleList){
			res = vehicleList;
		});
	};
};

exports.newVehicle = function(req,res){
	res.render('newVehicle', { title: 'Add Vehicle'});
};

// Inserts a vehicle in the vehicle list
exports.addVehicle = function(db){
	return function(req, res){
		var collection = db.get('vehicleCollection');
  		var vehicle = req.body;
  		collection.insert(vehicle, function(err, vehicleList){
			if(err){
				//if it failed, return error
				res.send("There was a problem adding the information to the database.");
			}
			else{
				//Forward to success page
				res.redirect("vehicleList");
				//And set the header so the address bar doesn't still say /addUser
				res.location("vehicleList");
			}
		});
	}
}

exports.deleteVehicle = function(req, res){
	res.render('deleteVehicle', { title: 'Remove Vehicle'});
};

// Removes a vehicle from the vehicle list
exports.removeVehicle = function(db){
	return function(req, res){
		var collection = db.get('vehicleCollection');
		var vehicle = req.body;

		//Submit to the DB
		collection.remove({"vehicle.id" : vehicle.vehicle.id}, function(err, vehicleList){
			if(err){
				//if it failed, return error
				res.send("There was a problem removing the vehicle from the database.");
			}
			else{
				console.log(vehicle.vehicle.type + " removed");
				//Forward to success page
				res.redirect("vehicleList");
				//And set the header so the address bar doesn't still say /addemp
				res.location("vehicleList");
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