// var User = require('../models/user.js');
// var Vehicle = require('../models/vehicle.js');
// var Pair = require('../models/pair.js');

// Return Home page
exports.index = function(req, res){
  res.render('index', { title: 'KiDiYa' });
};