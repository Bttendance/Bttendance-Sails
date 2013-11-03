/**
 * SchoolController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

	destroy: function(req, res) {
		res.contentType('application/json');
		var id = req.param('id');

		School.findOneById(id).done(function(err, sch) {

			if (err) {
				console.log(err);
				res.send(500, { error: "School Find Error" });
				return;
			} 

			if (!sch) {
				console.log('No School Found (id : ' + id + ')');
				res.send(404, { error: "No School Found Error" });
				return;
			}

			sch.destroy(function(err) {

				if (err) {
					console.log(err);
					res.send(500, { error: "School Destroy Error" });
					return;
				}

				console.log("School has been destroyed (id : " + id + ')');
				var schJSON = JSON.stringify(sch);
				res.send(schJSON);
				
			});
			return;
		});
	}
  

};
