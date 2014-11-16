/**
* CourseCache.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var connections = require('../../config/connections');

module.exports = {

	connection: connections.getRedis(),

  attributes: {

  	courseID: {
  		type: 'integer',
  		required: true
  	},

  	course: {
  		type: 'json',
      required: true
  	}

  },

  toJSON: function(course) {
    var json = JSON.stringify(course);
    var obj = JSON.parse(json);
    if (course.school)
      obj.school = course.school.id;
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.managers;
    delete obj.students_count;
    delete obj.posts_count;
    delete obj.code;
    return obj;
  },

  findManyFromCache: function(ids, cb) {
    if (ids.length == 0)
      return cb(null, new Array());

    CourseCache
    .findByCourseID(ids)
    .exec(function callback(err, courseCaches) {
      if (err)
        return cb(err);

      if (!courseCaches) 
        courseCaches = new Array();

      var cached = new Array();
      for (var i = 0; i < courseCaches.length; i++)
        if (courseCaches[i].course)
          cached.push(courseCaches[i].course.id);

      var unCached = new Array();
      for (var i = ids.length - 1; i >= 0; i--)
        if (cached.indexOf(ids[i]) < 0)
          unCached.push(ids[i]);

      var objects = new Array();
      for (var i = 0; i < courseCaches.length; i++)
        objects.push(courseCaches[i].course);

      if (unCached.length == 0) {
        objects.sort(function(a, b) {
          return a.id - b.id
        });
        return cb(null, objects);
      } else {
        Courses
        .findById(unCached)
        .populateAll()
        .exec(function callback(err, courses) {
          if (err || !courses) 
            cb(err);

          for (var i = courses.length - 1; i >= 0; i--) {
            var courseJson = courses[i].toWholeObject();
            objects.push(courseJson);

            CourseCache
            .create({
              courseID : courseJson.id,
              course : courseJson
            }).exec(function callback(err, courseCache) {
            });
          }

          objects.sort(function(a, b) {
            return a.id - b.id
          });
          
          return cb(null, objects);
        });
      }
    });
  },

  findFromCache: function(id, cb) {
    CourseCache
    .findOneByCourseID(id)
    .exec(function callback(err, courseCache) {
      if (err || !courseCache) {
        Courses
        .findOneById(id)
        .populateAll()
        .exec(function callback(err, course) {
          if (err || !course)
            return cb(err);

          var courseJson = course.toWholeObject();
          CourseCache
          .create({
            courseID : id,
            course : courseJson 
          }).exec(function callback(err, courseCache) {
            return cb(null, courseJson);
          });
        });
      } else {
        return cb(null, courseCache.course);
      }
    });
  },

  updateFromCache: function(course) {

    CourseCache
    .findOneByCourseID(course.id)
    .exec(function callback(err, courseCache) {
      if (err || !courseCache) {
        CourseCache
        .create({
          courseID : course.id,
          course : course.toWholeObject() 
        }).exec(function callback(err, courseCache) {
        });
      } else {
        CourseCache
        .update({
          courseID : course.id
        }, {
          course : course.toWholeObject() 
        }).exec(function callback(err, courseCache){
        });
      }
    });
  }
};

