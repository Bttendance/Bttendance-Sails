/**
 * Device
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    _id: {
      type: 'integer',
      unique: true
    },
    
  },

  // Lifecycle Callbacks
  beforeCreate: function(values, next) {

    // Dealing with MongoDB '_id'
    Device.find().limit(1).sort('createdAt DESC').done(function(err, objs) {
      if (err) return next(err);

      var seqNo;
      if (objs.length == 0)
        seqNo = 1;
      else
        seqNo = parseInt(objs[0].id) + 1;
      values._id = seqNo.toString();

      next();
    });
  }

};
