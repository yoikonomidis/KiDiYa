var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
 
var userSchema = new Schema({
	id:Number,
	name:String,
	surname:String,
	password:String,
	location:
	{
		longitude:Number,
		latitude:Number
	}

});
module.exports = mongoose.model('User', userSchema, 'users');