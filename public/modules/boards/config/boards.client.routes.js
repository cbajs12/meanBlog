'use strict';

//Setting up route
angular.module('boards').config(['$stateProvider',
	function($stateProvider) {
		// Boards state routing
		$stateProvider.
		state('addBoards', {
			url: '/boards/add',
			templateUrl: 'modules/boards/views/add-board.client.view.html'
		}).
		state('destroyBoards', {
			url: '/boards/:boardPurpose/destroy',
			templateUrl: 'modules/boards/views/destroy-board.client.view.html'
		}).
		state('listBoards', {
			url: '/boards/:boardPurpose',
			templateUrl: 'modules/boards/views/list-boards.client.view.html'
		}).
		state('createBoard', {
			url: '/boards/:boardPurpose/create',
			templateUrl: 'modules/boards/views/create-board.client.view.html'
		}).
		state('viewBoard', {
			url: '/boards/:boardPurpose/:boardId',
			templateUrl: 'modules/boards/views/view-board.client.view.html'
		}).
		state('editBoard', {
			url: '/boards/:boardPurpose/:boardId/edit',
			templateUrl: 'modules/boards/views/edit-board.client.view.html'
		});
	}
]);