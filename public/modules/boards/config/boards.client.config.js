'use strict';

// Configuring the Articles module
angular.module('boards').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Board', 'boards', 'button', 'boards');	
		Menus.addMenuItem('topbar', 'Create Board', 'boards/create', 'button', 'boards/create');

	}
]);