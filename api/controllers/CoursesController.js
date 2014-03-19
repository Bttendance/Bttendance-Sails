/**
 * CoursesController
 *
 * @module      :: CoursesController
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  create: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var name = req.param('name');
		var school_id = req.param('school_id');
		var professor_name = req.param('professor_name');

		Courses.create({
			name: name,
			school_id: school_id,
			professor_name: professor_name
		}).exec(function callback(err, course) {
			Users.findOne({
				username: username
			}).exec(function callback(err, user) {
				user.supervising_courses.add(course.id);
				user.save();
				var courseJSON = JSON.stringify(course);
		  	return res.send(courseJSON);
			})
		});
  }
};
