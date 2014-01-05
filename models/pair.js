var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var pairSchema = new Schema({

	vehicleId:Number,
	userId:Number,
	startTime:Number,
	endTime:Number
});
module.exports = mongoose.model( 'Pair', pairSchema, 'pairs');

