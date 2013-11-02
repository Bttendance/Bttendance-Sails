/**
 * UserController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

	destroy: function(req, res) {
		res.contentType('application/json');
		var id = req.param('id');

		User.findOneById(id).done(function(err, user) {

			if (err) {
				console.log(err);
				res.send(500, { error: "User Find Error" });
				return;
			} 

			if (!user) {
				console.log('No User Found (id : ' + id + ')');
				res.send(404, { error: "No User Found Error" });
				return;
			}

			user.destroy(function(err) {

				if (err) {
					console.log(err);
					res.send(500, { error: "User Destroy Error" });
					return;
				}

				console.log("User has been destroyed (id : " + id + ')');
				var userJSON = JSON.stringify(user);
				res.send(userJSON);
				
			});
			return;
		});
	}

};
