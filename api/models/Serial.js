/**
 * Serial
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    school: {
    	type: 'integer',
      required: true
    },

    key: 'string'
  },

  beforeCreate: function(values, next) {
    values.key = randomKey();
    next();
  }

};

function randomKey() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < 7; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}