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


		Courses.findOneById(course_id).exec(function callback(err, course) {
			if (err || !course)
			    return res.send(500, Error.log(req, "Start Clicker Error", "Course doesn't exist."));

			if (!course.opened)
			    return res.send(500, Error.alert(req, "Start Clicker Error", "Current course is closed."));

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
							.populate('setting')
				  		.sort('id DESC')
				  		.exec(function callback(err, users) {
				  			for (var j = 0; j < users.length; j++)
				  				if (users[j].setting && users[j].setting.clicker)
					  				Noti.send(users[j], post.course.name, "Clicker has been started", "clicker_started", course.id);
				  		});

				  		setTimeout(function() { Noti.resendClicker(post.clicker.id); }, 33000);

					  	return res.send(post.toWholeObject());
				  	});
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
		var type = req.param('type');
		if (!type) type = 'auto';

		Courses.findOneById(course_id).exec(function callback(err, course) {
			if (err || !course)
			    return res.send(500, Error.log(req, "Start Attendance Error", "Course doesn't exist."));

			if (!course.opened)
			    return res.send(500, Error.alert(req, "Start Attendance Error", "Current course is closed."));

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
				  type: 'attendance',
				  attendance_type: type
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

				  		if (type == 'auto') {}
						  	// Send notification about post to Prof & Std
						  	var notiUsers = new Array();
						  	for (var i = 0; i < course.students.length; i++)
						  		notiUsers.push(course.students[i].id);
						  	for (var i = 0; i < course.managers.length; i++)
						  		notiUsers.push(course.managers[i].id);
						  	
					  		Users
					  		.findById(notiUsers)
								.populate('device')
								.populate('setting')
					  		.sort('id DESC')
					  		.exec(function callback(err, users) {
					  			for (var j = 0; j < users.length; j++)
					  				if (users[j].setting && users[j].setting.attendance)
						  				Noti.send(users[j], post.course.name, "Attendance check has been started", "attendance_started", course.id);
					  		});

					  		setTimeout(function() { Noti.resendAttedance(post.attendance.id); }, 33000);
				  		}

					  	return res.send(post.toWholeObject());
				  	});
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

		Courses.findOneById(course_id).exec(function callback(err, course) {
			if (err || !course)
			    return res.send(500, Error.log(req, "Start Notice Error", "Course doesn't exist."));

			if (!course.opened)
			    return res.send(500, Error.alert(req, "Start Notice Error", "Current course is closed."));

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
							.populate('setting')
				  		.sort('id DESC')
				  		.exec(function callback(err, users) {
				  			for (var j = 0; j < users.length; j++)
				  				if (users[j].setting && users[j].setting.notice)
					  				Noti.send(users[j], post.course.name, "You have new notice.", "notice", course.id);
				  		});

					  	return res.send(post.toWholeObject());
			    	});
				  });
		  	});
			});
		});
	},

	update_message: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var post_id = req.param('post_id');
		var message = req.param('message');

		if (!message)
			return res.send(500, Error.alert(req, "Update Post Error", "Please write any message."));

		Posts
		.findOneById(post_id)
		.exec(function callback(err, post) {
			if (err || !post)
  			return res.send(500, Error.log(req, "Update Post Error", "Post doesn't exist."));

    	Courses
    	.findOneById(post.course)
    	.exec(function callback(err, course) {
				if (err || !course)
	  			return res.send(500, Error.log(req, "Update Post Error", "Course doesn't exist."));

				if (!course.opened)
				    return res.send(500, Error.alert(req, "Update Post Error", "Current course is closed."));

				post.message = message;
	    	post.save(function callback(err) {
	    		if (err)
		  			return res.send(500, Error.alert(req, "Update Post Error", "Fail to update post."));

					Posts
					.findOneById(post_id)
					.populateAll()
					.exec(function callback(err, post) {
						if (err || !post)
			  			return res.send(500, Error.log(req, "Update Post Error", "Post doesn't exist."));

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
    	.populate('posts')
    	.exec(function callback(err, course) {
				if (err || !course)
	  			return res.send(500, Error.log(req, "Delete Post Error", "Course doesn't exist."));

				if (!course.opened)
				    return res.send(500, Error.alert(req, "Delete Post Error", "Current course is closed."));

	    	course.posts.remove(post_id);
	    	course.save(function callback(err) {
	    		if (err)
		  			return res.send(500, Error.alert(req, "Delete Post Error", "Fail to update course."));

					Posts
					.findOneById(post_id)
					.populateAll()
					.exec(function callback(err, post) {
						if (err || !post)
			  			return res.send(500, Error.log(req, "Delete Post Error", "Post doesn't exist."));

	    			return res.send(post.toWholeObject());
			  	});
	    	});
    	});
		});
	}
};
