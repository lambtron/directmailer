'use strict';

directMailer.controller('mainController', ['$scope', '$http', '$fileUploader', 
	function($scope, $http, $fileUploader)
{
  // When landing on the page, check session history to see if user is logged in.

  // Initialize variables needed.
  var lob = $scope.lob = {
    name: 'test',
  	object: '',
  	fromAddressId: '',
    toAddresses: [], // be all addressIds
    isReady: false,
  	setReadiness: function() {      // Only ready when all of the properties are filled and valid.
      if(this.object.length > 0 && this.fromAddressId.length > 0 && 
        toAddresses.addresses.length > 0 ) {
        this.isReady = true;
        return true;
      } else {
        this.isReady = false;
        return false;
      };
    },
    price: 0,
    calculatePrice: function() {
      if(this.setReadiness()) {
        this.err = '';
        // Quantity x fixed price.
        var quantity = (this.toAddresses.length == 0) ? 1 : this.toAddresses.length;
        // if pdf.settingId = 100, then use one multiplier
        // if pdf.settingId = 101, then use another multiplier
        // $1.5 until 500quantity
        var typeMultiplier = 1.5;
        if (pdf.settingId == 101) {
          typeMultiplier = 2;
        };
        if (quantity < 500) {
          typeMultiplier = typeMultiplier/2;
        };
        this.price = quantity * typeMultiplier;
      } else {
        this.err = 'There are still missing components to your print and mail job.'
      };
    },
    err: ''
  };
  var pdf = $scope.pdf = {
  	name: '',
  	file: '',
    settingId: 100,
  	isSaved: false,
  	isDirty: false,
  	isValid: false,
  	err: '',
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
          console.log(data);
          lob.object = data.id;
          pdf.isSaved = true;
          pdf.isValid = true;
				})
				.error(function(data) {
					console.log('Error: ' + data[0].message);
          pdf.err = data[0].message;
          pdf.isSaved = false;
          pdf.isValid = false;
          pdf.isDirty = true;
				});
  		};
  	},
  	uploader: $fileUploader.create({
    	scope: $scope,			// to automatically update the HTML. Default: $rootScope
    	url: '/api/file',
    	autoUpload: true,
    	removeAfterUpload: false,
      alias: 'pdfFile',
      filters: [
        function( item ) {
          // console.log(item);
          // Make sure it is a PDF file, as that is only allowed by Lob.
          return true;
          if (item.type.indexOf('pdf') != -1) {
            pdf.isValid = true;
            return true;
          } else {
            pdf.err = 'Sorry, you must upload a .pdf file.';
            pdf.isValid = false;
            console.log('Sorry, you must upload a .pdf file.');
            console.log(pdf);
            return false;
          };
        }
      ]
    })
    .bind('success', function (event, xhr, item, response) {
      // console.log('Success', xhr, item, response);
      // console.log(response);
    	lob.object = response.id;
    	pdf.file = response.file;
    	pdf.name = response.name;
    	pdf.isSaved = true;
    	pdf.isValid = true;
    })
    .bind('error', function (event, xhr, item, response) {
      console.info('Error', xhr, item, response);
      pdf.err = response[0].message;
      pdf.file = '';
      pdf.name = '';
      pdf.isSaved = false;
      pdf.isValid = false;
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

  var toAddresses = $scope.toAddresses = {
    addresses: [],                      // array of Address objects.
    err: '',
    isValid: false,
    isSaved: false,
    isDirty: false,
    remove: function(index) {
      toAddresses.addresses.splice(index, 1);
      lob.toAddresses.splice(index, 1);
    }
  };

  var stripeObj = $scope.stripeObj = {
    submit: function(status, response) {
      if(response.error) {
        console.log(response.error);
        this.err = response.error;
      } else {
        console.log(response.id);
        // got stripe token, now POST it to server.
        var obj = {};
        obj.card = response.id;
        obj.amount = lob.price;
        obj.description = 'DirectMailer payment for ' + lob.name; // Add a receipt ID in the back.
        obj.cvc = $scope.cvc;   // For stripe back end error handling.

        // POST token and price to server endpoint.
        $http.post('/api/checkout', obj)
        .success(function(data) {
          // It works!
          console.log('Stripe worked: ' + JSON.stringify(data));
        })
        .error(function(data) {
          // Something went wrong.
          console.log('Error (stripe): ' + data);
        });
      };
    },
    err: ''
  };

  // TODO: Check session history

  // TODO: If existing user and signed in, then retrieve relevant info.

  // TODO: If new user, just show landing page!

  // Generate address IDs
  $scope.getAddressId = function(addressObj) {
  	// This function will POST the addressObj to the Node API. We expect a Lob address ID
  	// as a successful response.

		$http.post('/api/address', addressObj)
		.success(function(data) {
			if (data.type == 'to') {
        // Need to push a shallow copy of addressObj to toAddresses.addresses.
        var addressObjClone = JSON.parse(JSON.stringify(addressObj));
        toAddresses.addresses.push(addressObjClone); // This address should be valid.
        lob.toAddresses.push(data.id);
			} else if (data.type == 'from') {
				lob.fromAddressId = data.id;
			};
			addressObj.isSaved = true;
      addressObj.isValid = true;

			console.log(addressObj);
		})
		.error(function(data) {
			// Error.
			console.log('Error: ' + data[0].message);
      addressObj.err = data[0].message;
      addressObj.isValid = false;
      addressObj.isSaved = false;
		});
  };

  $scope.validateFormAndPost = function(form, ngModelObj, cb) {
		ngModelObj.isValid = form.$valid;
		ngModelObj.isDirty = true;

		if (form.$valid) {
			cb(ngModelObj);
		};
  };

}]); 