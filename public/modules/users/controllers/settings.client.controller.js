'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication','Upload',
	function($scope, $http, $location, Users, Authentication, Upload) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		//
		$scope.upload = function (files) {
		    var name = $scope.user.username;
		    if (files && files.length) {
		    	if(angular.isArray(files)){
		    		files = files[0];
		    	}

		    	if (files.type !== 'image/png' && files.type !== 'image/jpeg') {
		            alert('Only PNG and JPEG are accepted.');
		            return;
		        }
		       
		        Upload.upload({
		            url: '/users/upload',
		            headers: {'Content-Type': 'multipart/form-data'},
		            method: 'POST',
		            fields: { 'username': name},
		            file: files
		        }).success(function (data, status, headers, config) {
		            console.log('complete');
		            //var hi = data;
		            //console.log(hi);
		            Authentication.user = data;
		            $scope.user = data;
		        }).error(function(err) {
                	console.log('Error uploading file: ' + err.message || err);
            	});
		    }
		};
	}
]);