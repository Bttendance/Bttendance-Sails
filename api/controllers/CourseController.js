/**
 * CourseController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var MemJS = require('memjs').Client

var express = require('express');
var app = express.createServer(express.logger());
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

module.exports = {

	feed: function(req, res) {
		res.contentType('application/json');
		var course_id = req.param('course_id');
		var page = req.param('page');

		var cache_flag = "lastestfeeds_" + course_id

		var memjs = MemJS.create();

		Course.findOne(Number(course_id)).done(function(err, course) {
			if (err || !course) {
    		return res.send(404, { message: "No Course Found Error" });
			}

  		Post.find({
  			where: {
  				or: getConditionFromIDs(course.posts)
  			}
  		}).sort('id DESC').done(function(err, posts) {
  			if (err || !posts) {
  				return res.send(404, { message: "No Post Found Error" });
  			}

  			memjs.get(cache_flag, function(err, feeds) {//feed cached
					if(feeds){//if there is cached feed data, return cached data
						console.log("hit cache");
						return res.send(feeds);
					}
					else{
						//else, no data set yet
						console.log("miss!!");
						var postsObject = new Array();
						for (var index in posts)
							postsObject.push(posts[index]);
						var postsJSON = JSON.stringify(postsObject);
						console.log("set data in cache");
						memjs.set(cache_flag,postsJSON);
						console.log(postsJSON);
				  	return res.send(postsJSON);
					}
				})

		  	var postsObject = new Array();
				for (var index in posts)
					postsObject.push(posts[index]);
				var postsJSON = JSON.stringify(postsObject);
		  	return res.send(postsJSON);
  		});
		});
	},

	students: function(req, res) {
    res.contentType('application/json');
    var course_id = req.param('course_id');
   
    Course.findOne(Number(course_id)).done(function(err, course) {
      if (err || !course)
        return res.send(404, { message: "No Course Found Error" });

      User.find({
        where: {
          or: getConditionFromIDs(course.students)
        }
      }).sort('full_name DESC').done(function(err, users) {
        if (err || !users)
          return res.send(404, { message: "No User Found Error" }); 

        var usersObject = new Array();
        for (var index in users)
          usersObject.push(users[index]);
        var usersJSON = JSON.stringify(usersObject);
        return res.send(usersJSON);
      });
    });
	},

	grades: function(req, res) {
    res.contentType('application/json');
    var course_id = req.param('course_id');

    Course.findOne(Number(course_id)).done(function(err, course) {
      if (err || !course)
        return res.send(404, { message: "No Course Found Error" });

      User.find()
      .where({ or: getConditionFromIDs(course.students) })
      .sort('full_name DESC')
      .done(function(err, users) {
        if (err || !users)
          return res.send(404, { message: "No User Found Error" }); 

	  		Post.find()
	  		.where({ or: getConditionFromIDs(course.posts) })
	  		.sort('id DESC')
	  		.done(function(err, posts) {
	  			if (err || !posts) {
	  				return res.send(404, { message: "No Post Found Error" });
	  			}

			  	var postsObject = new Array();
					for (var index in posts) {
						if (posts[index].type == "attendance")
							postsObject.push(posts[index]);
					}

					var total_grade = postsObject.length;

	        var gradesObject = new Array();
	        for (var index in users) {
	        	var grade = 0;
	        	for (var i = 0; i < postsObject.length; i++) {
	        		for (var j = 0; j < postsObject[i].checks.length; j++) {
	        			if (postsObject[i].checks[j] == users[index].id)
	        				grade++;
	        		}
	        	}
	        	var gradeObject = new Object();
	        	gradeObject.id = users[index].id;
	        	gradeObject.grade = "" + grade + "/" + total_grade;
	          gradesObject.push(gradeObject);
	        }

	        var gradeJSON = JSON.stringify(gradesObject);
	        return res.send(gradeJSON);
	  		});
      });
    });
	}
};

// Function to get id list
var getConditionFromIDs = function(array) {
	var returnArray = new Array();
	for (var index in array) {
		var idObject = [];
		idObject["id"] = array[index];
		returnArray.push(idObject);
	}
	return returnArray;
}
