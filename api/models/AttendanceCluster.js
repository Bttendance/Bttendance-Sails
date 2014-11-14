/**
* AttendanceCluster.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var connections = require('../../config/connections');

module.exports = {

	connection: connections.getRedis(),

  attributes: {

  	attendanceID: {
  		type: 'integer',
  		required: true
  	},

  	email: {
  		type: 'email',
      required: true
  	},

  	uuid: {
  		type: 'string',
  		required: true
  	}

  },

  afterCreate: function(values, next) {
    next();
  }
};

