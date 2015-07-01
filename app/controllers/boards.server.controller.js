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
 * Create a Board
 */
exports.create = function(req, res) {
	//console.log('1');

	var tagArray = req.body.tag;

	var article = new Article({
		title : req.body.title,
		username : req.body.username,
		content : req.body.content
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
				//console.log('2');	
			}else{				
				docs.article.push(article._id);
				tags.push(docs._id);
				docs.save();
				//console.log(docs);
				//console.log(tags);
				//console.log('3');		
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
				var board = new Board(req.body);
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
 * Show the current Board
 */
exports.read = function(req, res) {
	Board.findById(req.params.boardId).exec(function(err, board) {
	    if (err) {
	      return res.status(400).send({
	          message: errorHandler.getErrorMessage(err)
	      });
	  	} else {
	    	if (!board) {
	            return res.status(404).send({
	                message: 'Category not found'
	            });
	    	}

	    res.jsonp(board);

	 	}
	});
};

/**
 * Update a Board
 */
exports.update = function(req, res) {
	var board = req.board ;

	board.purpose = req.params.boardPurpose;

	board = _.extend(board , req.body);

	board.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(board);
		}
	});
};

/**
 * Delete an Board
 */
exports.delete = function(req, res) {
	var board = req.board ;

	board.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(board);
		}
	});
};

/**
 * List of Boards
 */
exports.list = function(req, res) { 
	Board.find().exec(function(err, boards) {
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
			Article.find({_id:{$in:docs.article}}).exec(function(err,data){
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
 * Board ADD
 */
exports.add = function(req,res){
	var board = new Board(req.body);
	board.user = req.user;
	board.purpose = req.params.purpose;

	board.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(board);
		}
	});
};

/**
 * Board Destory
 */
exports.destroy = function(req,res){
	var board = new Board(req.body);
	board.user = req.user;
	board.purpose = req.params.purpose;

	board.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(board);
		}
	});
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
