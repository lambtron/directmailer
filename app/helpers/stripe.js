// use 'strict';

// Set the Lob API credentials.
var STRIPE = require('stripe')(process.env.LOB_API_KEY);
var _ = require('underscore');

// https://github.com/stripe/stripe-node

// Public functions.
module.exports = {
	chargeCard: function(obj, cb) {
		// Error handling.
		// Required arguments.
		// - amount
		// - currency (default to USD here)
		// - customer, OR
		// - card
		// - CVC! (highly recommended)
		// Optional
		// - description
		STRIPE.charges.create(obj, cb);
	}
};