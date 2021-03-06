'use strict';

/**
 * Arrays.js
 *
 * @module			:: JSON Array Handler
 * @description	:: Contains logic for JSON Array handling.
 *
 */

module.exports = {

  getIds: function (jsonArray) {
    if (!jsonArray) {
      return [];
    }

    var ids = [];
    for (var i = 0; i < jsonArray.length; i++) {
      ids.push(jsonArray[i].id);
    }

    return ids;
  },

  getEmails: function (jsonArray) {
    if (!jsonArray) {
      return [];
    }

    var ids = [];
    for (var i = 0; i < jsonArray.length; i++) {
      ids.push(jsonArray[i].email);
    }

    return ids;
  }

};
