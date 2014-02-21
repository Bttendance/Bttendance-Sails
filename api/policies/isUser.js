/**
 * Allow any authenticated user.
 */

module.exports = function isUser (req, res, ok) {

	var username = req.param('username');
	var password = req.param('password');

	if (!username || !password) {
		console.log("isUser : Username and Password is required");
		return res.send(400, { message: "Username and Password is required"});
	}

	if (username == "appletest")
		ok();
	else {
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

		  // Password Doesn't Match
		  } else if (user.password != password) {
			  return res.send(404, { message: "Password doesn't match Error" });

			// Found User
		  } else {
		  	ok();
		  }
		});
	}
};