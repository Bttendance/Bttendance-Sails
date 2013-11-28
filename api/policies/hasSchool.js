/**
 * Allow any authenticated user.
 */
module.exports = function hasSchool (req, res, ok) {

	var username = req.param('username');
	var school_id = req.param('school_id');

	if (!username || !school_id) {
		console.log("hasSchool : Username and School and Course is required");
		return res.send(400, { message: "Username and Password and Course is required"});
	}

	User.findOne({
		username: username
	}).done(function(err, user) {

		// Error handling
		if (err) {
	    console.log(err);
	    return res.send(500, { message: "User Find Error" });

	  // No User found
	  } else if (!user) {
	    return res.send(404, { message: "No User Found Error" });

	  // School doesn't found
	  } else if (!user.schools || user.schools.indexOf(school_id) == -1) {
	    return res.send(401, { message: "School doesn't found Error" });

		// Found School
	  } else {
	  	ok();
	  }
	});
};