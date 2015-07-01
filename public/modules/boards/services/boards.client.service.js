'use strict';

//Boards service used to communicate Boards REST endpoints
angular.module('boards').factory('Boards', ['$resource',
	function($resource) {
		return $resource('boards/:boardName', { boardName: '@name'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);