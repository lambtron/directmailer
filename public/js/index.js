'use strict';

$(document).ready(function() {
	var fileInput = document.getElementById('address-file-upload');
	var csvFile = {};

	fileInput.addEventListener('change', function(e) {
		var file = fileInput.files[0];
		var textType = /text.*/;

		// Use DOM to get AngularJS root scope.
		var scope = angular.element(this).scope();

		if (file.type.match(textType)) {
			var reader = new FileReader();

			reader.onload = function(e) {
				var csvString = reader.result;
				console.log(csvString);
				
				// Clean the headers.
				var firstLine = csvString.split('\n')[0];
				var cleanedFirstLine = firstLine.toLowerCase().replace(/\s+/g, '');
				csvString = csvString.replace(firstLine, cleanedFirstLine);

				// Parse CSV.
				csvFile = $.csv.toObjects(csvString);

				scope.$apply(function() {
					for(var i = 0; i < csvFile.length; i++ ) {
						// First getAddressId of each item, which will then update the model.
						csvFile[i].type = 'to';
						scope.getAddressId(csvFile[i]);
						// scope.toAddresses.addresses.push(csvFile[i]);
					};
				});
			};

			reader.readAsText(file);
		} else {
			// Error.

		};
	});

	// Setup stripe.
  Stripe.setPublishableKey('pk_live_zOfOwq7NI2ajzRKakRJa54mZ');
});