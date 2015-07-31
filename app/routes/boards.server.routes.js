'use strict';

module.exports = function(app) {
	//var users = require('../../app/controllers/users.server.controller');
	var boards = require('../../app/controllers/boards.server.controller');

	// Boards Routes
	app.route('/boards')
		.get(boards.list);
		
	app.route('/boards/:boardName')
		.post(boards.create)
		.get(boards.listArticles);

	app.route('/boards/write/:boardName')
		.get(boards.read)
		.post(boards.writeArticle);

	app.route('/boards/edit/:boardName')
		.put(boards.update);

	app.route('/boards/destroy/:boardName')
		.delete(boards.destroy);

	app.route('/boards/:boardName/:articleTitle')
		.get(boards.readArticle);

	app.route('/boards/:boardName/:articleTitle/edit')
		.put(boards.updateArticle);

	app.route('/boards/:boardName/:articleTitle/delete')
		.delete(boards.deleteArticle);
	
	app.route('/comment/create')
		.post(boards.createComment);

	app.route('/comment/delete')
		.delete(boards.deleteComment);

	app.route('/comment/update')
		.put(boards.updateComment);

	app.route('/tags')
		.get(boards.listTags);

	// Finish by binding the Board middleware
	app.param('boardId', boards.boardByID);
};
