/**
 * ProfessorController
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
			console.log("ProfessorController : signin : Username or Email is required");
			return res.send(400, { error: "Username or Email is required"});
		}

		if (!password) {
			console.log("ProfessorController : signin : Password is required");
			return res.send(400, { error: "Password is required"});
		}

		if (username) {
			Professor.findOne({
	  		username: username
			}).done(function(err, prof) {

	  		// Error handling
	  		if (err) {
			    console.log(err);
			    return res.send(500, { error: "Professor Find Error" });

			  // No Professor found
			  } else if (!prof) {
			    return res.send(404, { error: "No Professor Found Error" });

			  // Found Professor!
			  } else {
		    	console.log("Professor found:", prof);
		    	if (!passwordHash.verify(password, prof.password)) {
		    		return res.send(400, { error: "Password doesn't match Error" });
		    	} else {
						var profJSON = JSON.stringify(prof);
						res.send(profJSON);
					}
			  }
			});
		} else {
			Professor.findOne({
	  		email: email
			}).done(function(err, prof) {

	  		// Error handling
	  		if (err) {
			    console.log(err);
			    return res.send(500, { error: "Professor Find Error" });

			  // No Professor found
			  } else if (!prof) {
			    return res.send(404, { error: "No Professor Found Error" });

			  // Found Professor!
			  } else {
		    	console.log("Professor found:", prof);
		    	if (!passwordHash.verify(password, prof.password)) {
		    		return res.send(400, { error: "Password doesn't match Error" });
		    	} else {
						var profJSON = JSON.stringify(prof);
						res.send(profJSON);
					}
			  }
			});
		}
	}

};
