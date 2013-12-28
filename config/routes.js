'use strict';

(function() {

/**
 * Import all models ===============================================================================
 */
require('../app/models/user');

/**
 * Module dependencies =============================================================================
 */
var _ = require('underscore')
	, mongoose = require('mongoose')
	, User = mongoose.model('User')
	, Lob = require('../app/helpers/lob');

// Public functions. ===============================================================================
module.exports = function(app) {
	// POST a file. Save it so Lob can send it later. Return preview and success.
	app.post('/api/file', function(req, res) {
		// Store in Mongoose (assign it hash generated for the user. User redeems hash by registering
		// via email.)
		console.log(req);

		var obj = {};

		// if req.body = {}, then it is File Uploader request.
		if (_.isEmpty(req.body)) {
			obj.name = req.files.file.name;
			obj.file = req.files.file.path;
			obj.setting_id = 100;
		} else {
			obj.name = req.body.name;
			obj.file = req.body.file;
			obj.setting_id = req.body.setting_id;
		};

		Lob.createObject(obj, function(err, data) {
			if (err) {
				console.log('Error (lob): ');
				console.log(err);
				res.send(err);
			} else {
				data.file = obj.file.path;
				console.log(data);
				res.send(data);
			};
		});
	});

	// Get request from Angular, submit request to Lob.
	app.post('/api/address', function(req, res) {
		console.log(req.body);
		// Parse request. Is this a TO or a FROM address? Is this an Array?
		var addressObj = _.pick(req.body, 'name', 'email', 'phone', 'address_line1', 'address_line2',
			'address_city', 'address_state', 'address_zip', 'address_country');
		Lob.createAddress(addressObj, function(err, data) {
			if (err) {
				console.log('Error (lob): ');
				console.log(err);
				res.send(err);
			} else {
				data.type = req.body.type;
				console.log(data);
				res.send(data);
			};
		});
	});

	// POST check out.
	app.post('/api/checkout', function(req, res) {
		// Package STRIPE (charge them!) and LOB it over (send them the JOB object).
	});

	// * POST, add new user to mongodb.
	app.post('/api/user', function(req, res) {
		var first_name = req.body.firstName
		  , last_name = req.body.lastName;
	});

	// + GET all users and messages.
	app.get('/api/users', function(req, res) {
		User.find(function(err, users) {
			if (err) {
				res.send(err);
			};
			res.json(users);
		});
	});

	// Delete a User.
	app.delete('/api/users/:user_id', function(req, res) {
		User.remove({
			_id : req.params.user_id
		}, function(err, user) {
			if (err) {
				res.send(err);
			};

			// Get and return all of the messages after the message is deleted.
			User.find(function(err, users) {
				if (err) {
					res.send(err);
				};
				res.json(users);
			});
		});
	});

	// Application route =============================================================================
	app.get('*', function(req, res) {
		// Load the single view file (Angular will handle the page changes).
		res.sendfile('index.html', {'root': './public/views/'});
	});
};

// Private functions. ==============================================================================

}());