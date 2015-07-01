'use strict';

// Boards controller
angular.module('boards').controller('BoardsController', ['$scope','$http', '$stateParams', '$location', 'Authentication', 'Boards',
	function($scope,$http, $stateParams, $location, Authentication, Boards) {
		$scope.user = Authentication.user;

		// Create new Board
		$scope.create = function() {
			// Create new Board object
			var tags = this.tag;
			var tagArray = tags.split(',');
			var tag1 = tagArray[0].trim();

			if(tagArray.length > 5){
				alert('Only 5 words can write for this article');
				return;
			}

			var board = new Boards ({
				name: this.name,
				title: this.title,
				content: this.content,
				username: $scope.user.username,
				tag: tagArray
			});

			console.log('a');

			board.$save(function(response){
				$location.path('boards');
			},function(errorResponse){
				$scope.error = errorResponse.data.message;

			});
		};

		// Remove existing Board
		$scope.remove = function(board) {
			if ( board ) { 
				board.$remove();

				for (var i in $scope.boards) {
					if ($scope.boards [i] === board) {
						$scope.boards.splice(i, 1);
					}
				}
			} else {
				$scope.board.$remove(function() {
					$location.path('boards');
				});
			}
		};

		// Find a list of Boards
		$scope.findBoard = function() {
			$scope.boards = Boards.query();
		};

		// Find existing Board
		$scope.findArticle = function(Board) {
			var board = Board;
			//console.log(board);

			$http.get('/boards/'+board.name).success(function(response) {
				//console.log('hi');
				$scope.articles = response;
			}).error(function(response) {
				//$scope.error = response.message;
			});
		};

		// Update existing Board
		$scope.update = function() {
			var board = $scope.board;

			board.$update(function() {
				$location.path('boards/' + board._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);