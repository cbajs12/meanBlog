'use strict';

angular.module('categories').controller('CategoriesController', ['$scope','$location','Categories',
	function($scope,$location, Categories) {
		// Controller Logic
		
		$scope.create = function(){
			//redirect after save
			var category = new Categories({
				name: this.name,
				description: this.description
			});

			category.$save(function(response){
				$location.path('categories/'+response._id);
				//Clear form fields
				$scope.name = '';
			},function(errorResponse){
				$scope.error = errorResponse.data.message;

			});
		};

		$scope.find = function(){
			$scope.categories = $scope.categories = Categories.query();
		};
	}
]);