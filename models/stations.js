/*	################					################
 	################	KiDiYa Project	################
	################	----2014----	################
	################					################
*/

var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
var stationSchema = new Schema(
	{
        type:String,
        geometry:
        {
            coordinates:
            [
                Number,
                Number
            ]
        },
        properties: 
        {
            name:String,
            scode:String,
            street:String,
            mode:String,
            id:String
        }
	}
);

//Method for cleaning the vehicles colection. It may be redundant!
stationSchema.methods.cleanAll = function (cb) {
  	return this.model('Station').remove(cb);
}


module.exports = mongoose.model('Station', stationSchema, 'stations');

