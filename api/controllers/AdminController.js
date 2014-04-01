/**
 * AdminController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

	show: function(req, res) {
		var password = req.param('password');
		var model = req.param('model');
		var id = req.param('id');

		if (password != 'bttendance') {
			res.contentType('html');
			return res.forbidden('Your password doesn\'t match.');
		}

		if ( isNaN(Number(id)) && id != 'all' ) {
			res.contentType('html');
			return res.forbidden('Check out your id parameter.');
		}

		if (model == 'users') {
			if (id == 'all')
				Users
				.find()
				.populate('device')
				.populate('supervising_courses')
				.populate('attending_courses')
				.populate('employed_schools')
				.populate('serials')
				.populate('enrolled_schools')
				.populate('identifications')
				.sort('id ASC')
				.exec(function callback (err, users) {
					if (err || !users) {
						res.contentType('html');
						return res.notFound(err);
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < users.length; i++)
							users[i] = users[i].toWholeObject();
				  	return res.send(users);
					}
				});
			else 
				Users
				.findOneById(Number(id))
				.populate('device')
				.populate('supervising_courses')
				.populate('attending_courses')
				.populate('employed_schools')
				.populate('serials')
				.populate('enrolled_schools')
				.populate('identifications')
				.exec(function callback (err, user) {
					if (err || !user) {
						res.contentType('html');
						return res.notFound(err);
					} else {
						res.contentType('application/json; charset=utf-8');
				  	return res.send(user.toWholeObject());
					}
				});
		} else if (model == 'schools') {
			if (id == 'all')
				Schools
				.find()
				.populate('serials')
				.populate('courses')
				.populate('professors')
				.populate('students')
				.sort('id ASC')
				.exec(function callback (err, schools) {
					if (err || !schools) {
						res.contentType('html');
						return res.notFound(err);
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < schools.length; i++)
							schools[i] = schools[i].toWholeObject();
				  	return res.send(schools);
					}
				});
			else 
				Schools
				.findOneById(Number(id))
				.populate('serials')
				.populate('courses')
				.populate('professors')
				.populate('students')
				.exec(function callback (err, school) {
					if (err || !school) {
						res.contentType('html');
						return res.notFound(err);
					} else {
						res.contentType('application/json; charset=utf-8');
				  	return res.send(school.toWholeObject());
					}
				});
		} else if (model == 'courses') {
			if (id == 'all')
				Courses
				.find()
				.populate('posts')
		  	.populate('managers')
		  	.populate('students')
		  	.populate('school')
				.sort('id ASC')
				.exec(function callback (err, courses) {
					if (err || !courses) {
						res.contentType('html');
						return res.notFound(err);
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < courses.length; i++)
							courses[i] = courses[i].toWholeObject();
				  	return res.send(courses);
					}
				});
			else 
				Courses
				.findOneById(Number(id))
				.populate('posts')
		  	.populate('managers')
		  	.populate('students')
		  	.populate('school')
				.exec(function callback (err, course) {
					if (err || !course) {
						res.contentType('html');
						return res.notFound(err);
					} else {
						res.contentType('application/json; charset=utf-8');
				  	return res.send(course.toWholeObject());
					}
				});
		} else if (model == 'posts') {
			if (id == 'all')
				Posts
				.find()
				.populate('author')
				.populate('course')
				.populate('attendance')
				.populate('clicker')
				.sort('id ASC')
				.exec(function callback (err, posts) {
					if (err || !posts) {
						res.contentType('html');
						return res.notFound(err);
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < posts.length; i++)
							posts[i] = posts[i].toWholeObject();
				  	return res.send(posts);
					}
				});
			else 
				Posts
				.findOneById(Number(id))
				.populate('author')
				.populate('course')
				.populate('attendance')
				.populate('clicker')
				.exec(function callback (err, post) {
					if (err || !post) {
						res.contentType('html');
						return res.notFound(err);
					} else {
						res.contentType('application/json; charset=utf-8');
				  	return res.send(post.toWholeObject());
					}
				});
		} else {
			res.contentType('html');
			return res.forbidden('Check out your model parameter.');
		}

	}
	
};
