/**
 * Allow any authenticated user.
 */
module.exports = function isUser (req, res, ok) {

	var username = req.param('username');
	var password = req.param('password');

	if (!username || !password) {
		console.log("isUser : Username and Password is required");
		return res.send(400, { error: "Username and Password is required"});
	}

	User.findOne({
		username: username,
		password: password
	}).done(function(err, user) {

		// Error handling
		if (err) {
	    console.log(err);
	    return res.send(500, { error: "User Find Error" });

	  // No User found
	  } else if (!user) {
	    return res.send(404, { error: "No User Found Error" });

	  // Found multiple Professors!
	  } else {
    	console.log("User found : " + user[0]);
    	return ok();
	  }
	});
};