'use strict';

// Configuring the Articles module
angular.module('boards').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Boards', 'boards', 'dropdown', '/boards(/create)?');
		Menus.addSubMenuItem('topbar', 'boards', 'List Boards', 'boards/:boardPurpose');
		Menus.addSubMenuItem('topbar', 'boards', 'New Board', 'boards/:boardPurpose/create');
		Menus.addSubMenuItem('topbar', 'boards', 'Destroy Board', 'boards/:boardPurpose/destroy');

		Menus.addMenuItem('topbar', 'Board Create', 'boards/add', 'button', 'boards/add');
		
	}
]);