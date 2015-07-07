'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	Article = mongoose.model('Article'),
	Comment = mongoose.model('Comments'),
	async = require('async'),
	ObjectId = mongoose.Types.ObjectId,
	_ = require('lodash');

/**
 * Write comment
 */
exports.createComment = function(req,res){
	//console.log(req.body.params);

	var writerId = new ObjectId(req.body.params.writer);
	var parentId = new ObjectId(req.body.params.parent);

	var comment = new Comment({
		writer : writerId,
		parent : parentId,
		content : req.body.params.content,
		userPicture : req.body.params.userpicture,
		userName : req.body.params.username
	});

	//console.log(comment);

	comment.save(function(err){
		if (err) {
				console.log(err);
				return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}else{
			Comment.find({parent:parentId}).sort({created:'desc'}).exec(function(err,data){
				if(err){
					console.log(err);
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}else{
					//console.log(data);
					res.jsonp(data);
				}
			});
		}
	});
};

/**
 * Delete comment
 */
exports.deleteComment = function(req,res){
	//console.log(req);
	//console.log(req.query);
	if (req.user) {
		Comment.findOne({_id:req.query.comment}).exec(function(err, comment) {
			if (err) {
	    		console.log(err);
	     		return res.status(400).send({
	        		message: errorHandler.getErrorMessage(err)
	      		});
	      	}else{
	      		comment.remove(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						Comment.find({parent:req.query.article}).sort({created:'desc'}).exec(function(err,data){
							if(err){
								console.log(err);
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							}else{
								//console.log(data);
								res.jsonp(data);
							}
						});
					}
				});
	      	}
	    });
	}else{
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Update comment
 */
exports.updateComment = function(req,res){
	//console.log(req.body);
	if (req.user) {
		var commentId = new ObjectId(req.body.params.comment);
		var articleId = new ObjectId(req.body.params.article);

		Comment.findOne({_id:commentId}).exec(function(err, comment) {
			if (err) {
	    		console.log(err);
	     		return res.status(400).send({
	        		message: errorHandler.getErrorMessage(err)
	      		});
	    	}else{
	    		var data = _.extend(comment, req.body.params);
	    		data.save(function(err){
					if (err) {
						console.log(err);
						return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
						});
					}else{
						Comment.find({parent:articleId}).sort({created:'desc'}).exec(function(err,datas){
							if(err){
								console.log(err);
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							}else{
								//console.log(datas);
								res.jsonp(datas);
							}
						});
					}
				});
	    	}
	    });
	}else{
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};