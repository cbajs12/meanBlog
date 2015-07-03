'use strict';

//Setting up route
angular.module('boards').config(['$stateProvider',
	function($stateProvider) {
		// Boards state routing
		$stateProvider.
		state('viewBoards', {
			url: '/boards',
			templateUrl: 'modules/boards/views/view-all.client.view.html'
		}).
		state('createBoard', {
			url: '/boards/create',
			templateUrl: 'modules/boards/views/create-board.client.view.html'
		}).
		state('destroyBoard', {
			url: '/boards/destroy/:boardName',
			templateUrl: 'modules/boards/views/destroy-board.client.view.html'
		}).
		state('editBoardName', {
			url: '/boards/edit/:boardName',
			templateUrl: 'modules/boards/views/edit-board.client.view.html'
		}).
		state('createArticle', {
			url: '/boards/write/:boardName',
			templateUrl: 'modules/boards/views/create-article.client.view.html',
		}).
		state('viewArticle', {
			url: '/boards/:boardName/:articleTitle',
			templateUrl: 'modules/boards/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/boards/:boardName/:articleTitle/edit',
			templateUrl: 'modules/boards/views/edit-article.client.view.html'
		}).
		state('deleteArticle', {
			url: '/boards/:boardName/:articleTitle/delete',
			templateUrl: 'modules/boards/views/delete-article.client.view.html'
		});
	}
]);