/**
 * ProfessorController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

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
