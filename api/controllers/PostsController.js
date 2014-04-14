/**
 * PostsController
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

module.exports = {

	clicker_start: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var course_id = req.param('course_id');

		Users
		.findOneByUsername(username)
		.exec(function callback(err, user) {
			if(err || !user)
    		return res.send(404, { message: "User Found Error" });

			Posts
			.create({
			  author: user.id,
			  course: course_id,
			  type: 'clicker'
			}).exec(function callback(err, post) {
				if (err || !post)
	    		return res.send(500, { message: "Post Create Error" });

	    	Posts
	    	.findOneById(post.id)
	  		.populate('author')
	  		.populate('course')
	  		.populate('attendance')
	  		.exec(function callback(err, post) {
	  			if (err || !post)
	  				return res.send(500, {message: "Post Find Error"});

		    	Courses
		    	.update({id: post.course.id}, {attdCheckedAt: JSON.parse(JSON.stringify(post.toWholeObject())).createdAt})
		    	.exec(function callback(err, courses) {
		    		if (err || !courses)
			    		return res.send(404, { message: "Course Update Error" });

			    	Courses
			    	.findOneById(courses[0].id)
						.populate('posts')
				  	.populate('managers')
				  	.populate('students')
				  	.populate('school')
				  	.exec(function callback(err, course) {
			    		if (err || !course)
				    		return res.send(404, { message: "Course Update Error" });

					  	// Send notification about post to Prof & Std
					  	var notiUsers = new Array();
					  	for (var i = 0; i < course.students.length; i++)
					  		notiUsers.push(course.students[i].id);
					  	for (var i = 0; i < course.managers.length; i++)
					  		notiUsers.push(course.managers[i].id);
					  	
				  		Users
				  		.findById(notiUsers)
							.populate('device')
				  		.sort('id DESC')
				  		.exec(function callback(err, users) {
				  			for (var j = 0; j < users.length; j++)
				  				sendNotification(users[j], course, post, "Attendance has been started", "attendance_started");
				  		});

				  		setTimeout(function() { resendNotis(post.id); }, 40000);
				  		setTimeout(function() { resendNotis(post.id); }, 75000);
				  		setTimeout(function() { resendNotis(post.id); }, 120000);

					  	return res.send(course.toOldObject());
				  	});
		    	});
				});
			});
		});
	}
	
};
