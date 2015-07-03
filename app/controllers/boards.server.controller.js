'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Board = mongoose.model('Board'),
	Article = mongoose.model('Article'),
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
 * Create a Board
 */
exports.create = function(req, res) {

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
			next(); /* <---- critical piece.  This is how the forEach knows to continue to
                       the next loop.  Must be called inside search's callback so that
                       it doesn't loop prematurely.*/
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
				var board = new Board(req.body.params);
				board.article.push(article._id);
				board.save(function(err){
					if (err) {
						console.log(err);
						return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
						});
					}else{
						res.jsonp(board);
						console.log('create finished');
					}
				});
			}
		});
	});		
};

/**
 * Get the Board by name
 */
exports.read = function(req, res) {
	//console.log(req.params.boardName);

	Board.findOne({name:req.params.boardName}).exec(function(err, board) {
	    if (err) {
	    	console.log(err);
	     	return res.status(400).send({
	        message: errorHandler.getErrorMessage(err)
	      });
	  	} else {
	    	if (!board) {
	            return res.status(404).send({
	                message: 'board not found'
	            });
	    	}

	    	res.jsonp(board);

	 	}
	});
};

/**
 * Update a Board Name
 */
exports.update = function(req, res) {
	//console.log(req.body);
	//console.log(req.params);
	if (req.user) {
		Board.findOne({name:req.params.boardName}).exec(function(err, board) {
		    if (err) {
		    	console.log(err);
		     	return res.status(400).send({
		        message: errorHandler.getErrorMessage(err)
		      });
		  	}
		  	else {
		    	if (!board) {
		            return res.status(404).send({
		                message: 'board not found'
		            });
		    	}
		    	board.name = req.body.params;
		    	console.log(board);
		    	board.save(function(err){
						if (err) {
							console.log(err);
							return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
							});
						}else{
							res.jsonp(board);
							console.log('create finished');
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
 * 	Delete Board
 */
exports.destroy = function(req,res){
	//console.log('hel');
	if (req.user) {
		Board.findOne({name:req.params.boardName}).exec(function(err, board) {
		    if (err) {
		    	console.log(err);
		     	return res.status(400).send({
		        message: errorHandler.getErrorMessage(err)
		      });
		  	}else{
		  		if (!board) {
	            	return res.status(404).send({
	            	    message: 'board not found'
	            	});
	    		}
	    		Article.find({_id:{$in:board.article}}).exec(function(err,data){
					if(err){
						console.log(err);
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					}else{
						var articleArray = data;
						//console.log(articleArray[0].title);
						async.each(articleArray,function(articleData,next){
							Article.findOne({title:articleData.title}).exec(function(err, article) {
								if (err) {
						    		console.log(err);
						     		return res.status(400).send({
						        		message: errorHandler.getErrorMessage(err)
						      		});
						  		}else{
						  			var tagArray = article.tag;
						  			//console.log(article._id);
						  			async.each(tagArray,function(tagData,nextIn){
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
												//console.log(docs);
						      				}
						      				nextIn();
						  				});
						  			},function(){
						  				article.remove(function(err) {
											if (err) {
												return res.status(400).send({
													message: errorHandler.getErrorMessage(err)
												});
											}
										});
						  			});
						  		}
						  		next();
							});							
						},function(){
							board.remove(function(err) {
								if (err) {
									return res.status(400).send({
										message: errorHandler.getErrorMessage(err)
									});
								} else {
									Board.find().sort({created:'desc'}).exec(function(err, boards) {
										if (err) {
											return res.status(400).send({
												message: errorHandler.getErrorMessage(err)
											});
										} else {
											res.jsonp(boards);
										}
									});
								}
							});
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
 * List of Boards
 */
exports.list = function(req, res) { 
	Board.find().sort({created:'desc'}).exec(function(err, boards) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(boards);
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
					//console.log(article);
					res.jsonp({tags:data,articles:article});
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
	  			console.log(article._id);
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
	}else{
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Board middleware
 */
exports.boardByID = function(req, res, next, id) { 
	Board.findById(id).populate('user', 'displayName').exec(function(err, board) {
		if (err) return next(err);
		if (! board) return next(new Error('Failed to load Board ' + id));
		req.board = board ;
		next();
	});
};

/**
 * Board authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.board.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
