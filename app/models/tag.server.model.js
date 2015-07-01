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
 * Tag Schema
 */
var TagSchema = new Schema({
	// Tag model fields   
	tagname:{
		type:String,
		trim: true,
		unique:true,
		default: '',
		validate: [validateLength, 'Tag must be 15 chars in length or less']
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

mongoose.model('Tag', TagSchema);