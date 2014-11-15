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

  }
};

