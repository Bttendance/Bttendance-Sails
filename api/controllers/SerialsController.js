/**
 * SerialsController
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

	request: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var school_id = req.param('school_id');

	  if (!school_id)
    	return res.send(400, { message: "School ID is required." });

		Serials.create({
		  school: school_id
		}).exec(function callback(err, serial) {
		  if (err || !serial)
	    	return res.send(404, { message: "No Serial Created Error" });

	  	return res.send(serial);
		});
	}
};
