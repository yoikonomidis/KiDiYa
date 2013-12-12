
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'KiDiYa' });
};

// ################ Dummy ################

exports.emplist = function(db){
	return function(req, res){
		var collection = db.get('empcollection');
		collection.find({},{},function(e,docs){
			res.render('emplist',{
				"emplist":docs
			});
		});
	};
};

exports.newemp = function(req,res){
	res.render('newemp', { title: 'Add Employee'});
};

exports.addemp = function(db){
	return function(req,res){
		//Get form values
		var firstName = req.body.firstName;
		var lastName  = req.body.lastName;
		var managerId = req.body.managerId;

		//Set collection
		var collection = db.get('empcollection');

		//Submit to the DB
		collection.insert({
				"firstName": firstName,
				"lastName" : lastName,
				"managerId": managerId
		}, function(err,doc){
			if(err){
				//if it failed, return error
				res.send("There was a problem adding the information to the database.");
			}
			else{
				//Forward to success page
				res.redirect("emplist");
				//And set the header so the address bar doesn't still say /addemp
				res.location("emplist");
			}
		});
	}
}

exports.delemp = function(req,res){
	res.render('delemp', { title: 'Remove Employee'});
};

exports.rememp = function(db){
	return function(req,res){
		//Get form values
		var firstName  = req.body.firstname;
		console.log(firstName);

		//Set collection
		var collection = db.get('empcollection');

		//Submit to the DB
		collection.remove({
				"firstName" : firstName
		 }, function(err,doc){
			if(err){
				//if it failed, return error
				res.send("There was a problem removing the information from the database.");
			}
			else{
				console.log(firstName + " removed");
				//Forward to success page
				res.redirect("emplist");
				//And set the header so the address bar doesn't still say /addemp
				res.location("emplist");
			}
		});
	}
}

exports.androiddata = function(req, res){

	var firstname = req.body.firstName;
	var lastname = req.body.lastName;
	console.log(req);
}

// ################ KiDiYa ################

// Prints the user list on the browser
exports.userList = function(db){
	return function(req, res){
		var collection = db.get('userCollection');
		collection.find({}, {}, function(e, userList){
			res.render('userList',{
				"userList": userList
			});
		});
	};
};

// Returns the user list as a response
exports.userListMobile = function(db){
	return function(req, res){
		var collection = db.get('userCollection');
		collection.find({}, {}, function(e, userList){
			res = userList;
		});
	};
};

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

// Returns the vuPair list as a response
exports.vehicleListMobile = function(db){
	return function(req, res){
		var collection = db.get('vehicleCollection');
		collection.find({}, {}, function(e, vehicleList){
			res = vehicleList;
		});
	};
};

// Prints the vuPair list on the browser
exports.vuPairList = function(db){
	return function(req, res){
		var collection = db.get('vuPairCollection');
		collection.find({}, {}, function(e, vuPairList){
			res.render('vuPairList',{
				"vuPairList": vuPairList
			});
		});
	};
};

// Returns the vuPair list as a response
exports.vuPairListMobile = function(db){
	return function(req, res){
		var collection = db.get('vuPairCollection');
		collection.find({}, {}, function(e, vuPairListList){
			res = vuPairListList;
		});
	};
};

exports.newUser = function(req,res){
	res.render('newUser', { title: 'Add User'});
};

exports.newVehicle = function(req,res){
	res.render('newVehicle', { title: 'Add Vehicle'});
};

// Inserts a user in the user list
exports.addUser = function(db){
	return function(req, res){
		var collection = db.get('userCollection');
  		var user = req.body;
  		collection.insert(user, function(err, userList){
			if(err){
				//if it failed, return error
				res.send("There was a problem adding the information to the database.");
			}
			else{
				//Forward to success page
				res.redirect("userList");
				//And set the header so the address bar doesn't still say /addUser
				res.location("userList");
			}
		});
	}
}

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

// Inserts a vehicle-user pair in the vuPair list
exports.addVUPair = function(db){
	return function(req, res){
		var collection = db.get('vuPairCollection');
  		var vuPair = req.body;
  		collection.insert(vuPair, function(err, vuPairList){
			if(err){
				//if it failed, return error
				res.send("There was a problem adding the information to the database.");
			}
			else{
				//Forward to success page
				res.redirect("vuPairList");
				//And set the header so the address bar doesn't still say /addUser
				res.location("vuPairList");
			}
		});
	}
}

exports.deleteUser = function(req, res){
	res.render('deleteUser', { title: 'Remove User'});
};

exports.deleteVehicle = function(req, res){
	res.render('deleteVehicle', { title: 'Remove Vehicle'});
};

// Removes a user from the user list
exports.removeUser = function(db){
	return function(req,res){
		var collection = db.get('userCollection');
		var user = req.body;
		//Submit to the DB
		collection.remove({"user.id" : user.user.id}, function(err,userList){
			if(err){
				//if it failed, return error
				res.send("There was a problem removing the user from the database.");
			}
			else{
				console.log(user.user.name + " removed");
				//Forward to success page
				res.redirect("userList");
				//And set the header so the address bar doesn't still say /addemp
				res.location("userList");
			}
		});
	}
}

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

// Removes a vuPair from the vuPair list
exports.removeVUPair = function(db){
	return function(req, res){
		var collection = db.get('vuPairCollection');
		var vuPair = req.body;

		//Submit to the DB
		collection.remove({"vuPair.id" : vuPair.vuPair.id}, function(err, vuPairList){
			if(err){
				//if it failed, return error
				res.send("There was a problem removing the vehicle from the database.");
			}
			else{
				console.log(vuPair.vuPair.type + " removed");
				//Forward to success page
				res.redirect("vuPairList");
				//And set the header so the address bar doesn't still say /addemp
				res.location("vuPairList");
			}
		});
	}
}

// Clean the database
exports.cleanDatabase = function(db){
 return function(req,res){

  var collection = db.get('userCollection');
  collection.remove({}, function(err,doc){
   if(err){
    //if it failed, return error
    res.send("There was an error cleaning the database");
   }
  });

  var collection = db.get('vehicleCollection');
  collection.remove({}, function(err,doc){
   if(err){
    //if it failed, return error
    res.send("There was an error cleaning the database");
   }
  });

  var collection = db.get('vuPairCollection');
  collection.remove({}, function(err,doc){
   if(err){
    //if it failed, return error
    res.send("There was an error cleaning the database");
   }
  });
  //Forward to success page
  res.redirect("/");
  //And set the header so the address bar doesn't still say /cleanVessy
  res.location("/");
 }
}