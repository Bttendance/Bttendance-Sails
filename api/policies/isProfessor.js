/**
 * Allow any authenticated user.
 */
module.exports = function isProfessor (req, res, ok) {

	var username = req.param('username');
	var password = req.param('password');

	if (!username || !password) {
		console.log("isProfessor : Username and Password is required");
		return res.send(400, { error: "Username and Password is required"});
	}

	Professor.find({
		username: username,
		password: password
	}).limit(10).sort('username ASC').done(function(err, prof) {

		// Error handling
		if (err) {
	    console.log(err);
	    return res.send(500, { error: "Professor Find Error" });

	  // Found multiple Professors!
	  } else {
	    if (prof.length == 0) {
  			return res.send(403, { error: "You are not permitted to perform this action." });
	    } else if (prof.length > 1) {
	    	return res.send(500, { error: "Multiple Professor Found Error" });
	  	// Found one Professor!
	    } else {
	    	console.log("Professor found:", prof[0]);
	    	return ok();
	    }
	  }
	});
};