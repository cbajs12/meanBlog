'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var boards = require('../../app/controllers/boards.server.controller');

	// Boards Routes
	app.route('/boards')
		.post(users.requiresLogin, users.hasAuthorization, boards.add);

	app.route('/boards/:boardPurpose')
		.get(boards.list)
		.post(users.requiresLogin, boards.create)
		.delete(users.requiresLogin, users.hasAuthorization, boards.destroy);

	app.route('/boards/:boardPurpose/:boardId')
		.get(boards.read)
		.put(users.requiresLogin, boards.hasAuthorization, boards.update)
		.delete(users.requiresLogin, boards.hasAuthorization, boards.delete);

	// Finish by binding the Board middleware
	app.param('boardId', boards.boardByID);
};
