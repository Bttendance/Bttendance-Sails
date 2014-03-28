/**
 * isUser
 *
 * @module      :: Policy
 * @description :: 
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

module.exports = function isUser (req, res, next) {

	// Super Port Policy
	if (req.port == 7331) 
		return next();

	// Params
	var username = req.param('username');
	var password = req.param('password');

	if (!username || !password) {
		console.log("isUser : Username and Password is required");
		return res.send(400, { message: "Username and Password is required"});
	}

	// Super Username Policy
	if (username == "appletest0"
		|| username == "appletest1"
		|| username == "appletest2"
		|| username == "appletest3"
		|| username == "appletest4"
		|| username == "appletest5"
		|| username == "appletest6"
		|| username == "appletest7"
		|| username == "appletest8"
		|| username == "appletest9")
		return next();

	// isUser Policy
	Users.findOneByUsername(username).done(function(err, user) {

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
	  	return next();
	  }
	});

};