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
	, Lob = require('../app/helpers/lob')
	, Stripe = require('../app/helpers/stripe');

// Public functions. ===============================================================================
module.exports = function(app) {
	// POST a file. Save it so Lob can send it later. Return preview and success.
	app.post('/api/file', function(req, res) {
		// Store in Mongoose (assign it hash generated for the user. User redeems hash by registering
		// via email.)

		console.log(req);

		var obj = {};
		var file = '';

		// if req.body = {}, then it is File Uploader request.
		if (_.isEmpty(req.body)) {
			obj.name = req.files.pdfFile.name || '';
			file = obj.file = req.files.pdfFile.path || '';
			obj.setting_id = req.headers.setting_id || 100;
		} else {
			obj.name = req.body.name || '';
			file = obj.file = req.body.file || '';
			obj.setting_id = req.body.setting_id || 100;
		};

		Lob.createObject(obj, function(err, data) {
			if (err) {
				console.log('Error (lob): ');
				console.log(err);

				// Send error code.
				res.send(err, 400);
			} else {
				data.file = file;
				console.log(data);
				res.send(data);
			};
		});

		// Store in mongoose with unique ID.
	});

	// Submit Lob Job.
	app.post('/api/lob', function(req, res) {
		console.log(req.body);
		// .object : .object1
		// .fromAddressId : from
		// .toAddressId : .to
		// .name

		var job = {};

		job.from = req.body.fromAddressId;
		job.name = req.body.name;
		job.object1 = req.body.object;

		for(var i = 0; i < req.body.toAddresses.length; i++ ) {
			job.to = req.body.toAddresses[i];
			// Create job.
			Lob.sendJob(job, function(err, data) {
				if (err) {
					console.log('Error (lob job): ');
					console.log(err);

					// Send error code.
					res.send(err, 400);
				} else {
					console.log(data);
					res.send(data);
				};
			});
		};
	});

	// Submit request to Lob.
	app.post('/api/address', function(req, res) {
		console.log(req.body);

		var addressObj = {};

		addressObj = _.pick(req.body, 'name', 'email', 'phone', 'address_line1',
			'address_line2', 'address_city', 'address_state', 'address_zip', 'address_country');

		Lob.createAddress(addressObj, function(err, data) {
			if (err) {
				console.log('Error (lob): ');
				console.log(err);

				// Send error code.
				res.send(err, 400);
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
		console.log(req.body);

		// From here, call Stripe with credit card token.
		var obj = {};
		obj.card = req.body.card;
		obj.amount = req.body.amount;
		obj.description = req.body.description;
		obj.cvc = req.body.cvc;
		obj.currency = 'usd';

		Stripe.chargeCard(obj, function(data) {
			console.log(JSON.stringify(data));
			res.send(data);
		});
	});

	// Database stuff. ===============================================================================

	// * POST, add new user to mongodb.
	app.post('/api/user', function(req, res) {
		var first_name = req.body.firstName
		  , last_name = req.body.lastName;
	});

	// + GET all users and messages.
	app.get('/api/users', function(req, res) {
		User.find(function(err, users) {
			if (err) {
				res.send(err, 400);
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
				res.send(err, 400);
			};

			// Get and return all of the messages after the message is deleted.
			User.find(function(err, users) {
				if (err) {
					res.send(err, 400);
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