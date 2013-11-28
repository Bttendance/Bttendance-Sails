/**
 * Allow any authenticated user.
 */
module.exports = function hasCourse (req, res, ok) {

	var username = req.param('username');
	var course_id = req.param('course_id');

	if (!username || !course_id) {
		console.log("hasCourse : Username and Password and Course is required");
		return res.send(400, { message: "Username and Password and Course is required"});
	}

	Course.findOne(course_id).done(function(err, course) {

		// Error handling
		if (err) {
	    console.log(err);
	    return res.send(500, { message: "Course Find Error" });

	  // No User found
	  } else if (!course) {
	    return res.send(404, { message: "No Course Found Error" });
	  } else {
    	console.log("Course found : " + course);
    	if (course.professor != 'username') {
	    	return res.send(401, { message: "This Course doesn't belong to current professor Error" });
    	} else {
    		ok();
    	}
	  }
	});
};