'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Comments Schema
 */
var CommentsSchema = new Schema({
	// Comments model fields   
  writer:{
		type: Schema.ObjectId,
    	ref: 'User'
	},
	created: {
    	type: Date,
    	default: Date.now
  },
  parent: {
  	type: Schema.ObjectId,
  	ref: 'Article'
	},
	content: {
  	type: String,
  	trim: true,
  	required: true
	},
	userPicture: {
  	type: String
	},
	userName: {
  	type: String
	}
});

mongoose.model('Comments', CommentsSchema);