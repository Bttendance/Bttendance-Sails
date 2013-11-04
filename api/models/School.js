/**
 * School
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {

    _id: {
      type: 'string',
      unique: true
    },

    name: {
    	type: 'string',
    	required: true
    },

    logoImage: {
    	type: 'url'
    },

    website: {
    	type: 'url'
    }
    
  },

  // Lifecycle Callbacks
  beforeCreate: function(values, next) {
    School.find().limit(1).sort('createdAt DESC').done(function(err, collections) {
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
