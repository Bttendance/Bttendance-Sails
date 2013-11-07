/**
 * StudentController
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
			console.log("StudentController : signin : Username or Email is required");
			res.send(400, { error: "Username or Email is required"});
			return;
		}

		if (!password) {
			console.log("StudentController : signin : Password is required");
			res.send(400, { error: "Password is required"});
			return;
		}

		if (username) {
			Student.find({
	  		username: username,
	  		password: password
			}).limit(10).sort('username ASC').done(function(err, std) {

	  		// Error handling
	  		if (err) {
					res.send(500, { error: "Student Find Error" });
			    return console.log(err);

			  // Found multiple students!
			  } else {
			    if (std.length == 0) {
						res.send(500, { error: "No Student Found Error" });
			    	return;
			    } else if (std.length > 1) {
						res.send(500, { error: "Multiple Student Found Error" });
			    	return;
			  	// Found one student!
			    } else {
			    	console.log("Student found:", std[0]);
						var stdJSON = JSON.stringify(std[0]);
						res.send(stdJSON);
						return;
			    }
			  }
			});
		} else {
			Student.find({
	  		email: email,
	  		password: password
			}).limit(10).sort('email ASC').done(function(err, std) {

	  		// Error handling
	  		if (err) {
					res.send(500, { error: "Student Find Error" });
			    return console.log(err);

			  // Found multiple students!
			  } else {
			    if (std.length == 0) {
						res.send(500, { error: "No Student Found Error" });
			    	return;
			    } else if (std.length > 1) {
						res.send(500, { error: "Multiple Student Found Error" });
			    	return;
			  	// Found one student!
			    } else {
			    	console.log("Student found:", std[0]);
						var stdJSON = JSON.stringify(std[0]);
						res.send(stdJSON);
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

		Student.findOneById(id).done(function(err, std) {

			if (err) {
				console.log(err);
				res.send(500, { error: "Student Find Error" });
				return;
			} 

			if (!std) {
				console.log('No Student Found (id : ' + id + ')');
				res.send(404, { error: "No Student Found Error" });
				return;
			}

			std.destroy(function(err) {

				if (err) {
					console.log(err);
					res.send(500, { error: "Student Destroy Error" });
					return;
				}

				console.log("Student has been destroyed (id : " + id + ')');
				var stdJSON = JSON.stringify(std);
				res.send(stdJSON);
				
			});
			return;
		});
	}

};
