/**
 * CourseController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

	destroy: function(req, res) {
		res.contentType('application/json');
		var id = req.param('id');

		Course.findOneById(id).done(function(err, cos) {

			if (err) {
				console.log(err);
				res.send(500, { error: "Course Find Error" });
				return;
			} 

			if (!cos) {
				console.log('No Course Found (id : ' + id + ')');
				res.send(404, { error: "No Course Found Error" });
				return;
			}

			cos.destroy(function(err) {

				if (err) {
					console.log(err);
					res.send(500, { error: "Course Destroy Error" });
					return;
				}

				console.log("Course has been destroyed (id : " + id + ')');
				var cosJSON = JSON.stringify(cos);
				res.send(cosJSON);
				
			});
			return;
		});
	}

};
