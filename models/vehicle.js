/*	################					################
 	################	KiDiYa Project	################
	################	----2014----	################
	################					################
*/

var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
//I=id N=name L=location H=horizontal(longitude) V=vertical(latitude)
var vehicleSchema = new Schema(
	{
		_id:Number,
		N:String,
		L:
		{
			H:Number,
			V:Number
		}
	}
	// ,
	// {
	// 	_id:false
	// }
);

//Method for cleaning the vehicles colection. It may be redundant!
vehicleSchema.methods.cleanAll = function (cb) {
  	return this.model('Vehicle').remove(cb);
}


module.exports = mongoose.model('Vehicle', vehicleSchema, 'vehicle');

