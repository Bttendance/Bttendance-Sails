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
			Professor.find({
	  		username: username
			}).limit(10).sort('username ASC').done(function(err, prof) {

	  		// Error handling
	  		if (err) {
			    console.log(err);
			    return res.send(500, { error: "Professor Find Error" });

			  // Found multiple Professors!
			  } else {
			    if (prof.length == 0) {
			    	return res.send(500, { error: "No Professor Found Error" });
			    } else if (prof.length > 1) {
			    	return res.send(500, { error: "Multiple Professor Found Error" });
			  	// Found one Professor!
			    } else {
			    	console.log("Professor found:", prof[0]);
			    	if (!passwordHash.verify(password, prof[0].password)) {
			    		return res.send(400, { error: "Password doesn't match Error" });
			    	} else {
							var stdJSON = JSON.stringify(prof[0]);
							res.send(stdJSON);
						}
			    }
			  }
			});
		} else {
			Professor.find({
	  		email: email
			}).limit(10).sort('email ASC').done(function(err, prof) {

	  		// Error handling
	  		if (err) {
			    console.log(err);
			    return res.send(500, { error: "Professor Find Error" });

			  // Found multiple Professors!
			  } else {
			    if (prof.length == 0) {
			    	return res.send(500, { error: "No Professor Found Error" });
			    } else if (prof.length > 1) {
			    	return res.send(500, { error: "Multiple Professor Found Error" });
			  	// Found one Professor!
			    } else {
			    	console.log("Professor found:", prof[0]);
			    	if (!passwordHash.verify(password, prof[0].password)) {
			    		return res.send(400, { error: "Password doesn't match Error" });
			    	} else {
							var stdJSON = JSON.stringify(prof[0]);
							res.send(stdJSON);
						}
			    }
			  }
			});
		}
	},

	destroy: function(req, res) {
		res.contentType('application/json');
		var id = req.param('id');

		Professor.findOneById(id).done(function(err, prof) {

			if (err) {
				console.log(err);
				return res.send(500, { error: "Professor Find Error" });
			} 

			if (!prof) {
				console.log('No Professor Found (id : ' + id + ')');
				return res.send(404, { error: "No Professor Found Error" });
			}

			prof.destroy(function(err) {

				if (err) {
					console.log(err);
					return res.send(500, { error: "Professor Destroy Error" });
				}

				console.log("Professor has been destroyed (id : " + id + ')');
				var profJSON = JSON.stringify(prof);
				res.send(profJSON);
				
			});
		});
	}

};
