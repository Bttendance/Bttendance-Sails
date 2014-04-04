/**
 * Polls.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var connections = require('../../config/connections');

module.exports = {

	connection: connections.getRedis(),

	attributes: {

		a_students: {
			type: 'json'
		},

		b_students: {
			type: 'json'
		},

		c_students: {
			type: 'json'
		},

		d_students: {
			type: 'json'
		},

		post: {
			model: 'Posts'
		},

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      return obj;
    }
	}
};
