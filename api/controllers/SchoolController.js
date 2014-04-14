/**
 * SchoolController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

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
				schools[i] = schools[i].toOldObject();
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
					courses[i] = courses[i].toOldObject();
		  	return res.send(courses);
  		});
		});
	}
};