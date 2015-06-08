'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
/**
 * Validation
 */
function validateLength(v){
	return v.length <= 15;
}

/**
 * Category Schema
 */
var CategorySchema = new Schema({
	// Category model fields   
	
	created:{
		type: Date,
		default: Date.now
	},
	description:{
		type: String,
		default: '',
		// types have specific functions e.g. trim, lowercase, uppercase 
		trim: true
	},
	name:{
		type:String,
		default:'',
		trim: true,
		unique:true,
		// make this a required field
        required: 'name cannot be blank',
        // wires in a custom validator function 
        validate: [validateLength, 'name must be 15 chars in length or less']
	}

});

mongoose.model('Category', CategorySchema);