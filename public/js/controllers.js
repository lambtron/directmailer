'use strict';

directMailer.controller('mainController', ['$scope', '$http', '$fileUploader', 
	function($scope, $http, $fileUploader)
{
    // When landing on the page, check session history to see if user is logged in.

    // Initialize variables needed.
    $scope.$file = {};
    $scope.fromAddress = {};
    $scope.toAddress = {};
    $scope.creditCard = {};

    // TODO: Check session history

    // TODO: If existing user and signed in, then retrieve relevant info.

    // TODO: If new user, just show landing page!

    // TODO: POST ALL THE THINGS!

    // Create a file uploader with options.
    var uploader = $scope.uploader = $fileUploader.create({
    	scope: $scope,			// to automatically update the HTML. Default: $rootScope
    	url: '/api/file',
    	autoUpload: true,
    	removeAfterUpload: false
    });

    // Register handlers for our file uploader.

    $scope.validateFormAndPost = function() {
    	// Validate the form fields.

    	// Check if the form fields are blank.
    	console.log($scope.fromAddress);
    };

}]);