/**
 * Course
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {

  	courseName: {
  		type: 'string',
  		required: true
  	},

  	section: {
  		type: 'string'
  	},

  	onGoing: {
  		type: 'boolean',
  		defaultsTo: true,
  		required: true
  	}
    
  },

  // Lifecycle Callbacks
  beforeCreate: function(values, next) {
    Course.find().limit(1).sort('createdAt DESC').done(function(err, collections) {
      if (err) return next(err);

      var seqNo;
      if (collections.length == 0)
        seqNo = 1;
      else
        seqNo = parseInt(collections[0].id)+ 1;
      values._id = seqNo.toString();

      next();
    });
  }

};
