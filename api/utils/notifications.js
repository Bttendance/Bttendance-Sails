/**
 * Notification.js
 *
 * @module			:: Json Handler
 * @description	:: Contains logic for notification JSON handling.
 *
 *  { 
 *      "type": "type",
 *      "title" : "title",
 *      "message": "message"
 *  }
 */

var gcm = require('node-gcm');
var apn = require('apn');
var Path = require('path');

// Function to get id list
// user.populate('device')
exports.send = function(user, title, message, type) {
	if (!user.device.notification_key)
		return;

	if (user.device.type == 'android') {

		var msg = new gcm.Message({
		    collapseKey: 'bttendance',
		    delayWhileIdle: false,
		    timeToLive: 4,
		    data: {
		    	title: title,
		      message: message,
		      type: type
		    }
		});

		var registrationIds = [];
		registrationIds.push(user.device.notification_key);

		var sender;
		if (process.env.NODE_ENV == 'development')
		 	sender = new gcm.Sender('AIzaSyCqiq_YpGtSzIi7lr5SGcL5a74nJxm6K3o');
		else
		 	sender = new gcm.Sender('AIzaSyByrjmrKWgg1IvZhFZspzYVMykKHaGzK0o');
		 
		sender.send(msg, registrationIds, 4, function (err, result) {
			if (err)
				console.log(err);
			else
    		console.log("Android notification has been sent to " + user.full_name + " (" + user.username + ")");
		});

	} else if (user.device.type == 'iphone') {

		var options;
		if (process.env.NODE_ENV == 'development') {
			options = { cert: './assets/certification/cert_development.pem',
									certData: null,
									key: './assets/certification/key_development.pem',
									keyData: null,
									passphrase: "bttendance",
									ca: null,
									gateway: "gateway.sandbox.push.apple.com",
									port: 2195,
									enhanced: true,
									errorCallback: undefined,
									cacheLength: 100 };
		} else { //production
			options = { cert: './assets/certification/cert_production.pem',
									certData: null,
									key: './assets/certification/key_production.pem',
									keyData: null,
									passphrase: "bttendance",
									ca: null,
									gateway: "gateway.sandbox.push.apple.com",
									port: 2195,
									enhanced: true,
									errorCallback: undefined,
									cacheLength: 100 };
		}

    var apnConnection = new apn.Connection(options);
		var myDevice = new apn.Device(user.device.notification_key); //for token
		var note = new apn.Notification();

		var alert = "Notification from " + title;
		if (message)
			alert = title + " : " + message;

		note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
		note.badge = 1;
		note.sound = "ping.aiff";
		note.alert = alert;
		note.payload = {
			'title' 	: title,
			'message' : message,
			'type' 		: type 
		};
		apnConnection.pushNotification(note, myDevice);
		console.log("iOS notification has been sent to " + user.full_name + " (" + user.username + ")");
	}
}
