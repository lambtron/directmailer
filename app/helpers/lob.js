use 'strict'

// Set the Lob API credentials.
var LOB = new (require('lob')) (process.env.LOB_API_KEY);

// Public functions.
module.exports = {
	// Create a local Lob object (POST).
	// - filePath (required)
	// - setting_id (required) (i.e. 100 is black&white 8.5'x11')
	// - name (optional)
	// - quantity (optional, defaults to 1)
	// - double sided (optional)
	createObject: function(obj, cb) {
		// if key or value is undefined, then set it to default.
		// copy object but if undefined take default values?
		var name = (typeof n === "undefined") ? "" : n;
		var quantity = (typeof q === "undefined") ? 1 : q;
		var double_sided = (typeof ds === "undefined") ? true : ds;
		LOB.objects.create({
			name: name,
			file: filePath,
			setting_id: setting_id,
			quantity: quantity,
			double_sided: double_sided
		}, function(err, res) {
			cb(err, res);
		});
	},
	// Create an address (POST).
	// - name (req)
	// - email (opt)
	// - phone (opt)
	// - address_line1 (req)
	// - address_line2 (opt)
	// - address_city (req)
	// - address_state (req)
	// - address_zip (req)
	// - address_country (req)
	// TODO: pass an obj with the parameters as key:value pairs.
	createAddress: function(addressObj, cb) {
		var email = (typeof e === "undefined") ? "" : e;
		var phone = (typeof p === "undefined") ? "" : p;
		var address_line2 = (typeof add_line2 === "undefined") ? "" : add_line2;
		LOB.addresses.create({
			name: name,
			email: email,
			phone: phone,
			address_line1: address_line1,
			address_line2: address_line2,
			address_city: address_city,
			address_state: address_state,
			address_zip: address_zip,
			address_country: address_country,
		}, function(err, res) {
			cb(err, res);
		});
	},
	// Verify an Address.
	// - all arguments are optional here, except cb)
	// TODO: pass an obj with the parameters as key:value pairs.
	verifyAddress: function(addressObj, cb) {
		for (var i = 0; i < arguments.length; i++) {
			arguments[i] = (typeof arguments[i] === "undefined") ? "" : arguments[i];
		};
		LOB.addresses.verify({
			address_line1: address_line1,
			address_line2: address_line2,
			address_city: address_city,
			address_state: address_state,
			address_zip: address_zip,
			address_country: address_country
		}, function(err, res) {
			cb(err, res);
		});
	},
	// Create a Job (send the mail!)
	// - to (req)
	// - from (req)
	// - obj (req)
	// - cb (req)
	// - rest are opt
	sendJob: function(jobObj, cb) {
		for (var i = 0; i < arguments.length; i++) {
			arguments[i] = (typeof arguments[i] === "undefined") ? "" : arguments[i];
		};
		if ( cb === "" ) {
			cb = function(err, res) {
				console.log(err, res);
			};
		};
		LOB.jobs.create({
			name: name,
			from: from,
			to: to,
			object1: object
			// packaging_id: packaging_id,
			// service_id: service_id
		}, function(err, res) {
			cb(err, res);
		});
	}
}