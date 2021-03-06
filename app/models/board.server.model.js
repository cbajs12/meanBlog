'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

function validateLength(v){
	return (v && v.length < 15);
}

/**
 * Board Schema
 */
var BoardSchema = new Schema({
	name: {
		type:String,
		default: '',
		required: 'Please fill title',
		trim: true,
		unique:true,
		validate: [validateLength, 'Board name must be 15 chars in length or less']
	},
	created: {
		type: Date,
		default: Date.now
	},
	article:[{
		type: Schema.Types.ObjectId,
		ref: 'Article'
	}]

});

mongoose.model('Board', BoardSchema);