/*	################					################
 	################	KiDiYa Project	################
	################	----2013----	################
	################					################
*/
var User = require('../models/user.js');

// Login procedure of a user
// If login is successful, redirects to the home page
exports.userLogin = function(db){
	return function(req, res, next){
		// var collection = db.get('userCollection');
  // 		var user = req.body;
  // 		collection.find({"user.name" : user.user.name, "user.password" : user.user.password}, function(err,fetchedUser){
		User.find({name : req.body.name, password : req.body.password}, function(err,fetchedUser){
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
exports.checkAuthUser = function(db, development){
	if(!development){
		return function(req, res, next){
			console.log(req.session.user_id);
  			if(!req.session.user_id){
    			res.send('You are not authorized to view this page');
  			}else{
    			next();
  			}
  		};
  	}else{
  		return function(req, res, next){
  			next();
  		}
  	}
};

// Prints the user list on the browser
exports.userList = function(db){
	return function(req, res){
		User.find({},{}, function(err, userList){	
			res.render('userList',{
				"userList": userList
			});
		});
	};
};

exports.userListMobile = function(db){
	return function(req, res){
		User.find({}, {}, function(e, userList){
			// console.log(res);
			var body = JSON.stringify(userList);
 			res.writeHead(200, {
				'Content-Length': body.length,
				'Content-Type': 'application/json'
			});
			res.write(body);
			res.end();
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
  		new User(req.body).save( function(err, userList){	
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

exports.deleteUser = function(req, res){
	res.render('deleteUser', { title: 'Remove User'});
};

// Removes a user from the user list
exports.removeUser = function(db){
	return function(req,res, next){
		User.find({id:req.body.id}).remove(function(err,userList){
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

exports.updateUserLocation = function(db){
	return function(req,res,next){
		// User.find({id:req.body.id}).update({$set:{location:req.body.location}}, function(err, userList){
		User.update({id:req.body.id},{$set:{location:req.body.location}}, function(err, userList){	
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