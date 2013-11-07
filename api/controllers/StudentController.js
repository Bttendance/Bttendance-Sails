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
			Student.find({
	  		username: username
			}).limit(10).sort('username ASC').done(function(err, std) {

	  		// Error handling
	  		if (err) {
	  			console.log(err)
			    return res.send(500, { error: "Student Find Error" });;

			  // Found multiple students!
			  } else {
			    if (std.length == 0) {
			    	return res.send(500, { error: "No Student Found Error" });
			    } else if (std.length > 1) {
			    	return res.send(500, { error: "Multiple Student Found Error" });
			  	// Found one student!
			    } else {
			    	console.log("Student found:", std[0]);
			    	if (!passwordHash.verify(password, std[0].password)) {
			    		return res.send(400, { error: "Password doesn't match Error" });
			    	} else {
							var stdJSON = JSON.stringify(std[0]);
							res.send(stdJSON);
						}
			    }
			  }
			});
		} else {
			Student.find({
	  		email: email
			}).limit(10).sort('email ASC').done(function(err, std) {

	  		// Error handling
	  		if (err) {
					console.log(err);
			    return res.send(500, { error: "Student Find Error" });

			  // Found multiple students!
			  } else {
			    if (std.length == 0) {
			    	return res.send(500, { error: "No Student Found Error" });
			    } else if (std.length > 1) {
			    	return res.send(500, { error: "Multiple Student Found Error" });
			  	// Found one student!
			    } else {
			    	console.log("Student found:", std[0]);
			    	if (!passwordHash.verify(password, std[0].password)) {
			    		return res.send(400, { error: "Password doesn't match Error" });
			    	} else {
							var stdJSON = JSON.stringify(std[0]);
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

		Student.findOneById(id).done(function(err, std) {

			if (err) {
				console.log(err);
				return res.send(500, { error: "Student Find Error" });
			} 

			if (!std) {
				console.log('No Student Found (id : ' + id + ')');
				return res.send(404, { error: "No Student Found Error" });
			}

			std.destroy(function(err) {

				if (err) {
					console.log(err);
					return res.send(500, { error: "Student Destroy Error" });
				}

				console.log("Student has been destroyed (id : " + id + ')');
				var stdJSON = JSON.stringify(std);
				res.send(stdJSON);
				
			});
		});
	}

};
