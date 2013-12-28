'use strict';

directMailer.controller('mainController', ['$scope', '$http', '$fileUploader', 
	function($scope, $http, $fileUploader)
{
    // When landing on the page, check session history to see if user is logged in.

    // Initialize variables needed.
    var lob = $scope.lob = {
    	object: '',
    	fromAddressId: '',
    	toAddressId: '',
    	isReady: false		// Only ready when all of the properties are filled and valid.
    }
    var fromAddress = $scope.fromAddress = {
    	type: 'from',
    	name: '',
    	address_line1: '',
    	address_line2: '',
    	address_city: '',
    	address_state: '',
    	address_zip: '',
    	address_country: 'US',
    	isValid: false,
    	isSaved: false,
    	isDirty: false,
    	err: 'Sorry, please fill in the required fields.'
    };
    var toAddress = $scope.toAddress = {	// This will be overridden if user selects
    	type: 'to',													// multiple upload.
    	name: '',
    	address_line1: '',
    	address_line2: '',
    	address_city: '',
    	address_state: '',
    	address_zip: '',
    	address_country: 'US',
    	isValid: false,
    	isSaved: false,
    	isDirty: false,
    	err: 'Sorry, please fill in the required fields.'
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

    // Generate address IDs
    $scope.getAddressId = function(addressObj) {
    	// This function will POST the addressObj to the Node API. We expect a Lob address ID
    	// as a successful response.
			$http.post('/api/address', addressObj)
				.success(function(data) {
					if (typeof data[0] === "undefined") {
						// No error.
						if (data.type == 'to') {
							lob.toAddressId = data.id;
						} else if (data.type == 'from') {
							lob.fromAddressId = data.id;
						};
						addressObj.isSaved = true;
					} else {
						// Error.
						addressObj.err = data[0].message;
						addressObj.isValid = false;
					};

					console.log(addressObj);
				})
				.error(function(data) {
					// Error.
					console.log('Error: ' + data);
				});
    };

    $scope.validateFormAndPost = function(form, ngModelObj, cb) {
			ngModelObj.isValid = form.$valid;
			ngModelObj.isDirty = form.$dirty;

			if (form.$valid && form.$dirty) {
				cb(ngModelObj);
			};
    };

    $scope.checkLobReady = function() {
    	// This is just to check if the Lob has all of its necessary properties.

    };
}]);