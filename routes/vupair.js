/*	################					################
 	################	KiDiYa Project	################
	################	----2014----	################
	################					################
*/
var Pair = require('../models/pair.js');

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