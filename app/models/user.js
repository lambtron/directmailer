'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Message Schema
 */
var UserSchema = new Schema({
    created_on: {
        type: Date,
        default: Date.now
    },
    email_address: {
        type: String,
        default: '',
        trim: true
    },
    first_name: {
        type: String,
        default: '',
        trim: true
    },
    last_name: {
        type: String,
        default: '',
        trim: true
    }
    // Password, credit card info [, objects?, contact lists?]
});



/**
 * Statics
 */
UserSchema.statics = {
    
}

mongoose.model('User', UserSchema);