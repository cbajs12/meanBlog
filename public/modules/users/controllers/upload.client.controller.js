'use strict';

//upload controller
angular.module('users').controller('UploadCtrl', ['$scope', 'Upload','$location', function ($scope, Upload, $location) {
    $scope.log = '';

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
                
            });
        }
    };
}]);