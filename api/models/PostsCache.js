/**
* PostsCache.js
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

  	posts: {
  		type: 'json',
      required: true
  	}

  },

  //course ids
  findManyFromCache: function(ids, cb) {
    if (ids.length == 0)
      return cb(null, []);

    PostsCache
    .findByCourseID(ids)
    .exec(function callback(err, postsCaches) {
      if (err)
        return cb(err);

      if (!postsCaches) 
        postsCaches = [];

      var cached = [];
      for (var i = 0; i < postsCaches.length; i++)
        if (postsCaches[i].posts)
          cached.push(postsCaches[i].courseID);

      var unCached = [];
      for (var i = ids.length - 1; i >= 0; i--)
        if (cached.indexOf(ids[i]) < 0)
          unCached.push(ids[i]);

      var objects = [];
      for (var i = 0; i < postsCaches.length; i++)
        for (var j = postsCaches[i].posts.length - 1; j >= 0; j--)
          objects.push(postsCaches[i].posts[j]);

      if (unCached.length == 0) {
        objects.sort(function(a, b) {
          return b.id - a.id;
        });
        return cb(null, objects);
      } else {
        Posts
        .find({
          course: unCached
        })
        .populate('attendance')
        .populate('clicker')
        .populate('notice')
        .exec(function callback(err, posts) {
          if (err || !posts)
            return cb(err)

          for (var i = posts.length - 1; i >= 0; i--)
            objects.push(posts[i].toWholeObject());

          var unCachedPosts = [];
          for (var i = 0; i < unCached.length; i++) {

            var postsOfCourse = [];
            for (var j = posts.length - 1; j >= 0; j--)
              if (unCached[i] == posts[j].course)
                postsOfCourse.push(posts[j].toWholeObject());

            PostsCache
            .create({
              courseID : unCached[i],
              posts : postsOfCourse
            }).exec(function callback(err, postsCache) {
            });
          }

          objects.sort(function(a, b) {
            return b.id - a.id;
          });

          return cb(null, objects);
        });
      }
    });
  },

  //course id
  findFromCache: function(id, cb) {
    PostsCache
    .findOneByCourseID(id)
    .exec(function callback(err, postsCache) {
      if (err || !postsCache) {
        Posts
        .find({
          course: id
        })
        .populate('attendance')
        .populate('clicker')
        .populate('notice')
        .exec(function callback(err, posts) {
          if (err || !posts)
            return cb(err);

          for (var i = posts.length - 1; i >= 0; i--)
            posts[i] = posts[i].toWholeObject();

          PostsCache
          .create({
            courseID : id,
            posts : posts
          }).exec(function callback(err, postsCache) {
            postsCache.posts.sort(function(a, b) {
              return b.id - a.id
            });
            return cb(null, postsCache.posts);
          });
        });
      } else {
        postsCache.posts.sort(function(a, b) {
          return b.id - a.id;
        });
        return cb(null, postsCache.posts);
      }
    });
  },

  //attendance after update
  updateAttendance: function(attendance) { 
    if (attendance.post && attendance.post.course) {
      PostsCache
      .findOneByCourseID(attendance.post.course)
      .exec(function callback(err, postsCache) {
        if (err || !postsCache)
          return;

        var found = false;
        for (var i = postsCache.posts.length - 1; i >= 0; i--) {
          if (postsCache.posts[i].id == attendance.post.id) {
            found = true;
            postsCache.posts[i].attendance.checked_students = attendance.checked_students;
            postsCache.posts[i].attendance.late_students = attendance.late_students;
          }
        }

        if (!found) {
          Posts
          .findOneById(attendance.post.id)
          .populate('attendance')
          .exec(function callback(err, post) {
            if (!err && post)
              PostsCache.addPost(post.toWholeObject());
          });
        } else {
          PostsCache
          .update({
            courseID : attendance.post.course
          }, {
            posts : postsCache.posts
          }).exec(function callback(err, postsCaches) {
          });
        }
      });
    }
  },

  //clicker after update
  updateClicker: function(clicker) {
    console.log('updateClicker');
    if (clicker.post && clicker.post.course) {
      PostsCache
      .findOneByCourseID(clicker.post.course)
      .exec(function callback(err, postsCache) {
        if (err || !postsCache)
          return;

        var found = false;
        for (var i = postsCache.posts.length - 1; i >= 0; i--) {
          if (postsCache.posts[i].id == clicker.post.id) {
            found = true;
            postsCache.posts[i].clicker.a_students = clicker.a_students;
            postsCache.posts[i].clicker.b_students = clicker.b_students;
            postsCache.posts[i].clicker.c_students = clicker.c_students;
            postsCache.posts[i].clicker.d_students = clicker.d_students;
            postsCache.posts[i].clicker.e_students = clicker.e_students;
          }
        }

        if (!found) {
          console.log('updateClicker : not found');
          Posts
          .findOneById(clicker.post.id)
          .populate('clicker')
          .exec(function callback(err, post) {
            if (!err && post)
              PostsCache.addPost(post.toWholeObject());
          });
        } else {
          console.log('updateClicker : found');
          PostsCache
          .update({
            courseID : clicker.post.course
          }, {
            posts : postsCache.posts
          }).exec(function callback(err, postsCaches) {
          });
        }
      });
    }
  },

  //notice after update
  updateNotice: function(notice) {
    if (notice.post && notice.post.course) {
      PostsCache
      .findOneByCourseID(notice.post.course)
      .exec(function callback(err, postsCache) {
        if (err || !postsCache)
          return;

        var found = false;
        for (var i = postsCache.posts.length - 1; i >= 0; i--) {
          if (postsCache.posts[i].id == notice.post.id) {
            found = true;
            postsCache.posts[i].notice.seen_students = notice.seen_students;
          }
        }

        if (!found) {
          Posts
          .findOneById(notice.post.id)
          .populate('notice')
          .exec(function callback(err, post) {
            if (!err && post)
              PostsCache.addPost(post.toWholeObject());
          });
        } else {
          PostsCache
          .update({
            courseID : notice.post.course
          }, {
            posts : postsCache.posts
          }).exec(function callback(err, postsCaches) {
          });
        }
      });
    }
  },

  //create post
  addPost: function(post) {
    // post.course = post.course.id;
    // post.author = post.author.id;
    // if (post.attendance && post.attendance.cluster)
    //   delete post.attendance.cluster;

    // PostsCache
    // .findOneByCourseID(post.course)
    // .exec(function callback(err, postsCache) {
    //   if (!err && postsCache && postsCache.posts) {

    //     var posts = [];
    //     posts.push(post);
    //     for (var i = postsCache.posts.length - 1; i >= 0; i--)
    //       posts.push(postsCache.posts[i]);

    //     PostsCache
    //     .update({
    //       courseID : post.course
    //     }, {
    //       posts : posts
    //     }).exec(function callback(err, postsCaches) {
    //     });
    //   }
    // });
  },

  //update message
  updatePost: function(post) {
    post.course = post.course.id;
    post.author = post.author.id;

    PostsCache
    .findOneByCourseID(post.course)
    .exec(function callback(err, postsCache) {
      if (!err && postsCache && postsCache.posts) {

        for (var i = postsCache.posts.length - 1; i >= 0; i--)
          if (postsCache.posts[i].id == post.id)
            postsCache.posts[i] = post;

        PostsCache
        .update({
          courseID : post.course
        }, {
          posts : postsCache.posts
        }).exec(function callback(err, postsCaches) {
        });
      }
    });
  },

  //remove post
  removePost: function(courseID, post) {
    PostsCache
    .findOneByCourseID(courseID)
    .exec(function callback(err, postsCache) {
      if (!err && postsCache && postsCache.posts) {

        var posts = [];
        for (var i = postsCache.posts.length - 1; i >= 0; i--)
          if (postsCache.posts[i].id != post.id)
            posts.push(postsCache.posts[i]);

        PostsCache
        .update({
          courseID : courseID
        }, {
          posts : posts
        }).exec(function callback(err, postsCaches) {
        });
      }
    });
  }
};

