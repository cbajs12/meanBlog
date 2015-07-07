'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	Board = mongoose.model('Board'),
	Article = mongoose.model('Article'),
	Comment = mongoose.model('Comments'),
	Tag = mongoose.model('Tag'),
	async = require('async'),
	_ = require('lodash');

/**
 * get the list of articles
 */
exports.newArticles = function(req, res) { 

	Article.find().sort({created:'desc'}).exec(function(err,data){
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
};


/**
 *	List of articles
 */
exports.listArticles = function(req, res) { 
	var id = req.params.boardName;

	Board.findOne({name:id},function(err,docs){
		if(!docs){
			console.log('no data');
		}else{
			//console.log(docs);
			Article.find({_id:{$in:docs.article}}).sort({created:'desc'}).exec(function(err,data){
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
 * Write article
 */
exports.writeArticle = function(req,res){
	//console.log('hi');
	
	//console.log(req.body.params.name);
	
	var tagArray = req.body.params.tag;

	var article = new Article({
		title : req.body.params.title,
		username : req.body.params.username,
		content : req.body.params.content
	});

	var tags = [];

	async.each(tagArray,function(tagData,next){
		var tagName = tagData.trim();
		//if no match data, findOne function skip promise
		Tag.findOne({tagname:tagName},function(err,docs){
			if(!docs){
				var tag = new Tag({tagname:tagName, article:article._id});
				tags.push(tag._id);
				tag.save();
				//console.log(tags);
			}else{				
				docs.article.push(article._id);
				tags.push(docs._id);
				docs.save();
				//console.log(docs);
				//console.log(tags);		
			}
			next(); 
		});

		//console.log('4');

	},function(){	// work after looping
		article.tag = tags;
		//console.log(tags);

		article.save(function(err){
			if (err) {
					console.log(err);
					return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}else{
				//console.log('6');
				Board.findOne({name:req.body.params.name},function(err,docs){
					if (err) {
						console.log(err);
						return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
						});
					}else{
						if(!docs){
							console.log('no data');
						}else{
							//console.log(docs);
							docs.article.push(article._id);
							docs.save();
							res.jsonp(docs);
							console.log('create finished');
						}
					}
				});
			}
		});
	});	
};

/**
 * Get the Article by name
 */
exports.readArticle = function(req, res) {
	//console.log(req.params.articleTitle);

	Article.findOne({title:req.params.articleTitle}).exec(function(err, article) {
	    if (err) {
	    	console.log(err);
	     	return res.status(400).send({
	        message: errorHandler.getErrorMessage(err)
	      });
	  	} else {
	    	if (!article) {
	            return res.status(404).send({
	                message: 'article not found'
	            });
	    	}

	    	Tag.find({_id:{$in:article.tag}}).exec(function(err,data){
				if(err){
					console.log(err);
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}else{
					//console.log(data);
					article.count +=1;
					article.save();

					Comment.find({parent:article._id}).sort({created:'desc'}).exec(function(err,commentAll){
						if(err){
							console.log(err);
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						}else{
							//console.log(data);
							//res.jsonp(data);
							res.jsonp({tags:data,articles:article,comments:commentAll});
						}
					});
				}
			});
	 	}
	});
};

/**
 * Update the Article
 */
exports.updateArticle = function(req, res) {
	//console.log(req.body);
	//console.log(req.user);

	if (req.user) {
		Article.findOne({title:req.params.articleTitle}).exec(function(err, article) {
			if (err) {
	    		console.log(err);
	     		return res.status(400).send({
	        		message: errorHandler.getErrorMessage(err)
	      		});
	  		}else{
	  			var data = _.extend(article, req.body.params);
	  			data.updated = Date.now();
	  			data.save();
	  			//console.log(data);
	  			res.jsonp(data);
	  		}
		});
	}else{
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 *  Delete Article
 */
exports.deleteArticle = function(req,res){
	if (req.user) {
		Article.findOne({title:req.params.articleTitle}).exec(function(err, article) {
			if (err) {
	    		console.log(err);
	     		return res.status(400).send({
	        		message: errorHandler.getErrorMessage(err)
	      		});
	  		}else{
	  			var tagArray = article.tag;
	  			//console.log(article._id);
	  			async.each(tagArray,function(tagData,next){
	  				Tag.findOneAndUpdate({_id:tagData},{$pull:{article:article._id}}).exec(function(err, docs) {
						if (err) {
	  						console.log(err);
	     					return res.status(400).send({
	        				message: errorHandler.getErrorMessage(err)
	      					});
	      				}else{
	      					if(!docs){
								console.log('no data');
							}
	      				}
	      				next();
	  				});
	  			},function(){
	  				Comment.find({parent:article._id}).sort({created:'desc'}).exec(function(err,comments){
						if(err){
							console.log(err);
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						}else{
							async.each(comments,function(commentData,next){
				  				Comment.remove({_id:commentData._id}).exec(function(err, docss) {
									if (err) {
				  						console.log(err);
				     					return res.status(400).send({
				        					message: errorHandler.getErrorMessage(err)
				      					});
				      				}else{
				      					if(!docss){
											console.log('no data');
										}
				      				}
				      				next();
				  				});
				  			},function(){
				  				article.remove(function(err) {
									if (err) {
										return res.status(400).send({
											message: errorHandler.getErrorMessage(err)
										});
									} else {
										return res.status(201).send({
											message: 'Remove completed'
										});
									}
								});				  				
				  			});
						}
					});
	  			});
	  		}
		});
	}else{
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};
