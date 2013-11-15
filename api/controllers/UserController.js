/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var passwordHash = require('password-hash');

module.exports = {

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {},

	signin: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var email = req.param('email');
		var password = req.param('password');

		if (!username && !email) {
			console.log("UserController : signin : Username or Email is required");
			return res.send(400, { error: "Username or Email is required"});
		}

		if (!password) {
			console.log("UserController : signin : Password is required");
			return res.send(400, { error: "Password is required"});
		}

		if (username) {
			User.findOne({
	  		username: username
			}).done(function(err, user) {
				return checkPass(res, err, user, password);
			});
		} else {
			User.findOne({
	  		email: email
			}).done(function(err, user) {
				return checkPass(res, err, user, password);
			});
		}
	}
};

var checkPass = function(res, err, user, password) {

	// Error handling
	if (err) {
		console.log(err);
    return res.send(500, { error: "User Find Error" });

  // No User found
  } else if (!user) {
    return res.send(404, { error: "No User Found Error" });

  // Found User!
  } else if (!passwordHash.verify(password, user.password)) {
	    return res.send(404, { error: "Password doesn't match Error" });
  } else {
		var userJSON = JSON.stringify(user);
		// Add Password
		// var userObj = JSON.parse(userJSON);
		// userObj.password = user.password;
		// userJSON = JSON.stringify(userObj);
  	return res.send(userJSON);
  }
}

