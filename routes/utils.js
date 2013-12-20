/*	################					################
 	################	KiDiYa Project	################
	################	----2013----	################
	################					################
*/

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