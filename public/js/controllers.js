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
  };
  var pdf = $scope.pdf = {
  	name: '',
  	file: '',
    settingId: 100,
  	isSaved: false,
  	isDirty: false,
  	isValid: false,
  	err: 'Sorry, something went wrong. Please try again!',
  	getId: function() {
      // If filename and path exists (means file already submitted once,
      // then submit a POST request.
  		if (this.name.length > 0 && this.file.length > 0) {
  			var obj = {};
  			obj.name = this.name;
  			obj.file = this.file;
        obj.setting_id = this.settingId;

        this.isSaved = false;
  			// Submit POST request.
  			$http.post('/api/file', obj)
  				.success(function(data) {

          if (typeof data[0] === "undefined") {
            // No error.
            lob.object = data.id;
            pdf.isSaved = true;
            pdf.isValid = true;
          } else {
            // Error.
            pdf.err = data[0].message;
            pdf.isSaved = false;
            pdf.isValid = false;
          };

					console.log(data);
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
  		};
  	},
  	uploader: $scope.uploader = $fileUploader.create({
    	scope: $scope,			// to automatically update the HTML. Default: $rootScope
    	url: '/api/file',
    	autoUpload: true,
    	removeAfterUpload: false
    })
    .bind('success', function (event, xhr, item, response) {
      // console.log('Success', xhr, item, response);
      console.log(response);
      if (typeof response[0] === 'undefined') {
      	// Success.
      	lob.object = response.id;
      	pdf.file = response.file;
      	pdf.name = response.name;
      	pdf.isSaved = true;
      	pdf.isValid = true;
      } else {
      	// Lob related error.
      	console.log(response[0].message);
      	pdf.err = response[0].message;
      	pdf.file = '';
      	pdf.name = '';
      	pdf.isSaved = false;
      	pdf.isValid = false;
      };
    })
    .bind('error', function (event, xhr, item, response) {
      console.info('Error', xhr, item, response);
    }),
  	remove: function(item) {
  		item.remove();	// Reset everything if the user decides to remove the item.
  		this.isSaved = false;
  		this.isDirty = false;
  		this.isValid = false;
  		lob.object = '';
  	}
  };
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

  pdf.uploader.headers = {'setting_id': pdf.settingId};
  // TODO: Check session history

  // TODO: If existing user and signed in, then retrieve relevant info.

  // TODO: If new user, just show landing page!

  // Generate address IDs
  $scope.getAddressId = function(addressObj) {
  	// This function will POST the addressObj to the Node API. We expect a Lob address ID
  	// as a successful response.
    console.log(addressObj);

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
        addressObj.isValid = true;
			} else {
				// Error.
				addressObj.err = data[0].message;
				addressObj.isValid = false;
        addressObj.isSaved = false;
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