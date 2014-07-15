/**
 * DevicesController
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

module.exports = {

	update_notification_key: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var notification_key = req.param('notification_key');

		if (!notification_key) {
			console.log("UserController : update_notification_key : Notification Key is required");
			return res.send(400, { message: "Notification Key is required"});
		}

		Users
		.findOne({
		  or : [
		    { email: email },
		    { username: username }
		  ]
		})
		.populate('device')
		.populate('supervising_courses')
		.populate('attending_courses')
		.populate('employed_schools')
		.populate('enrolled_schools')
		.populate('identifications')
		.exec(function callback(err, user) {
			if (err || !user)
		    return res.send(404, { message: "No User Found Error" });

		  user.device.notification_key = notification_key;
		  user.device.save(function callback(err) {
		   	if (err)
			    return res.send(500, { message: "Device Save Error" });

		  	return res.send(user.toWholeObject());
	    });
		});
	}
};
