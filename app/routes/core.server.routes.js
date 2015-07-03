'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	var boards = require('../../app/controllers/boards.server.controller');

	app.route('/').get(core.index);

	app.route('/articles').get(boards.newArticles);
};