'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend board's controller
 */
module.exports = _.extend(
	require('./boards/boards.article.server.controller'),
	require('./boards/boards.board.server.controller'),
	require('./boards/boards.comment.server.controller')
);


