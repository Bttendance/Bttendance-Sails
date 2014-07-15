/**
 * IdentificationsController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	
	update_identity: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var full_name = req.param('full_name');

		if (!full_name)
			return res.send(400, Error.alert("FullName Update Error", "FullName is required."));

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
				return res.send(404, Error.alert("FullName Update Error", "User doesn't exist."));

	  	user.full_name = full_name;
	  	user.save(function callback(err, updated_user) {
	  		if (err || !updated_user)
					return res.send(400, Error.alert("FullName Update Error", "Updating full name has been failed."));
		  	return res.send(updated_user.toWholeObject());
	  	});
		});
	}

};
