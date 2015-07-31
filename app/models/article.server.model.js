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
 * Article Schema
 */
var ArticleSchema = new Schema({
	// Article model fields   
	title: {
		type: String,
		default: '',
		required: 'Please fill title',
		trim: true,
		unique:true,
		validate: [validateLength, 'Title must be 15 chars in length or less']
	},
	created: {
		type: Date,
		default: Date.now
	},
	username: {
		type: String,
		trim: true
	},
	content: {
		type: String,
		required: 'Please fill content',
		default: '',
		trim: true
	},
	count: {
		type: Number,
		default: 0
	},
	updated: {
		type: Date,
		default: Date.now
	},
	tag:[{
		type: Schema.Types.ObjectId,
		ref: 'Tag'
	}],
	parentname:{
		type: String,
		trim: true
	}
});

mongoose.model('Article', ArticleSchema);