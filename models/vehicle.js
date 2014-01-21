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
	},
	// reserved:Boolean,
	// locked:Boolean
});
module.exports = mongoose.model('Vehicle', vehicleSchema, 'vehicle');