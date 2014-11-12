/**
 * Polls.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

    // One Way
    post: {
      model: 'Post',
      required: true,
      index: true
    },

    type: {
      type: 'string',
      required: true,
      enum: ['ox', 'star', 'mult2', 'mult3', 'mult4', 'mult5', 'essay'],
      defaultsTo: 'mult4'
    },

    message: {
      type: 'string',
      required: true,
      defaultsTo: ''
    },

    time: {
      type: 'integer',
      required: true,
      defaultsTo: 45
    },

    cheating: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    privacy: {
      type: 'string',
      enum: ['all', 'none', 'professor'],
      required: true,
      defaultsTo: 'professor'
    },

    // One to Many
    choices: {
      collection: 'ClickerChoice',
      via: 'clicker'
    },

    toJSON: function() {
      var obj = this.toObject();
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      return obj;
    }
	},

  afterCreate: function(values, next) {

    for (var i =  1; i <= values.progress_time; i++) {
      setTimeout(function() { 
    
        Clickers
        .findOneById(values.id)
        .populateAll()
        .exec(function callback(err, clicker) {
          if (clicker && clicker.post && clicker.post.course)
            sails.sockets.broadcast('Course#' + clicker.post.course, 'clicker', clicker.toWholeObject());       
        });

      }, i * 1000);
    };

    next();
  },

  afterUpdate: function(values, next) {
    
    var createdAt = Moment(values.createdAt);
    var diff = Moment().diff(createdAt);
    if (diff >= values.progress_time * 1000)
      Clickers
      .findOneById(values.id)
      .populateAll()
      .exec(function callback(err, clicker) {
        if (clicker && clicker.post && clicker.post.course)
          sails.sockets.broadcast('Course#' + clicker.post.course, 'clicker', clicker.toWholeObject());       
      });

    next();
  }

};
