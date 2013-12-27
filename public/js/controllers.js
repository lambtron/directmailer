'use strict';

directMailer.controller('mainController', ['$scope', '$http', '$fileUploader', 
	function($scope, $http, $fileUploader)
{
    // When landing on the page, check session history to see if user is logged in.

    // Initialize variables needed.
    var fromAddress = $scope.fromAddress = {
    	type: 'from',
    	name: '',
    	street1: '',
    	street2: '',
    	city: '',
    	state: '',
    	zip: '',
    	isValid: false,
    	isSaved: false,
    	isDirty: false
    };
    $scope.toAddress = {	// This will be overridden if user selects multiple upload.
    	type: 'to',
    	name: '',
    	street1: '',
    	street2: '',
    	city: '',
    	state: '',
    	zip: '',
    	isValid: false,
    	isSaved: false,
    	isDirty: false
    };
    $scope.creditCard = {
    	type: 'creditCard',
    	number: '',
    	cvc: '',
    	mm: '',
    	yyyy: '',
    	isValid: false,
    	isSaved: false,
    	isDirty: false
    };

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

    $scope.validateFormAndPost = function(form, ngModelObj) {
			ngModelObj.isValid = form.$valid;
			ngModelObj.isDirty = form.$dirty;

			if (form.$valid && form.$dirty) {
				// Send POST request to server.
				$http.post('/api/address', ngModelObj)
					.success(function(data) {
						ngModelObj.isSaved = 'true';
					})
					.error(function(data) {
						// Error.
						console.log('Error: ' + data);
					});
			};
    };

    $scope.generateStripeToken = function() {
    	// Upon submit, we will send the $scope.creditCard object to Stripe, which will generate
    	// a token.
    }
}]);