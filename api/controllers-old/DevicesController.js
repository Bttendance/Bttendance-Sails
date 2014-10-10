/**
 * DeviceController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var Error = require('../utils/errors');

module.exports = {

	update_notification_key: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var device_uuid = req.param('device_uuid');
		var notification_key = req.param('notification_key');

		if (!notification_key) 
			return res.send(400, Error.log(req, "Notification Key Update Error", "Key is required."));

		User
		.findOneByEmail(email)
		.populateAll()
		.exec(function callback(err, user) {
			if (err || !user)
				return res.send(404, Error.log(req, "Notification Key Update Error", "User doesn't exist."));

		  if (device_uuid != user.device.uuid)
				return res.send(404, Error.log(req, "Notification Key Update Error", "Device doesn't match."));

			Device
			.update({ id : user.device.id }, { notification_key : notification_key })
			.exec(function callback(err, device) {
				if (err || !device)
					return res.send(404, Error.log(req, "Notification Key Update Error", "Updating Device Failed."));

				User
				.findOneById(user.id)
				.populateAll()
				.exec(function callback(err, user) {
					if (err || !user)
						return res.send(404, Error.log(req, "Notification Key Update Error", "User doesn't exist."));
					
			  	return res.send(user.toWholeObject());
				});
			});
		});
	}
};
