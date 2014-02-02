/*	################					################
 	################	KiDiYa Project	################
	################	----2014----	################
	################					################
*/

var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var vehicleSchema = new Schema({
	id:Number,
	name:String,
	location:
	{
		longitude:Number,
		latitude:Number
	}
});


//Method for cleaning the vehicles colection. It may be redundant!
vehicleSchema.methods.cleanAll = function (cb) {
  	return this.model('Vehicle').remove(cb);
}


module.exports = mongoose.model('Vehicle', vehicleSchema, 'vehicle');

