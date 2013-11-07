/**
 * ProfessorController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

	signin: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var email = req.param('email');
		var password = req.param('password');

		if (!username && !email) {
			console.log("ProfessorController : signin : Username or Email is required");
			res.send(400, { error: "Username or Email is required"});
			return;
		}

		if (!password) {
			console.log("ProfessorController : signin : Password is required");
			res.send(400, { error: "Password is required"});
			return;
		}

		if (username) {
			Professor.find({
	  		username: username,
	  		password: password
			}).limit(10).sort('username ASC').done(function(err, prof) {

	  		// Error handling
	  		if (err) {
					res.send(500, { error: "Professor Find Error" });
			    return console.log(err);

			  // Found multiple Professors!
			  } else {
			    if (prof.length == 0) {
						res.send(500, { error: "No Professor Found Error" });
			    	return;
			    } else if (prof.length > 1) {
						res.send(500, { error: "Multiple Professor Found Error" });
			    	return;
			  	// Found one Professor!
			    } else {
			    	console.log("Professor found:", prof[0]);
						var profJSON = JSON.stringify(prof[0]);
						res.send(profJSON);
						return;
			    }
			  }
			});
		} else {
			Professor.find({
	  		email: email,
	  		password: password
			}).limit(10).sort('email ASC').done(function(err, prof) {

	  		// Error handling
	  		if (err) {
					res.send(500, { error: "Professor Find Error" });
			    return console.log(err);

			  // Found multiple Professors!
			  } else {
			    if (prof.length == 0) {
						res.send(500, { error: "No Professor Found Error" });
			    	return;
			    } else if (prof.length > 1) {
						res.send(500, { error: "Multiple Professor Found Error" });
			    	return;
			  	// Found one Professor!
			    } else {
			    	console.log("Professor found:", prof[0]);
						var profJSON = JSON.stringify(prof[0]);
						res.send(profJSON);
						return;
			    }
			  }
			});
		}
		return;
	},

	destroy: function(req, res) {
		res.contentType('application/json');
		var id = req.param('id');

		Professor.findOneById(id).done(function(err, prof) {

			if (err) {
				console.log(err);
				res.send(500, { error: "Professor Find Error" });
				return;
			} 

			if (!prof) {
				console.log('No Professor Found (id : ' + id + ')');
				res.send(404, { error: "No Professor Found Error" });
				return;
			}

			prof.destroy(function(err) {

				if (err) {
					console.log(err);
					res.send(500, { error: "Professor Destroy Error" });
					return;
				}

				console.log("Professor has been destroyed (id : " + id + ')');
				var profJSON = JSON.stringify(prof);
				res.send(profJSON);
				
			});
			return;
		});
	}

};
