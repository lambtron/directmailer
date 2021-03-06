'use strict';

(function(){

//require the Twilio module and create a REST client
var client = require('twilio')(process.env.TWILIO_ASID, process.env.TWILIO_AUTH_TOKEN);

// Public functions.
module.exports = {
    sendMessage: function(to, from, body) {
        client.sendMessage({
            to: to,
            from: from,
            body: body
        }, function(err, responseData) {
            if (!err) {
                console.log(responseData);
            };
        });
    },
    standardizePhoneNumber: function(phone_number) {
        // 2409887757 to +12409887757
        var new_phone_number = phone_number + '';
        if (new_phone_number.length == 10) {
            new_phone_number = '+1' + new_phone_number;
        };
        return new_phone_number;
    }
};

}());