/**
 * StudentController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

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
