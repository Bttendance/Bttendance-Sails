/**
 * SchoolController
 *
 * @module      :: Controller
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

var Error = require('../utils/errors');
var Arrays = require('../utils/arrays');

module.exports = {
	
	create: function(req, res) {
		res.contentType('application/json; charset=utf-8');		
		var name = req.param('name');
		var type = req.param('type');

		if (!name)
			return res.send(400, Error.alert(req, "School Create Error", "School name is required."));

		if (!type)
			return res.send(400, Error.alert(req, "School Create Error", "School type is required."));

		School
		.create({
			name: name,
			type: type	
		})
		.exec(function callback(err, school) {
			if (err || !school)
				return res.send(500, Error.alert(req, "School Create Error", "Fail to create a school."));

			School
			.findOneById(school.id)
			.populate('courses')
			.populate('professors')
			.populate('students')
			.exec(function callback(err, school) {
		  	return res.send(school.toWholeObject());
			});
		});
	},
	
	all: function(req, res) {
		res.contentType('application/json; charset=utf-8');		

		School
		.find()
		.populate('courses')
		.populate('professors')
		.populate('students')
		.exec(function callback(err, schools) {
			for (var i = 0; i < schools.length; i++) {
				schools[i] = schools[i].toWholeObject();
				// Will be Deprecated
				schools[i].website = schools[i].courses_count + '_Courses';
			}
	  	return res.send(schools);
		});
	},

	courses: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var school_id = req.param('school_id');

		if (!school_id)
			return res.send(400, Error.log(req, "Show All Courses Error", "School id is required."));

		School
		.findOneById(school_id)
		.populate('courses')
		.exec(function callback(err, school) {
			if (err || !school)
				return res.send(500, Error.log(req, "Show All Courses Error", "School doesn't exist."));

		  var courses = new Array();
		  for (var i = 0; i < school.courses.length; i++)
		  	courses.push(school.courses[i].id);

  		Course
  		.findById(courses)
  		.populateAll()
  		.exec(function callback(err, courses) {
  			if (err || !courses)
	    		return res.send(JSON.stringify(new Array()));

				for (var i = 0; i < courses.length; i++)
					courses[i] = courses[i].toWholeObject();
		  	return res.send(courses);
  		});
		});
	},
	
	enroll: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var username = req.param('username');
		var school_id = req.param('school_id');
		var identity = req.param('identity');
		if (!identity)
			identity  = req.param('student_id');

		User
		.findOne({
		  or : [
		    { email: email },
		    { username: username }
		  ]
		})
		.populateAll()
		.exec(function callback(err, user) {
			if (err || !user)
				return res.send(500, Error.log(req, "Enroll School Error", "User Find Error"));

		  var enrolled_schools = Arrays.getIds(user.enrolled_schools);
		  if (enrolled_schools.indexOf(Number(school_id)) != -1)
		  	return res.send(user.toWholeObject());

		  School.findOneById(school_id).exec(function callback(err, school) {
		  	if (err || !school)
					return res.send(500, Error.log(req, "Enroll School Error", "School Find Error"));

				Identification.create({
					identity: identity,
					school: school.id,
					owner: user.id
				}).exec(function callback(err, identification) {
			  	if (err || !identification)
						return res.send(500, Error.log(req, "Enroll School Error", "Fail to create identity."));

					user.identifications.add(identification.id);
			    user.enrolled_schools.add(school.id);
					user.save(function callback(err) {
						if (err)
							return res.send(500, Error.log(req, "Enroll School Error", "Fail to save user."));

				    User
						.findOne({
						  or : [
						    { email: email },
						    { username: username }
						  ]
						})
						.populateAll()
						.exec(function callback(err, user_new) {
							if (err || !user_new)
								return res.send(500, Error.log(req, "Enroll School Error", "User Find Error"));

					  	return res.send(user_new.toWholeObject());
						});
					});
				});
		  });
		});
	}

};
