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

var Error = require('../utils/errors');
var Noti = require('../utils/notifications');

module.exports = {

	start_clicker: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var username = req.param('username');
		var course_id = req.param('course_id');
		var message = req.param('message');
		var choice_count = req.param('choice_count');

		Users
		.findOne({
		  or : [
		    { email: email },
		    { username: username }
		  ]
		})
		.exec(function callback(err, user) {
			if(err || !user)
  			return res.send(500, Error.log(req, "Start Clicker Error", "User doesn't exist."));

			Posts
			.create({
			  author: user.id,
			  course: course_id,
			  message: message,
			  type: 'clicker',
			  choice_count: choice_count
			}).exec(function callback(err, post) {
				if (err || !post)
	  			return res.send(500, Error.alert(req, "Start Clicker Error", "Fail to create a post."));

	    	Posts
	    	.findOneById(post.id)
	    	.populateAll()
	  		.exec(function callback(err, post) {
	  			if (err || !post)
		  			return res.send(500, Error.log(req, "Start Clicker Error", "Post doesn't exist."));

		    	Courses
		    	.findOneById(post.course.id)
		    	.populateAll()
			  	.exec(function callback(err, course) {
		    		if (err || !course)
			  			return res.send(500, Error.log(req, "Start Clicker Error", "Course doesn't exist."));

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

			  		setTimeout(function() { Noti.resendClicker(post.clicker.id); }, 30000);

				  	return res.send(post.toWholeObject());
			  	});
				});
			});
		});
	},

	start_attendance: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var username = req.param('username');
		var course_id = req.param('course_id');

		Users
		.findOne({
		  or : [
		    { email: email },
		    { username: username }
		  ]
		})
		.exec(function callback(err, user) {
			if(err || !user)
  			return res.send(500, Error.log(req, "Start Attendance Error", "User doesn't exist."));

			Posts
			.create({
			  author: user.id,
			  course: course_id,
			  type: 'attendance'
			}).exec(function callback(err, post) {
				if (err || !post)
	  			return res.send(500, Error.alert(req, "Start Attendance Error", "Fail to create a post."));

	    	Posts
	    	.findOneById(post.id)
	    	.populateAll()
	  		.exec(function callback(err, post) {
	  			if (err || !post)
		  			return res.send(500, Error.log(req, "Start Attendance Error", "Post doesn't exist."));

		    	Courses
		    	.findOneById(post.course.id)
		    	.populateAll()
			  	.exec(function callback(err, course) {
		    		if (err || !course)
			  			return res.send(500, Error.log(req, "Start Attendance Error", "Course doesn't exist."));

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

			  		setTimeout(function() { Noti.resendAttedance(post.attendance.id); }, 40000);
			  		setTimeout(function() { Noti.resendAttedance(post.attendance.id); }, 75000);
			  		setTimeout(function() { Noti.resendAttedance(post.attendance.id); }, 120000);

				  	return res.send(post.toWholeObject());
			  	});
				});
			});
		});
	},

	create_notice: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var username = req.param('username');
		var course_id = req.param('course_id');
		var message = req.param('message');

		Users
		.findOne({
		  or : [
		    { email: email },
		    { username: username }
		  ]
		})
		.exec(function callback(err, user) {
			if (err || !user)
  			return res.send(500, Error.log(req, "Post Notice Error", "User doesn't exist."));

			Posts.create({
			  author: user.id,
			  course: course_id,
			  message: message,
			  type: 'notice'
			}).exec(function callback(err, post) {
				if (err || !post)
	  			return res.send(500, Error.alert(req, "Post Notice Error", "Fail to create a post."));

    		Posts
    		.findOneById(post.id)
	    	.populateAll()
	  		.exec(function callback(err, post) {
	  			if (err || !post)
		  			return res.send(500, Error.log(req, "Post Notice Error", "Post doesn't exist."));

		    	Courses
		    	.findOneById(post.course.id)
		    	.populateAll()
			  	.exec(function callback(err, course) {
		    		if (err || !course)
			  			return res.send(500, Error.log(req, "Post Notice Error", "Course doesn't exist."));

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
  			return res.send(500, Error.log(req, "Delete Post Error", "Post doesn't exist."));

    	Courses
    	.findOneById(post.course)
    	.populateAll()
    	.exec(function callback(err, course) {
				if (err || !course)
	  			return res.send(500, Error.log(req, "Delete Post Error", "Course doesn't exist."));

	    	course.posts.remove(post_id);
	    	course.save(function callback(err) {
	    		if (err)
		  			return res.send(500, Error.alert(req, "Delete Post Error", "Fail to update course."));

	    		Courses
	    		.findOneById(post.course)
	    		.populateAll()
	    		.exec(function callback(err, course) {
		    		if (err || !course)
			  			return res.send(500, Error.log(req, "Delete Post Error", "Course doesn't exist."));

	    			return res.send(course.toWholeObject());
	    		});
	    	});
    	});
		});
	}
};
