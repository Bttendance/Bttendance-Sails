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

var Noti = require('../utils/notifications');

module.exports = {

	start_attendance: function(req, res) {
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
			  type: 'attendance'
			}).exec(function callback(err, post) {
				if (err || !post)
	    		return res.send(500, { message: "Post Create Error" });

	    	Posts
	    	.findOneById(post.id)
	  		.populate('author')
	  		.populate('course')
	  		.populate('attendance')
	  		.populate('clicker')
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
				    		return res.send(404, { message: "Course Find Error" });

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
				  				Noti.send(users[j], post.course.name, "Attendance check has been started", "attendance_started");
				  		});

				  		setTimeout(function() { resendNotis(post.id); }, 40000);
				  		setTimeout(function() { resendNotis(post.id); }, 75000);
				  		setTimeout(function() { resendNotis(post.id); }, 120000);

					  	return res.send(course.toWholeObject());
				  	});
		    	});
				});
			});
		});
	},

	start_clicker: function(req, res) {
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
	  		.populate('clicker')
	  		.exec(function callback(err, post) {
	  			if (err || !post)
	  				return res.send(500, {message: "Post Find Error"});

		    	Courses
		    	.findOneById(post.course.id)
					.populate('posts')
			  	.populate('managers')
			  	.populate('students')
			  	.populate('school')
			  	.exec(function callback(err, course) {
		    		if (err || !course)
			    		return res.send(404, { message: "Course Find Error" });

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
			  				Noti.send(users[j], post.course.name, "Clicker has been started", "clicker_started");
			  		});

			  		setTimeout(function() { resendNotis(post.id); }, 40000);
			  		setTimeout(function() { resendNotis(post.id); }, 75000);
			  		setTimeout(function() { resendNotis(post.id); }, 120000);

				  	return res.send(course.toWholeObject());
			  	});
				});
			});
		});
	},

	create_notice: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var course_id = req.param('course_id');
		var message = req.param('message');

		Users
		.findOneByUsername(username)
		.exec(function callback(err, user) {
			if (err || !user)
    		return res.send(404, { message: "User Found Error" });

			Posts.create({
			  author: user.id,
			  course: course_id,
			  message: message,
			  type: 'notice'
			}).exec(function callback(err, post) {
				if (err || !post)
    			return res.send(404, { message: "Post Found Error" });

    		Posts
    		.findOneById(post.id)
	  		.populate('author')
	  		.populate('course')
	  		.populate('attendance')
	  		.populate('clicker')
	  		.exec(function callback(err, post) {
	  			if (err || !post)
	  				return res.send(404, {message: "Post Found Error"});

		    	Courses
		    	.findOneById(post.course.id)
					.populate('posts')
			  	.populate('managers')
			  	.populate('students')
			  	.populate('school')
			  	.exec(function callback(err, course) {
		    		if (err || !course)
			    		return res.send(404, { message: "Course Find Error" });

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
			  				Noti.send(users[j], post.course.name, message, "notice");
			  		});

				  	return res.send(post.toWholeObject());
		    	});
			  });
	  	});
		});
	},

	remove: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var post_id = req.param('post_id');

		Posts
		.findOneById(post_id)
		.exec(function callback(err, post) {
			if (err || !post)
    		return res.send(404, { message: "No Post Found Error" });

    	Courses
    	.findOneById(post.course)
    	.populate('posts')
	  	.populate('managers')
	  	.populate('students')
	  	.populate('school')
    	.exec(function callback(err, course) {
				if (err || !course)
	    		return res.send(404, { message: "No Course Found Error" });

	    	course.posts.remove(post_id);
	    	course.save(function callback(err) {
	    		if (err)
	    			return res.send(404, { message: "Course Save Error" });
	    		else
	    			return res.send(course.toWholeObject());
	    	});
    	});
		});
	}
};


var resendNotis = function(post_id) {

	Posts
	.findOneById(post_id)
	.populate('author')
	.populate('course')
	.populate('attendance')
	.exec(function callback(err, post) {
		if (err || !post)
			return;

		Courses
		.findOneById(post.course)
		.populate('posts')
  	.populate('managers')
  	.populate('students')
  	.populate('school')
		.exec(function callback(err, course) {
			if (err || !course)
				return;

			var unchecked = new Array();
			for (var i = 0; i < course.students.length; i++)
				unchecked.push(course.students[i]);

			for (var i = 0; i < post.attendance.checked_students.length; i++) {
				var index = unchecked.indexOf(post.attendance.checked_students[i]);
				if (index > -1)
					unchecked.splice(index, 1);
			}
								  	
			console.log(unchecked);

  		Users
  		.findById(unchecked)
  		.populate('device')
  		.sort('id DESC').exec(function(err, users) {
  			if (err || !users)
  				return;
  			
  			for (var i = 0; i < users.length; i++)
  				sendNotification(users[i], course, post, "Attendance has been started", "attendance_started");
  		});
		});
	});
}
