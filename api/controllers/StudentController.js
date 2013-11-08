/**
 * StudentController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var passwordHash = require('password-hash');

module.exports = {

	signin: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var email = req.param('email');
		var password = req.param('password');

		if (!username && !email) {
			console.log("StudentController : signin : Username or Email is required");
			return res.send(400, { error: "Username or Email is required"});
		}

		if (!password) {
			console.log("StudentController : signin : Password is required");
			return res.send(400, { error: "Password is required"});
		}

		if (username) {
			Student.findOne({
	  		username: username
			}).done(function(err, std) {

	  		// Error handling
	  		if (err) {
	  			console.log(err)
			    return res.send(500, { error: "Student Find Error" });;

			  // No Student found
			  } else if (!std) {
			    return res.send(404, { error: "No Student Found Error" });

			  // Found student!
			  } else {
		    	console.log("Student found:", std);
		    	if (!passwordHash.verify(password, std.password)) {
		    		return res.send(400, { error: "Password doesn't match Error" });
		    	} else {
						var stdJSON = JSON.stringify(std);
						res.send(stdJSON);
					}
			  }
			});
		} else {
			Student.findOne({
	  		email: email
			}).done(function(err, std) {

	  		// Error handling
	  		if (err) {
					console.log(err);
			    return res.send(500, { error: "Student Find Error" });

			  // No Student found
			  } else if (!std) {
			    return res.send(404, { error: "No Student Found Error" });

			  // Found student!
			  } else {
		    	console.log("Student found:", std);
		    	if (!passwordHash.verify(password, std.password)) {
		    		return res.send(400, { error: "Password doesn't match Error" });
		    	} else {
						var stdJSON = JSON.stringify(std);
						res.send(stdJSON);
					}
			  }
			});
		}
	}

};
