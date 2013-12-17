/*	################					################
 	################	KiDiYa Project	################
	################	----2013----	################
	################					################
*/

// Login procedure of a user
// If login is successful, redirects to the home page
exports.userLogin = function(db){
	return function(req, res, next){
		var collection = db.get('userCollection');
  		var user = req.body;
  		collection.find({"user.name" : user.user.name, "user.password" : user.user.password}, function(err,fetchedUser){
			if(err){
				//if it failed, return error
				res.send("There was a problem retrieving the user from the database.");
			}
			else{
				// Check if the fetched list from the database is empty, i.e name/password pair was incorrect
				if(Object.keys(fetchedUser).length == 0){
       				res.send('Bad user/pass');
    			}
    			else{
    				req.session.user_id = fetchedUser[0]._id;
       				next();
  				}
  					
    		}	
		});
  	};
};

// Logout procedure of a user
// If successful, redirects to the home page
exports.userLogout = function(db){
	return function(req, res, next){
  		delete req.session.user_id;
  		// res.redirect('index');
  		next();
 	};
};

// Checks whether the user has previously authenticated himself in the system
exports.checkAuthUser = function(db){
	return function(req, res, next){
		console.log(req.session.user_id);
  		if(!req.session.user_id){
    		res.send('You are not authorized to view this page');
  		}else{
    		next();
  		}
  	};
};

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
			console.log(res);
			res = userList;
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
// If successful, login procedure follows, and user is redirected to the home page
exports.addUser = function(db){
	return function(req, res, next){
		var collection = db.get('userCollection');
  		var user = req.body;
  		collection.insert(user, function(err, userList){
			if(err){
				//if it failed, return error
				res.send("There was a problem adding the information to the database.");
			}
			else{
				//Forward to success page
				// res.redirect("userList");
				//And set the header so the address bar doesn't still say /addUser
				// res.location("userList");
				next();
			}
		});
	}
}

exports.deleteUser = function(req, res){
	res.render('deleteUser', { title: 'Remove User'});
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

exports.updateUserLocation = function(db){
	return function(req,res){

	  	var collection = db.get('userCollection');
	  	var name = req.body.user.name;
	  	var location = req.body.user.location;
		// collection.remove({"vuPair.id" : vuPair.vuPair.id}, function(err, vuPairList){
	  	console.log(location);
   		collection.update({"user.name":name}, {$set:{"user.location":location}}, function(err, userList){
		 	if(err){
		 		//if it failed, return error
		 		res.send("There was a problem adding the information to the database.");
		 	}
		 });
		// console.log(req);
	}
}