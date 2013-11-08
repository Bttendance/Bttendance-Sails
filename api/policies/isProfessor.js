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

	Professor.findOne({
		username: username,
		password: password
	}).done(function(err, prof) {

		// Error handling
		if (err) {
	    console.log(err);
	    return res.send(500, { error: "Professor Find Error" });

	  // No Professor found
	  } else if (!prof) {
	    return res.send(404, { error: "No Professor Found Error" });

	  // Found multiple Professors!
	  } else {
    	console.log("Professor found:", prof);
    	return ok();
	  }
	});
};