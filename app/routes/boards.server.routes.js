'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var boards = require('../../app/controllers/boards.server.controller');

	// Boards Routes
	app.route('/boards')
		.get(boards.list);
		
	app.route('/boards/:boardName')
		.post(boards.create)
		.get(boards.listArticles);
		//.delete(users.requiresLogin, users.hasAuthorization, boards.destroy);
		//.get(users.requiresLogin, users.hasAuthorization, boards.add);

	app.route('/boards/:boardName/:articleId')
		//.get(boards.readArticles)
		.put(users.requiresLogin, boards.hasAuthorization, boards.update);
		//.delete(users.requiresLogin, boards.hasAuthorization, boards.delete);
	
	// Finish by binding the Board middleware
	app.param('boardId', boards.boardByID);
};
