/**
 * Allow any authenticated user.
 */
module.exports = function isCourse (req, res, ok) {

	var course_id = req.param('course_id');

	if (!course_id) {
		console.log("isCourse : Course is required");
		return res.send(400, { message: "Course is required"});
	}

	Course.findOne(course_id).done(function(err, course) {

		// Error handling
		if (err) {
	    console.log(err);
	    return res.send(500, { message: "Course Find Error" });

	  // No Course found
	  } else if (!course) {
	    return res.send(404, { message: "No Course Found Error" });

	  // Found multiple Professors!
	  } else {
    	console.log("Course found:", course);
    	return ok();
	  }
	});
};