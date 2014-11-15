/**
* UserCache.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var connections = require('../../config/connections');

module.exports = {

	connection: connections.getRedis(),

  attributes: {

  	email: {
  		type: 'email',
  		required: true
  	},

  	user: {
  		type: 'json',
      required: true
  	}

  },

  findFromCache: function(email, cb) {
    UserCache
    .findOneByEmail(email)
    .exec(function callback(err, userCache) {
      if (err || !userCache) {
        Users
        .findOneByEmail(email)
        .populateAll()
        .exec(function callback(err, user) {
          if (err || !user)
            return cb(err);

          var userJson = user.toWholeObject();
          UserCache
          .create({
            email : email,
            user : userJson 
          }).exec(function callback(err, userCache) {
            return cb(null, userJson);
          });
        });
      } else {
        return cb(null, userCache.user);
      }
    });
  },

  updateFromCache: function(user) {
    UserCache
    .findOneByEmail(user.email)
    .exec(function callback(err, userCache) {
      if (err || !userCache) {
        UserCache
        .create({
          email : user.email,
          user : user.toWholeObject() 
        }).exec(function callback(err, userCache) {
        });
      } else {
        if (populateCount(userCache.user) > 0 && populateCount(user) == 0) {
          Users
          .findOneByEmail(user.email)
          .populateAll()
          .exec(function callback(err, user) {
            if (err || !user)
              return;

            UserCache
            .update({
              email : user.email
            }, {
              user : user.toWholeObject() 
            }).exec(function callback(err, userCache) {
            });
          });
        }

        UserCache
        .update({
          email : user.email
        }, {
          user : user.toWholeObject() 
        }).exec(function callback(err, userCache) {
        });
      }
    });
  }
};

var populateCount = function(user) {
  if (!user) 
    return 0;

  var count = 0;

  if (user.supervising_courses)
    count += user.supervising_courses.length;

  if (user.attending_courses)
    count += user.attending_courses.length;

  if (user.employed_schools)
    count += user.employed_schools.length;

  if (user.enrolled_schools)
    count += user.enrolled_schools.length;

  if (user.identifications)
    count += user.identifications.length;

  if (user.questions)
    count += user.questions.length;

  if (user.questions_count)
    count += user.questions_count;

  return count;
}