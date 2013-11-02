/**
 * UserController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

	destroy: function(req, res) {
		res.contentType('application/json');

		User.findOneById(req.param('id')).done(function(err, user) {
			if (err) {
				console.log(err);
				res.send(500, { error: "User Find Error" });
			} else if (!user) {
				console.log('No User Found (id : ' + req.param('id') + ')');
				res.send(404, { error: "No User Found Error" });
			} else {
				user.destroy(function(err) {
					if (err) {
						console.log(err);
						res.send(500, { error: "User Destroy Error" });
					} else {
						console.log("User has been destroyed (id : " + req.param('id') + ')');
						var userJSON = JSON.stringify(user);
						res.send(userJSON);
					}
				});
			}
			return;
		});
	}

};
