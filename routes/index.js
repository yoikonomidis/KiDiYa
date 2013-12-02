
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

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
		var firstName = req.body.firstname;
		var lastName  = req.body.lastname;
		var managerId = req.body.managerid;

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
	var lastname = req
	console.log(data);
}