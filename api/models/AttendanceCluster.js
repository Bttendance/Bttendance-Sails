/**
* AttendanceCluster.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // One-to-many
    attendance: {
      model: 'Attendance',
      required: true,
      index: true
    },

    // One-Way
    user: {
      model: 'User',
      required: true
    },

    clusterID: {
      type: 'integer',
      required: true,
      defaultsTo: 0
    }

  }
};

