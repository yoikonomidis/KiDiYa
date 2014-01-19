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
		Vehicle.find({name:req.query.name},{name:1,location:1}, function(err,result){
			if(err){
				//if it failed, return error
				res.send("There was a problem getting the data from the database.");
			}
			else{
				//Uncomment this line to avoid cross-domain errors
				res.setHeader("Access-Control-Allow-Origin", "*");
				res.send(result);
			}
		});
	}
}	

exports.getVehicleLocationSocket = function(db){
	return function(req){
		console.log(req.data)
		Vehicle.find({name:req.data.name},{name:1,location:1}, function(err,result){
			if(err){
				//if it failed, return error
				console.log(err);
				// res.send("There was 0a problem getting the data from the database.");
			}
			else{
				console.log(result);
				req.io.emit('talk', result)		
			}
		});	
	}
}

exports.getVehicleLocation = function(db){
	return function(req){
		console.log(req.data);
		for (var i = req.data.length - 1; i >= 0; i--) {
			req.io.join(req.data[i]);
		};
	}
}

exports.broadcastVehiclesLocation = function(app, db, vehicleRoomIds){
	return function(){
		console.log("Broadcast vehicles location...");

		for (var i = vehicleRoomIds.length; i > 0; i--) {
			Vehicle.find({name:i},{name:1,location:1}, function(err,result){
				if(err){
					//if it failed, return error
					console.log(err);
					// res.send("There was 0a problem getting the data from the database.");
				}
				else{
					// console.log(result);
					app.io.room(i).broadcast('talk', result);	
				}
			});
		};
		// Vehicle.find({name:1},{name:1,location:1}, function(err,result){
		// 	if(err){
		// 		//if it failed, return error
		// 		console.log(err);
		// 		// res.send("There was 0a problem getting the data from the database.");
		// 	}
		// 	else{
		// 		// console.log(result);
		// 		app.io.room(1).broadcast('talk', result);	
		// 	}
		// });
		// Vehicle.find({name:2},{name:1,location:1}, function(err,result){
		// 	if(err){
		// 		//if it failed, return error
		// 		console.log(err);
		// 		// res.send("There was 0a problem getting the data from the database.");
		// 	}
		// 	else{
		// 		// console.log(result);
		// 		app.io.room(2).broadcast('talk', result);	
		// 	}
		// });
		// Vehicle.find({name:3},{name:1,location:1}, function(err,result){
		// 	if(err){
		// 		//if it failed, return error
		// 		console.log(err);
		// 		// res.send("There was 0a problem getting the data from the database.");
		// 	}
		// 	else{
		// 		// console.log(result);
		// 		app.io.room(3).broadcast('talk', result);	
		// 	}
		// });
	}
}

exports.dummyUpdateVehiclesLocation = function(app, db, vehicleRoomIds){
	return function(req){
		console.log("Update vehicles location...");
		for (var i = vehicleRoomIds.length; i > 0; i--) {
			// Vehicle.find({name:i},{}, function(err,vehicle){
			// 	if(err){
			// 		//if it failed, return error
			// 		console.log(err);
			// 		// res.send("There was 0a problem getting the data from the database.");
			// 	}
			// 	else{
			// 		// console.log(vehicle[0].location);
			// 		tmplong = vehicle[0].location.longitude  + 0.1;
			// 		tmplat = vehicle[0].location.latitude + 0.2;
			// 		Vehicle.update({name:i},{$set:{'location.longitude':tmplong}}, function(err){
			// 			if(err){
			// 				//if it failed, return error
			// 				console.log("There was a problem adding the information to the database.");
			// 				console.log(err)
			// 			}
			// 			else{
			// 				// next();
			// 				// console.log(lon.longitude);
			// 			}
			// 		});
			// 		Vehicle.update({name:i},{$set:{'location.latitude':tmplat}}, function(err){
			// 			if(err){
			// 				//if it failed, return error
			// 				console.log("There was a problem adding the information to the database.");
			// 				console.log(err)
			// 			}
			// 			else{
			// 				// next();
			// 				// console.log(lon.longitude);
			// 			}
			// 		});	
			// 	}
			// });
					Vehicle.update({name:i},{$set:{'location.longitude':(Math.random() * (50.120 - 40.0200) + 40.0200).toFixed(5)}}, function(err){
						if(err){
							//if it failed, return error
							console.log("There was a problem adding the information to the database.");
							console.log(err)
						}
						else{
							// next();
							// console.log(result);
						}
					});
					Vehicle.update({name:i},{$set:{'location.latitude':(Math.random() * (20.120 - 30.0200) + 30.0200).toFixed(5)}}, function(err){
						if(err){
							//if it failed, return error
							console.log("There was a problem adding the information to the database.");
							console.log(err)
						}
						else{
							// next();
							// console.log(result);
						}
					});
		}
	}
}
// exports.getVehicleLocationSocket = function(db,callback){
// 	return function(req){
// 		console.log(req.data)
// 		Vehicle.find({id:req.data.id}, function(err,result){
// 			if(err){
// 				//if it failed, return error
// 				console.log(err);
// 				// res.send("There was 0a problem getting the data from the database.");
// 			}
// 			else{
// 				// var body = JSON.stringify(result);
// 				//Uncomment this line to avoid cross-domain errors
// 				// res.setHeader("Access-Control-Allow-Origin", "*");
// 				// console.log(vehicle);
// 				// req.io.emit('talk', vehicle)
// 				callback(result);	
// 			}
// 		});	
// 	}
// }