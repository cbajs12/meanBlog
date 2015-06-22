'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

function validateLength(v){
	return v.length <= 15;
}

/**
 * Board Schema
 */
var BoardSchema = new Schema({
	title: {
		type: String,
		default: '',
		required: 'Please fill title',
		trim: true,
		validate: [validateLength, 'Title must be 15 chars in length or less']
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	content: {
		type: String,
		required: 'Please fill content',
		trim: true
	},
	count: {
		type: Number,
		default: 0
	},
	purpose: {
		type: String,
		required: true,
		trim: true
	},
	updated: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Board', BoardSchema);