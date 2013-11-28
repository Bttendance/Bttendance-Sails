/**
 * Allow any authenticated user.
 */
module.exports = function isSchool (req, res, ok) {

	var school_id = req.param('school_id');

	if (!school_id) {
		console.log("isSchool : School is required");
		return res.send(400, { message: "School is required"});
	}

	School.findOne(school_id).done(function(err, school) {

		// Error handling
		if (err) {
	    console.log(err);
	    return res.send(500, { message: "School Find Error" });

	  // No School found
	  } else if (!school) {
	    return res.send(404, { message: "No School Found Error" });

	  // Found multiple Professors!
	  } else {
    	console.log("School found:", school);
    	return ok();
	  }
	});
};