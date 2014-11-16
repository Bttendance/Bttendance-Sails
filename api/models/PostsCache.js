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
              return a.id - b.id
            });
            return cb(null, postsCache.posts);
          });
        });
      } else {
        postsCache.posts.sort(function(a, b) {
          return a.id - b.id
        });
        return cb(null, postsCache.posts);
      }
    });
  },

  //attendance after update
  updateAttendance: function(attendance) { 
  },

  //clicker after update
  updateClicker: function(clicker) {
  },

  //notice after update
  updateNotice: function(notice) {
  },

  //create post
  addPost: function(post) {
  },

  //update message
  updatePost: function(post) {
  },

  //remove post
  removePost: function(post) {
  }
};

