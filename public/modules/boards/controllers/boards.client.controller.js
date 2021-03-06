'use strict';

// Boards controller
angular.module('boards').controller('BoardsController', ['$scope','$http', '$stateParams', '$location', 'Authentication', 'Boards',
	function($scope,$http, $stateParams, $location, Authentication, Boards) {
		$scope.user = Authentication.user;

		// Create new Board
		$scope.create = function() {
			if(!this.tag || !this.title || !this.content || !this.name){
				$scope.tag = '';
				$scope.title = '';
				$scope.content = '';
				$scope.name = '';
				alert('Write down all info');
				return;
			}
			
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

			$http.post('/boards/'+this.name,{params:board}).success(function(response) {
				$location.path('boards');
			
			}).error(function(response) {
				alert(response.message);
				//$scope.error = ;
			});
		};

		// Write Article
		$scope.write = function() {
			if(!this.tag || !this.title || !this.content){
				$scope.tag = '';
				$scope.title = '';
				$scope.content = '';
				alert('Write down all info');
				return;
			}

			var tags = this.tag;
			var tagArray = tags.split(',');
			var tag1 = tagArray[0].trim();

			if(tagArray.length > 5){
				alert('Only 5 words can write for this article');
				return;
			}

			var tempName = $stateParams.boardName;

			var board = new Boards ({
				name: tempName,
				title: this.title,
				content: this.content,
				username: $scope.user.username,
				tag: tagArray
			});

			//console.log('a');
			
			$http.post('/boards/write/'+tempName,{params:board}).success(function(response) {
				$location.path('boards');
			
			}).error(function(response) {
				//$scope.error = response.message;
				alert(response.message);
			});
			
		};

		// Find lists of Boards
		$scope.findBoard = function() {
			$scope.boards = Boards.query();
		};

		// Find a board
		$scope.findOneBoard = function() {
			var name = $stateParams.boardName;

			$http.get('/boards/write/'+name,{params:{boardName:name}}).success(function(response) {
				$scope.board = response;
				
			}).error(function(response) {
				//$scope.error = response.message;
				alert(response.message);
			});
		};

		// Find lists of Articles of a board
		$scope.findArticles = function(Board) {
			var board = Board;
			//console.log(board);

			$http.get('/boards/'+board.name).success(function(response) {
				//console.log('hi');
				$scope.articles = response;
				//console.log(response);
				$scope.boardName = board.name;
			}).error(function(response) {
				//$scope.error = response.message;
				alert(response.message);
			});
		};

		//Find the article
		$scope.findOneArticle = function() {
			var name = $stateParams.boardName;
			var title = $stateParams.articleTitle;
			//console.log(name+'/'+title);
			$http.get('/boards/'+name+'/'+title,{params:{articleTitle:title}}).success(function(response) {
				$scope.article = response.articles;
				$scope.tags = response.tags;
				$scope.boardName = name;
				$scope.comments = response.comments;
				//console.log(response.articles);
				//console.log(response.tags);
			}).error(function(response) {
				//$scope.error = response.message;
				alert(response.message);
			});
		};

		// Update existing Board name
		$scope.update = function() {
			if(!this.name){
				alert('Please Write name');
				return;
			}

			var board = $scope.board;
			//console.log(board);

			$http.put('/boards/edit/'+board.name,{params:this.name}).success(function(response) {
				//console.log('hi');
				$location.path('boards');
			}).error(function(response) {
				//$scope.error = response.message;
				alert(response.message);
			});
		};

		// Update exisitng Article
		$scope.updateArticle = function() {
			//console.log($scope.article);
			/*if(!$scope.article.tag){
				tagArray = $scope.tags;
			}else{
				var tags = this.tag;
				tagArray = tags.split(',');
				var tag1 = tagArray[0].trim();

				if(tagArray.length > 5){
					alert('Only 5 words can write for this article');
					return;
				}				
			}*/

			var existTitle = $stateParams.articleTitle;
			var boardName = $stateParams.boardName;

			var article = new Boards ($scope.article);
			//console.log(article);

			$http.put('/boards/'+boardName+'/'+existTitle+'/edit',{params:article}).success(function(response) {
				$location.path('boards/'+boardName+'/'+existTitle);
			}).error(function(response) {
				//$scope.error = response.message;
				alert(response.message);
			});
		};

		// Remove existing Board
		$scope.remove = function(board) {
			var status = confirm('Are you sure you want to delete this board?');
			if(status){
				var boardName = $scope.boardName;

				$http.delete('/boards/destroy/'+boardName).success(function(response) {
					$scope.boards = response;
					$scope.articles = '';
				}).error(function(response) {
					//$scope.error = response.message;
					alert(response.message);
				});
			}
		};

		// Remove existing Article
		$scope.delete = function() {
			var status = confirm('Are you sure you want to delete this article?');
			if(status){
				var existTitle = $stateParams.articleTitle;
				var boardName = $stateParams.boardName;

				$http.delete('/boards/'+boardName+'/'+existTitle+'/delete').success(function(response) {
					console.log(response.message);
					$location.path('boards');
				}).error(function(response) {
					//$scope.error = response.message;
					alert(response.message);
				});
			}
		};

		// Create new Comment
		$scope.writeComment = function() {
			if(!$scope.user){
				$scope.comment = '';
				alert('You should sign in first');
				return;
			}
			if(!this.comment){
				$scope.comment = '';
				alert('Write down Comment');
				return;
			}

			var data = {
				writer : $scope.user._id,
				parent : $scope.article._id,
				content : this.comment,
				userpicture : $scope.user.imagePath,
				username : $scope.user.displayName
			};

			//console.log(data);

			$http.post('/comment/create',{params:data}).success(function(response) {
				//console.log(response);
				$scope.comment = '';
				$scope.comments = response;
			}).error(function(response) {
				//$scope.error = response.message;
				alert(response.message);
			});
		};

		// update Comment
		$scope.updateComment = function(commentId,articleId) {
			var currentName = $scope.user.username;
			var articleName = $scope.article.username;

			if(articleName !== currentName){
				alert('You can not update this comment');
				return;
			}

			var status = confirm('Are you sure you want to change this comment?');
			if(status){
				var content = prompt('Write your comment');
				if(content !== null){
					//console.log(comment);
					$http.put('/comment/update',{params:{comment:commentId,article:articleId,content:content}}).success(function(response) {
						//console.log(response);
						$scope.comments = response;
					}).error(function(response) {
						//$scope.error = response.message;
						alert(response.message);
					});
				}
			}

		};

		// delete Comment
		$scope.deleteComment = function(commentId,articleId) {
			var currentName = $scope.user.username;
			var articleName = $scope.article.username;

			if(articleName !== currentName){
				alert('You can not delete this comment');
				return;
			}

			var status = confirm('Are you sure you want to delete this comment?');
			if(status){
				$http.delete('/comment/delete',{params:{comment:commentId,article:articleId}}).success(function(response) {
					$scope.comments = response;
				}).error(function(response) {
					//$scope.error = response.message;
					alert(response.message);
				});
			}
		};

		// Find lists of the tag of a board
		$scope.findTags = function() {
			var tag = $stateParams.tags;
			//console.log(tag);
			$http.get('/tags',{params:{tagname:tag}}).success(function(response) {
				
				$scope.allTags = response;
				
			}).error(function(response) {
				//$scope.error = response.message;
				alert(response.message);
			});
			
		};

	}
]);