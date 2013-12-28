// use 'strict';

// Set the Lob API credentials.
var LOB = new (require('lob')) (process.env.LOB_API_KEY);
var _ = require('underscore');

// Public functions.
module.exports = {
	// Create a local Lob object (POST).
	// - filePath (required)
	// - setting_id (required) (i.e. 100 is black&white 8.5'x11')
	// - name (optional)
	// - quantity (optional, defaults to 1)
	// - double sided (optional)
	createObject: function(obj, cb) {
		obj.name = (typeof obj.name === "undefined") ? "" : obj.name;
		obj.quantity = (typeof obj.quantity === "undefined") ? 1 : obj.quantity;
		obj.double_sided = (typeof obj.double_sided === "undefined") ? true : obj.double_sided;
		LOB.objects.create(obj, function(err, data) {
			cb(err, data);
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
		var keys = _.keys(addressObj);
		var totalKeys = ["name", "email", "phone", "address_line1", "address_line2", "address_city", 
			"address_state", "address_zip", "address_country"];
		var missingKeys = _.difference(keys, totalKeys);
		// Set default values for the missing keys.
		for (var i = 0; i < missingKeys.length; i ++) {
			addressObj[missingKeys[i]] = "";
		}
		LOB.addresses.create(addressObj, function(err, data) {
			cb(err, data);
		});
	},
	// Verify an Address.
	// - all arguments are optional here, except cb)
	// TODO: pass an obj with the parameters as key:value pairs.
	verifyAddress: function(addressObj, cb) {
		var keys = _.keys(addressObj);
		var totalKeys = ["address_line1", "address_line2", "address_city", "address_state",
			"address_zip", "address_country"];
		var missingKeys = _.difference(keys, totalKeys);
		// Set default values for the missing keys.
		for (var i = 0; i < missingKeys.length; i ++) {
			addressObj[missingKeys[i]] = "";
		}
		LOB.addresses.verify(addressObj, function(err, data) {
			cb(err, data);
		});
	},
	// Create a Job (send the mail!)
	// - to (req)
	// - from (req)
	// - obj (req)
	// - cb (req)
	// - rest are opt
	sendJob: function(jobObj, cb) {
		var keys = _.keys(jobObj);
		var totalKeys = ["to", "from", "object1", "name"];
		var missingKeys = _.difference(keys, totalKeys);
		// Set default values for the missing keys.
		for (var i = 0; i < missingKeys.length; i ++) {
			jobObj[missingKeys[i]] = "";
		}
		LOB.jobs.create(jobObj, function(err, data) {
			cb(err, data);
		});
	}
};