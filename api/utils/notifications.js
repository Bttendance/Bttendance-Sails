/**
 * Notification.js
 *
 * @module			:: Json Handler
 * @description	:: Contains logic for notification JSON handling.
 *
 *  { 
 *      "type": "type", (attendance_started, attendance_checked, clicker_opened, notice, comments, etc)
 *      "title" : "title",
 *      "message": "message"
 *  }
 */

var gcm = require('node-gcm');
var apn = require('apn');

// Function to get id list
// user.populate('device')
// post.populate(all)
var send = function(user, post, message, type) {
	if (!user.device.notification_key)
		return;

	if (user.device.type == 'android') {

		var postJSON;
		if (post)
			postJSON = JSON.stringify(post.toWholeObject());

		var msg = new gcm.Message({
		    collapseKey: 'bttendance',
		    delayWhileIdle: false,
		    timeToLive: 4,
		    data: {
		    	title: post.course.name,
		      message: message,
		      type: type,
		      post: postJSON
		    }
		});

		var registrationIds = [];
		registrationIds.push(user.device.notification_key);

		var sender = new gcm.Sender('AIzaSyByrjmrKWgg1IvZhFZspzYVMykKHaGzK0o');
		sender.send(msg, registrationIds, 4, function (err, result) {
			if (err)
				console.log(err);
			else
    		console.log(result);
		});

	} else if (user.device.type == 'iphone') {

		var apns = require('apn');
		var options;

		if (process.env.NODE_ENV == 'development') {
			options = { cert: "./certification/cert_development.pem",
									certData: null,
									key: "./certification/key_development.pem",
									keyData: null,
									passphrase: "bttendance",
									ca: null,
									gateway: "gateway.sandbox.push.apple.com",
									port: 2195,
									enhanced: true,
									errorCallback: undefined,
									cacheLength: 100 };
		} else { //production
			options = { cert: "./certification/cert_production.pem",
									certData: null,
									key: "./certification/key_production.pem",
									keyData: null,
									passphrase: "bttendance",
									ca: null,
									gateway: "gateway.sandbox.push.apple.com",
									port: 2195,
									enhanced: true,
									errorCallback: undefined,
									cacheLength: 100 };
		}

    var apnConnection = new apns.Connection(options);
		var myDevice = new apns.Device(user.device.notification_key); //for token
		var note = new apns.Notification();

		var alert = "Notification from " + post.course.name;
		if (message)
			alert = post.course.name + " : " + message;

		note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
		note.badge = 1;
		note.sound = "ping.aiff";
		note.alert = alert;
		note.payload = {
			'title' 	: post.course.name,
			'message' : message,
			'type' 		: type 
		};
		note.device = myDevice;

		apnConnection.sendNotification(note);
	}

	console.log("noti sent : " + user.id + ", post : " + post);
}
