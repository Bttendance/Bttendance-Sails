/**
* ClickerChoice.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // One-to-many
    clicker: {
      model: 'Clicker',
      required: true,
      index: true
    },

    // One-to-one
    student: {
      model: 'User',
      required: true
    },

    choice: {
      type: 'string',
      required: true,
      enum: ['o', 'x', '1', '2', '3', '4', '5', 'a', 'b', 'c', 'd', 'e', 'text'],
      defaultsTo: 'text'
    },

    message: {
      type: 'string',
      required: true,
      defaultsTo: ''
    },

  }
};
