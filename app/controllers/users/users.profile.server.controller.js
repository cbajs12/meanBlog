'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	multiparty = require('multiparty'),
	fs = require('fs'),
	User = mongoose.model('User');
/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};

/**
 * Manage Image
 */
exports.postImage = function(req, res){
	var message = null;
	var form = new multiparty.Form();
	form.parse(req,function(err,fields,files){
		var username = fields.username;
		var file = files.file[0];
		var contentType = file.headers['content-type'];
		var tmpPath = file.path;
		var fileName = file.originalFilename;
		var newFileName = username+fileName;
		var destPath = '/home/jisung/git/meanBlog/public/modules/users/assets/'+newFileName;
		if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
            fs.unlink(tmpPath);
            return res.status(400).send('Unsupported file type.');
        }

		fs.rename(tmpPath, destPath, function(err) {
           	if (err) {
               return res.status(400).send('Image is not saved:');
           	}
           	fs.unlink(tmpPath, function() {
            	if (err) {
                	return res.status(400).send({
                    	message: 'Impossible to delete temp file'
                	});
            	}
        	});
           //return res.json(destPath);
        });

        var user = req.user;
        delete req.body.roles;


        if (user) {
			// Merge existing user
			user = _.extend(user, req.body);
			user.imagePath = newFileName;

			user.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					req.login(user, function(err) {
						if (err) {
							res.status(400).send(err);
						} else {
							res.json(user);
						}
					});
				}
			});

		} else {
			res.status(400).send({
				message: 'User is not signed in'
			});
		}
	});
};
