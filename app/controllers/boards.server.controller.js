'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Board = mongoose.model('Board'),
	_ = require('lodash');

/**
 * Create a Board
 */
exports.create = function(req, res) {
	var board = new Board(req.body);
	board.user = req.user;
	board.title = req.title;
	board.content = req.content;
	board.purpose = req.purpose;

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
	Board.find().sort(req.params.boardPurpose).populate('user', 'displayName').exec(function(err, boards) {
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
