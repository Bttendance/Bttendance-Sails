/**
 * Allow any authenticated user.
 */
module.exports = function hasCourse (req, res, ok) {

	var username = req.param('username');
	var course_id = req.param('course_id');

	if (!username || !course_id) {
		console.log("hasCourse : Username and Course is required");
		return res.send(400, { message: "Username and Course is required"});
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

	  // Course doesn't found
	  } else if (!user.courses || user.courses.indexOf(Number(course_id)) == -1) {
	    return res.send(401, { message: "Course doesn't found Error" });

		// Found Course
	  } else {
	  	ok();
	  }
	});
};