/**
 * SchoolsController
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

var Arrays = require('../utils/arrays');

module.exports = {
	
	all: function(req, res) {
		res.contentType('application/json; charset=utf-8');		

		Schools
		.find()
		.populate('serials')
		.populate('courses')
		.populate('professors')
		.populate('students')
		.exec(function callback(err, schools) {
			for (var i = 0; i < schools.length; i++)
				schools[i] = schools[i].toWholeObject();
	  	return res.send(schools);
		});
	},

	courses: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var school_id = req.param('school_id');

		if (!school_id) {
			console.log("SchoolController : courses : School Id is required");
			return res.send(400, { message: "School Id is required"});
		}

		Schools
		.findOneById(school_id)
		.populate('courses')
		.exec(function callback(err, school) {
			if (err || !school)
		    return res.send(500, { message: "School Find Error" });

		  var courses = new Array();
		  for (var i = 0; i < school.courses.length; i++)
		  	courses.push(school.courses[i].id);

  		Courses
  		.findById(courses)
			.populate('posts')
	  	.populate('managers')
	  	.populate('students')
	  	.populate('school')
  		.exec(function callback(err, courses) {
  			if (err || !courses)
	    		return res.send(JSON.stringify(new Array()));

				for (var i = 0; i < courses.length; i++)
					courses[i] = courses[i].toWholeObject();
		  	return res.send(courses);
  		});
		});
	},

	employ: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var school_id = req.param('school_id');
		var serial = req.param('serial');
		
		Users
		.findOneByUsername(username)
		.populate('device')
		.populate('supervising_courses')
		.populate('attending_courses')
		.populate('employed_schools')
		.populate('serials')
		.populate('enrolled_schools')
		.populate('identifications')
		.exec(function callback(err, user) {
			if (err || !user)
		    return res.send(404, { message: "No User Found Error" });

		  Serials.findOne({
		  	key: serial,
		  	school: school_id
		  }).exec(function callback(err, serial) {
		  	if (err || !serial)
		    	return res.send(404, { message: "No Serial Found Error" });

			  var employed_schools = Arrays.getIds(user.employed_schools);
			  if (employed_schools.indexOf(Number(school_id)) == -1)
			    user.employed_schools.add(school_id);

			  var serials = Arrays.getIds(user.serials);
			  if (serials.indexOf(Number(school_id)) == -1)
			    user.serials.add(serial.id);

				user.save(function callback(err) {
			    Users
					.findOneByUsername(username)
					.populate('device')
					.populate('supervising_courses')
					.populate('attending_courses')
					.populate('employed_schools')
					.populate('serials')
					.populate('enrolled_schools')
					.populate('identifications')
					.exec(function callback(err, user_new) {
						if (err || !user_new)
					    return res.send(404, { message: "No User Found Error" });

				  	return res.send(user_new.toWholeObject());
					});
				});
		  });
		});
	},
	
	enroll: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var school_id = req.param('school_id');
		var student_id = req.param('student_id');

		Users
		.findOneByUsername(username)
		.populate('device')
		.populate('supervising_courses')
		.populate('attending_courses')
		.populate('employed_schools')
		.populate('serials')
		.populate('enrolled_schools')
		.populate('identifications')
		.exec(function callback(err, user) {
			if (err || !user)
		    return res.send(404, { message: "No User Found Error" });

		  var enrolled_schools = Arrays.getIds(user.enrolled_schools);
		  if (enrolled_schools.indexOf(Number(school_id)) != -1)
		  	return res.send(user.toWholeObject());

		  Schools.findOneById(school_id).exec(function callback(err, school) {
		  	if (err || !school)
		    	return res.send(404, { message: "No School Found Error" });

				Identifications.create({
					identity: student_id,
					owner: user.id,
					school: school.id
				}).exec(function callback(err, identification) {
			  	if (err || !school)
			    	return res.send(404, { message: "Identity Generate Error" });

			    user.enrolled_schools.add(school.id);
					user.save(function callback(err) {
				    Users
						.findOneByUsername(username)
						.populate('device')
						.populate('supervising_courses')
						.populate('attending_courses')
						.populate('employed_schools')
						.populate('serials')
						.populate('enrolled_schools')
						.populate('identifications')
						.exec(function callback(err, user_new) {
							if (err || !user_new)
						    return res.send(404, { message: "No User Found Error" });

					  	return res.send(user_new.toWholeObject());
						});
					});
				});
		  });
		});
	}

};
