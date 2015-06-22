'use strict';

angular.module('categories').controller('CategoriesController', ['$scope','$stateParams','$location','Categories',
	function($scope, $stateParams, $location, Categories) {
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
			$scope.categories = Categories.query();
		};

		$scope.findOne = function() {
			$scope.category = Categories.get({ 
				categoryId: $stateParams.categoryId
			});
		};
	}
]);