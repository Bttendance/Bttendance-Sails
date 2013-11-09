/**
 * Device
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    id_: {
      type: 'integer',
      unique: true
    },

    // iPhone, Android, Window, Blackberry, etc
    type: {
    	type: 'string',
    	required: true
    },

    // UUID
    uuid: {
    	type: 'uuid',
    	required: true,
      unique: true
    },
    
  }

};
