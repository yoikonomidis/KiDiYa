
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

exports.userList = function(db){
	return function(req, res){
		var collection = db.get('vessyCollection');
		collection.find({}, {}, function(e, userList){
			res.render('userList',{
				"userList": userList
			});
		});
	};
};

exports.vehicleList = function(db){
	return function(req, res){
		var collection = db.get('vessyCollection');
		collection.find({}, {}, function(e, vehicleList){
			res.render('vehicleList',{
				"vehicleList": vehicleList
			});
		});
	};
};

exports.newUser = function(req,res){
	res.render('newUser', { title: 'Add User'});
};

exports.newVehicle = function(req,res){
	res.render('newVehicle', { title: 'Add Vehicle'});
};

exports.addUser = function(db){
	return function(req, res){
		console.log("DEBUG");
		console.log(req);
		var collection = db.get('vessyCollection');
  		var user = req.body.user;
  		console.log(user);
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

exports.addVehicle = function(db){
	return function(req, res){

		var collection = db.get('vessyCollection');
  		var vehicle = req.body.vehicle;
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

exports.deleteUser = function(req, res){
	res.render('deleteUser', { title: 'Remove User'});
};

exports.deleteVehicle = function(req, res){
	res.render('deleteVehicle', { title: 'Remove Vehicle'});
};

exports.removeUser = function(db){
	return function(req,res){
		//Get form values
		var firstName  = req.body.firstname;
		console.log(firstName);

		//Set collection
		var collection = db.get('vessyCollection');

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
				res.redirect("userList");
				//And set the header so the address bar doesn't still say /addemp
				res.location("userList");
			}
		});
	}
}

exports.removeVehicle = function(db){
	return function(req, res){
		//Get form values
		var firstName  = req.body.firstname;
		console.log(firstName);

		//Set collection
		var collection = db.get('vessyCollection');

		//Submit to the DB
		collection.remove({
				"firstName" : firstName
		 }, function(err, doc){
			if(err){
				//if it failed, return error
				res.send("There was a problem removing the information from the database.");
			}
			else{
				console.log(firstName + " removed");
				//Forward to success page
				res.redirect("vehicleList");
				//And set the header so the address bar doesn't still say /addemp
				res.location("vehicleList");
			}
		});
	}
}

// exports.cleanVessy = function(db){
//  return function(req,res){
//   var collection = db.get('vessyCollection');
//   collection.remove({,} function(err,doc){
//    if(err){
//     //if it failed, return error
//     res.send("There was an error cleaning the database");
//    }
//    else{
//     //Forward to success page
//     res.redirect("vessy");
//     //And set the header so the address bar doesn't still say /cleanVessy
//     res.location("vessy");
//    }
//   });
//  }
// }