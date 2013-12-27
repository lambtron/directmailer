'use strict';

(function() {

/**
 * Import all models ===============================================================================
 */
require('../app/models/user');

/**
 * Module dependencies =============================================================================
 */
var mongoose = require('mongoose')
	, User = mongoose.model('User')
	, _ = require('underscore');

// Public functions. ===============================================================================
module.exports = function(app) {
	// POST a file. Save it so Lob can send it later. Return preview and success.
	app.post('/api/file', function(req, res) {
		// Store in Mongoose (assign it hash generated for the user. User redeems hash by registering
		// via email.)
		console.log(req);
		// res.send('200');
	});

	// POST check out.
	app.post('/api/checkout', function(req, res) {
		// Package STRIPE (charge them!) and LOB it over (send them the JOB object).
	});

	// * POST, add new user to mongodb.
	app.post('/api/user', function(req, res) {
		var first_name = req.body.firstName
		  , last_name = req.body.lastName;
		  // , phone_number = Twilio.standardizePhoneNumber(req.body.phoneNumber);

		// User.findOne({ phone_number: phone_number }, function(err, user) {
		// 	if (err) {
		// 		res.send(err);
		// 	};

		// 	// If existing user is found.
		// 	if (user) {

		// 		// Need to return all users.
				
		// 	} else {
		// 		console.log('Creating new user.');

		// 		// If user is not found, then create a new one.
		// 		User.create({
		// 			first_name: first_name,
		// 			last_name: last_name
		// 			// phone_number: phone_number
		// 		}, function(err, user) {
		// 			if (err) {
		// 				res.send(err);
		// 			};

		// 		});
		// 	};
		// });
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