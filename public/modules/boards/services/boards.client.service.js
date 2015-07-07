'use strict';

//Boards service used to communicate Boards REST endpoints
angular.module('boards').factory('Boards', ['$resource',
	function($resource) {
		return $resource('boards/:boardName/:articleTitle', { boardName: '@name',articleTitle:'@title'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
/*.factory('Comments').factory('Comments', ['$resource',
	function($resource) {
		return $resource('comments', { 
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);*/