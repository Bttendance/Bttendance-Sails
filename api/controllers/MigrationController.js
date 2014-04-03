/**
 * MigrationController
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

	migrate: function(req, res) {

		User.find().sort('id ASC').exec(function callback(err, users) {
			if (err || !users)
				return;

			//done
			for (var index = 1; index <= users[users.length - 1].id; index++) {
				var i = 0;
				while (++i < users.length && users[i].id <= index);
				i--;

				Users.create({
					id: users[i].id,
					username: users[i].username,
					password: users[i].password,
					email: users[i].email,
					full_name: users[i].full_name,
					profile_image : users[i].profile_image,
					createdAt: users[i].createdAt,
					updatedAt: users[i].updatedAt					
				}).exec(function callback(err, user) {
					console.log(user);
				});
			}

			//done
			for (var index = 1; index <= users[users.length - 1].id; index++) {
				var i = 0;
				while (++i < users.length && users[i].id <= index);
				i--;

				Devices.create({
					id: users[i].id,
					type: users[i].device_type,
					uuid: users[i].device_uuid,
					notification_key: users[i].notification_key,
					createdAt: users[i].createdAt,
					updatedAt: users[i].updatedAt
				}).exec(function callback(err, device) {
					console.log(device);
				});
			}
		});

		//done
		School.find().sort('id ASC').exec(function callback(err, schools) {
			if (err || !schools)
				return;

			for (var index = 1; index <= schools[schools.length - 1].id; index++) {
				var i = 0;
				while (++i < schools.length && schools[i].id <= index);
				i--;

				Schools.create({
					id: schools[i].id,
					name: schools[i].name,
					logo_image: schools[i].logo_image,
					website: schools[i].website,
					type: schools[i].type,
					createdAt: schools[i].createdAt,
					updatedAt: schools[i].updatedAt
				}).exec(function callback(err, school) {
					console.log(school);
				});
			}
		});

		//done
		Serial.find().sort('id ASC').exec(function callback(err, serials) {
			if (err || !serials)
				return;

			for (var index = 1; index <= serials[serials.length - 1].id; index++) {
				var i = 0;
				while (++i < serials.length && serials[i].id <= index);
				i--;

				Serials.create({
					id: serials[i].id,
					key: serials[i].key,
					createdAt: serials[i].createdAt,
					updatedAt: serials[i].updatedAt
				}).exec(function callback(err, serial) {
					console.log(serial);
				});
			}
		});

		//done
		Course.find().sort('id ASC').exec(function callback(err, courses) {
			if (err || !courses)
				return;

			for (var index = 1; index <= courses[courses.length - 1].id; index++) {
				var i = 0;
				while (++i < courses.length && courses[i].id <= index);
				i--;

				Courses.create({
					id: courses[i].id,
					name: courses[i].name,
					number: courses[i].number,
					professor_name: courses[i].professor_name,
					attdCheckedAt: courses[i].attdCheckedAt,
					createdAt: courses[i].createdAt,
					updatedAt: courses[i].updatedAt
				}).exec(function callback(err, course) {
					console.log(course);
				});
			}
		});

		//done
		Post.find().sort('id ASC').exec(function callback(err, posts) {
			if (err || !posts)
				return;

			for (var index = 1; index <= posts[posts.length - 1].id; index++) {
				var i = 0;
				while (++i < posts.length && posts[i].id <= index);
				i--;

				Posts.create({
					id: posts[i].id,
					type: posts[i].type,
					message: posts[i].message,
					createdAt: posts[i].createdAt,
					updatedAt: posts[i].updatedAt
				}).exec(function callback(err, post) {
					console.log(post);
				});
			}
		});

		//done
		User.find().sort('id ASC').exec(function callback(err, users) {
			if (err || !users)
				return;

			for (var i = 0; i < users.length; i++) {
				var enrolled_schools = users[i].enrolled_schools;
				for (var j = 0; j < enrolled_schools.length; j++) {
					Identifications.create({
						identity: enrolled_schools[j].key,
						owner: users[i].id,
						school: enrolled_schools[j].id
					}).exec(function callback(err, identification) {
						console.log(identification);
					});
				} 
			}
		});

		//done
		Post.find().sort('id ASC').exec(function callback(err, posts) {
			if (err || !posts)
				return;

			for (var i = 0; i < posts.length; i++) {
				if (posts[i].type == 'attendance') {
					Attendances.create({
						checked_students: posts[i].checks,
						clusters: posts[i].clusters,
						post: posts[i].id,
						createdAt: posts[i].createdAt,
						updatedAt: posts[i].updatedAt
					}).exec(function callback(err, attendance) {
						console.log(attendance); 
					});
				}
			}
		});
	},

	associate: function(req, res) {

		//User-Password
		User.find().exec(function callback(err, users) {
			if (err || !users)
				return;

			async.eachSeries(users, function (each_user, done) {
				Users.findOne(each_user.id).exec(function callback(err, user) {
					if (err || !user)
						return done(err);
					user.password = each_user.password;
					user.save(function callback(err) {
						if (err) 
							done(console.log(err));
						done();
					});
				});
			}, function (err) {
				if (err == null)
					console.log('User-Password finished');
				else
					console.log(err);
			});
		});

		//User-Device
		User.find().exec(function callback(err, users) {
			if (err || !users)
				return;

			for (var i = 0; i < users.length; i++) {
				Users.findOne(users[i].id).exec(function callback(err, user) {
					if (err || !user)
						return;

					Users.update({ id: user.id }, { device: user.id }).exec(function callback(err, updated_user) {
						if (err || !updated_user)
							return console.log(err);
						console.log(updated_user);
					});

					Devices.update({ id: user.id }, { owner: user.id }).exec(function callback(err, updated_device) {
						if (err || !updated_device)
							return console.log(err);
						console.log(updated_device);
					});
				});
			}
		});

		//User-SuvpCourse
		User.find().exec(function callback(err, users) {
			if (err || !users)
				return;

			async.eachSeries(users, function (each_user, done) {
				var supervising_courses = each_user.supervising_courses;
				if (supervising_courses.length > 0) {
					Users.findOne(each_user.id).exec(function callback(err, user) {
						if (err || !user)
							return done(err);

						Courses.findById(supervising_courses).exec(function callback(err, courses) {
							if (err || !courses)
								return done(err);

							for (var i = 0; i < courses.length; i++)
								user.supervising_courses.add(courses[i].id);

							user.save(function callback(err) {
								if (err) 
									done(console.log(err));
								done();
							});
						});
					});
				} else
					done();
			}, function (err) {
				if (err == null)
					console.log('User-SuvpCourse finished');
				else
					console.log(err);
			});
		});

		//User-AttdCourse
		User.find().exec(function callback(err, users) {
			if (err || !users)
				return;

			async.eachSeries(users, function (each_user, done) {
				var attending_courses = each_user.attending_courses;
				if (attending_courses.length > 0) {
					Users.findOne(each_user.id).exec(function callback(err, user) {
						if (err || !user)
							return done(err);

						Courses.findById(attending_courses).exec(function callback(err, courses) {
							if (err || !courses)
								return done(err);

							for (var i = 0; i < courses.length; i++)
								user.attending_courses.add(courses[i].id);

							user.save(function callback(err) {
								if (err)
									done(console.log(err));
								done();
							});
						});
					});
				} else
					done();
			}, function (err) {
				if (err == null)
					console.log('User-AttdCourse finished');
				else
					console.log(err);
			});
		});

		//User-EmpySchool & Serials
		User.find().exec(function callback(err, users) {
			if (err || !users)
				return;

			async.eachSeries(users, function (each_user, done) {
				var employed_schools = each_user.employed_schools;
				if (employed_schools.length > 0) {
					Users.findOne(each_user.id).exec(function callback(err, user) {
						if (err || !user)
							return done(err);

						var school_array = new Array();
						var serial_array = new Array();
						for (var i = 0; i < employed_schools.length; i++) {
							school_array.push(employed_schools[i].id);
							serial_array.push(employed_schools[i].key);
						}


						Schools.findById(school_array).exec(function callback(err, schools) {
							if (err || !schools)
								return done(err);

							for (var i = 0; i < schools.length; i++)
								user.employed_schools.add(schools[i].id);

							Serials.findOneByKey(serial_array[0]).exec(function callback(err, serial) {
								if (err || !serial)
									return done(err);
								user.serials.add(serial.id);
								
								user.save(function callback(err) {
									if (err)
										done(console.log(err));
									done();
								});
							});
						});
					});
				} else
					done();
			}, function (err) {
				if (err == null)
					console.log('User-EmpySchool & Serials finished');
				else
					console.log(err);
			});
		});

		//User-EnrlSchool
		User.find().exec(function callback(err, users) {
			if (err || !users)
				return;

			async.eachSeries(users, function (each_user, done) {
				var enrolled_schools = each_user.enrolled_schools;
				if (enrolled_schools.length > 0) {
					Users.findOne(each_user.id).exec(function callback(err, user) {
						if (err || !user)
							return done(err);

						var array = new Array();
						for (var i = 0; i < enrolled_schools.length; i++)
							array.push(enrolled_schools[i].id);

						Schools.findById(array).exec(function callback(err, schools) {
							if (err || !schools)
								return done(err);

							for (var i = 0; i < schools.length; i++)
								user.enrolled_schools.add(schools[i].id);

							user.save(function callback(err) {
								if (err)
									done(console.log(err));
								done();
							});
						});
					});
				} else
					done();
			}, function (err) {
				if (err == null)
					console.log('User-EnrlSchool finished');
				else
					console.log(err);
			});
		});

		//School-Serials (Done)
		School.find().exec(function callback(err, schools) {
			if (err || !schools)
				return;

			async.eachSeries(schools, function (each_school, done) {
				var serials = each_school.serials;
				if (serials.length > 0) {
					Schools.findOne(each_school.id).exec(function callback(err, school) {
						if (err || !school)
							return done(err);

						Serials.findById(serials).exec(function callback(err, serials) {
							if (err || !serials)
								return done(err);

							for (var i = 0; i < serials.length; i++)
								school.serials.add(serials[i].id);

							school.save(function callback(err) {
								if (err)
									return done(err);
								done();
							});
						});
					});
				} else
					done();
			}, function (err) {
				if (err == null)
					console.log('School-Serials finished');
				else
					console.log(err);
			});
		});

		//School-Course (Done)
		School.find().exec(function callback(err, schools) {
			if (err || !schools)
				return;

			async.eachSeries(schools, function (each_school, done) {
				var courses = each_school.courses;
				if (courses.length > 0) {
					Schools.findOne(each_school.id).exec(function callback(err, school) {
						if (err || !school)
							return done(err);

						Courses.findById(courses).exec(function callback(err, courses) {
							if (err || !courses)
								return done(err);

							for (var i = 0; i < courses.length; i++)
								school.courses.add(courses[i].id);

							school.save(function callback(err) {
								if (err)
									return done(err);
								done();
							});
						});
					});
				} else
					done();
			}, function (err) {
				if (err == null)
					console.log('School-Course finished');
				else
					console.log(err);
			});
		});

		//Course-Posts (Done)
		Course.find().exec(function callback(err, courses) {
			if (err || !courses)
				return;

			async.eachSeries(courses, function (each_course, done) {
				var posts = each_course.posts;
				if (posts.length > 0) {
					Courses.findOne(each_course.id).exec(function callback(err, course) {
						if (err || !course)
							return done(err);

						Posts.findById(posts).exec(function callback(err, posts) {
							if (err || !posts)
								return done(err);

							for (var i = 0; i < posts.length; i++)
								course.posts.add(posts[i].id);

							course.save(function callback(err) {
								if (err)
									return done(err);
								done();
							});
						});
					});
				} else
					done();
			}, function (err) {
				if (err == null)
					console.log('Course-Posts finished');
				else
					console.log(err);
			});
		});

		//Post-Author (Done)
		Post.find().exec(function callback(err, posts) {
			if (err || !posts)
				return;

			async.eachSeries(posts, function (each_post, done) {
				Posts.findOne(each_post.id).exec(function callback(err, post) {
					if (err || !post)
						return done(err);

					Posts.update({ id: post.id }, { author: each_post.author }).exec(function callback(err, updated_post) {
						if (err || !updated_post)
							return done(err);
						done();
					});
				});
			}, function (err) {
				if (err == null)
					console.log('Post-Author finished');
				else
					console.log(err);
			});
		});

		//Post-Attendance (Done)
		Attendances.find().exec(function callback(err, attendances) {
			if (err || !attendances)
				return;

			async.eachSeries(attendances, function (each_attendance, done) {
				Posts.findOne(each_attendance.post).exec(function callback(err, post) {
					if (err || !post)
						return done(err);

					Posts.update({ id: post.id }, { attendance: each_attendance.id }).exec(function callback(err, updated_post) {
						if (err || !updated_post)
							return done(err);
						done();
					});
				});
			}, function (err) {
				if (err == null)
					console.log('Post-Attendance finished');
				else
					console.log(err);
			});
		});
	}
};