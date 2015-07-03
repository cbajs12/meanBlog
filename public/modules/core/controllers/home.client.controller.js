'use strict';


angular.module('core').controller('HomeController', ['$scope', '$http','Authentication',
	function($scope,$http, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		// Find lists of Articles of a board
		$scope.findArticles = function() {
			$http.get('/articles').success(function(response) {
				//console.log('hi');
				$scope.newArticles = response;
			}).error(function(response) {
				//$scope.error = response.message;
			});
		};
	}
]);